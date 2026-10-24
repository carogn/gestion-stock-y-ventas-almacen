import { Request, Response } from "express";
import database from "../config/database";
import { Producto, Venta, DetalleVenta } from "../models";

// Registra una venta con uno o más productos
export const crearVenta = async (req: Request, res: Response) => {
  const transaction = await database.transaction();

  try {
    const { items } = req.body;

    // Valido que venga al menos un producto
    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "La venta debe contener al menos un producto",
      });
    }

    const detallesPreparados = [];
    let totalVenta = 0;

    // Primero valido todos los productos antes de guardar la venta
    for (const item of items) {
      const { productoId, cantidad } = item;

      // Valido la cantidad
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        await transaction.rollback();

        return res.status(400).json({
          message: "La cantidad debe ser un número entero mayor a 0",
        });
      }

      // Busco el producto
      const producto = await Producto.findByPk(productoId, { transaction });

      if (!producto) {
        await transaction.rollback();

        return res.status(404).json({
          message: `Producto con id ${productoId} no encontrado`,
        });
      }

      // No permito vender productos inactivos
      if (!producto.activo) {
        await transaction.rollback();

        return res.status(400).json({
          message: `El producto ${producto.nombre} se encuentra inactivo`,
        });
      }

      // Valido stock disponible
      if (producto.stock < cantidad) {
        await transaction.rollback();

        return res.status(400).json({
          message: `Stock insuficiente para ${producto.nombre}`,
        });
      }

      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * cantidad;

      totalVenta += subtotal;

      // Guardo temporalmente la información
      // todavía no persisto nada
      detallesPreparados.push({
        producto,
        productoId: producto.id,
        cantidad,
        precioUnitario,
        subtotal,
      });
    }

    // Creo una sola cabecera de venta
    const venta = await Venta.create(
      {
        total: totalVenta,
      },
      { transaction }
    );

    // Creo los detalles y descuento stock
    for (const detalle of detallesPreparados) {
      await DetalleVenta.create(
        {
          ventaId: venta.id,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal,
        },
        { transaction }
      );

      detalle.producto.stock -= detalle.cantidad;

      await detalle.producto.save({ transaction });
    }

    // Confirmo toda la operación
    await transaction.commit();

    return res.status(201).json({
      message: "Venta registrada correctamente",
      venta,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Error al registrar la venta:", error);

    return res.status(500).json({
      message: "Error al registrar la venta",
    });
  }
};

export const listarVentas = async (_req: Request, res: Response) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        {
          model: DetalleVenta,
          as: "detalles",
          include: [
            {
              model: Producto,
              as: "producto",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    return res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al listar las ventas:", error);

    return res.status(500).json({
      message: "Error al listar las ventas",
    });
  }
};