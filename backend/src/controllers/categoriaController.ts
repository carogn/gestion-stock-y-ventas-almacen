import { Request, Response } from "express";
import Categoria from "../models/Categoria";

// Trae las categorias cargadas en la base
export const listarCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll({
      order: [["nombre", "ASC"]],
    });

    res.json(categorias);
  } catch (error) {
    console.error("Error al listar categorías:", error);

    res.status(500).json({
      message: "Error al obtener las categorías",
    });
  }
};

// Crea una categoria nueva
export const crearCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      res.status(400).json({
        message: "El nombre de la categoría es obligatorio",
      });
      return;
    }

    const categoriaExistente = await Categoria.findOne({
      where: {
        nombre: nombre.trim(),
      },
    });

    if (categoriaExistente) {
      res.status(409).json({
        message: "La categoría ya existe",
      });
      return;
    }

    const categoria = await Categoria.create({
      nombre: nombre.trim(),
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error("Error al crear categoría:", error);

    res.status(500).json({
      message: "Error al crear la categoría",
    });
  }
};