import { Request, Response } from "express";
import Producto from "../models/Producto";
import Categoria from "../models/Categoria";

// Trae todos los productos cargados en la base
export const listarProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },
      ],
    });

    res.json(productos);
  } catch (error) {
    console.error("Error al listar productos:", error);

    res.status(500).json({
      message: "Error al obtener los productos",
    });
  }
};

// Crea un producto nuevo
export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, precio, stock, stockMinimo, categoriaId } = req.body;

    // Valido los datos obligatorios del producto
    if (!nombre || !nombre.trim()) {
      res.status(400).json({
        message: "El nombre del producto es obligatorio",
      });
      return;
    }

    if (precio === undefined || Number(precio) <= 0) {
      res.status(400).json({
        message: "El precio debe ser mayor a 0",
      });
      return;
    }

    if (stock === undefined || Number(stock) < 0) {
      res.status(400).json({
        message: "El stock no puede ser negativo",
      });
      return;
    }

    if (stockMinimo === undefined || Number(stockMinimo) < 0) {
      res.status(400).json({
        message: "El stock mínimo no puede ser negativo",
      });
      return;
    }

    if (!categoriaId) {
      res.status(400).json({
        message: "La categoría es obligatoria",
      });
      return;
    }

    // Verifico que la categoría recibida exista
    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
      res.status(404).json({
        message: "La categoría indicada no existe",
      });
      return;
    }

    const producto = await Producto.create({
      nombre: nombre.trim(),
      precio: Number(precio),
      stock: Number(stock),
      stockMinimo: Number(stockMinimo),
      categoriaId,
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error("Error al crear producto:", error);

    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};

// Edita los datos de un producto
export const editarProducto = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, stockMinimo, categoriaId } = req.body;

    // Busco el producto que se quiere modificar
    const producto = await Producto.findByPk(id);

    if (!producto) {
      res.status(404).json({
        message: "Producto no encontrado",
      });
      return;
    }

    // Valido los nuevos datos
    if (!nombre || !nombre.trim()) {
      res.status(400).json({
        message: "El nombre del producto es obligatorio",
      });
      return;
    }

    if (precio === undefined || Number(precio) <= 0) {
      res.status(400).json({
        message: "El precio debe ser mayor a 0",
      });
      return;
    }

    if (stockMinimo === undefined || Number(stockMinimo) < 0) {
      res.status(400).json({
        message: "El stock mínimo no puede ser negativo",
      });
      return;
    }

    if (!categoriaId) {
      res.status(400).json({
        message: "La categoría es obligatoria",
      });
      return;
    }

    // Verifico que la categoría exista
    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
      res.status(404).json({
        message: "La categoría indicada no existe",
      });
      return;
    }

    // Actualizo solamente los datos editables
    producto.nombre = nombre.trim();
    producto.precio = Number(precio);
    producto.stockMinimo = Number(stockMinimo);
    producto.categoriaId = categoriaId;

    await producto.save();

    res.json(producto);
  } catch (error) {
    console.error("Error al editar producto:", error);

    res.status(500).json({
      message: "Error al editar el producto",
    });
  }
};

// Desactiva un producto sin eliminarlo de la base
export const desactivarProducto = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const producto = await Producto.findByPk(id);

    if (!producto) {
      res.status(404).json({
        message: "Producto no encontrado",
      });
      return;
    }

    if (!producto.activo) {
      res.status(400).json({
        message: "El producto ya se encuentra inactivo",
      });
      return;
    }

    producto.activo = false;

    await producto.save();

    res.json({
      message: "Producto desactivado correctamente",
      producto,
    });
  } catch (error) {
    console.error("Error al desactivar producto:", error);

    res.status(500).json({
      message: "Error al desactivar el producto",
    });
  }
};

// Suma unidades al stock actual de un producto
export const reponerStock = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { cantidad } = req.body ?? {};

    const cantidadNumerica = Number(cantidad);

    if (
      cantidad === undefined ||
      cantidadNumerica <= 0 ||
      !Number.isInteger(cantidadNumerica)
    ) {
      res.status(400).json({
        message: "La cantidad a reponer debe ser un número entero mayor a 0",
      });
      return;
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      res.status(404).json({
        message: "Producto no encontrado",
      });
      return;
    }

    producto.stock += cantidadNumerica;

    await producto.save();

    res.json({
      message: "Stock repuesto correctamente",
      producto,
    });
  } catch (error) {
    console.error("Error al reponer stock:", error);

    res.status(500).json({
      message: "Error al reponer el stock",
    });
  }
};