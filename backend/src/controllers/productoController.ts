import { Request, Response } from "express";
import Producto from "../models/Producto";

// Trae todos los productos cargados en la base
export const listarProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await Producto.findAll();

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
    const { nombre, precio, stock, stockMinimo } = req.body;

    const producto = await Producto.create({
      nombre,
      precio,
      stock,
      stockMinimo,
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error("Error al crear producto:", error);

    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};