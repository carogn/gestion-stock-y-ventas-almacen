import { Request, Response } from "express";
import database from "../config/database";
import { Producto, Venta, DetalleVenta } from "../models";

// Registra una venta simple de un producto
export const crearVenta = async (req: Request, res: Response) => {
  const transaction = await database.transaction();

  try {
    const { productoId, cantidad } = req.body;

    // Busco el producto que se quiere vender
    const producto = await Producto.findByPk(productoId, { transaction });

    if (!producto) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    // Valido que la cantidad sea correcta
    if (!cantidad || cantidad <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "La cantidad debe ser mayor a 0",
      });
    }

    // No permito vender más unidades de las disponibles
    if (producto.stock < cantidad) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Stock insuficiente",
      });
    }

    const precioUnitario = Number(producto.precio);
    const subtotal = precioUnitario * cantidad;

    // Primero creo la cabecera de la venta
    const venta = await Venta.create(
      {
        total: subtotal,
      },
      { transaction }
    );

    // Guardo qué producto y cantidad forman parte de la venta
    await DetalleVenta.create(
      {
        ventaId: venta.id,
        productoId: producto.id,
        cantidad,
        precioUnitario,
        subtotal,
      },
      { transaction }
    );

    // Descuento del stock las unidades vendidas
    producto.stock -= cantidad;

    await producto.save({ transaction });

    // Confirmo todos los cambios juntos
    await transaction.commit();

    res.status(201).json({
      message: "Venta registrada correctamente",
      venta,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Error al registrar la venta:", error);

    res.status(500).json({
      message: "Error al registrar la venta",
    });
  }
};