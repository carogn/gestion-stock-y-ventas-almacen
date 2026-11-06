import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        email: String(email).trim().toLowerCase(),
        activo: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const passwordValida = await bcrypt.compare(
      String(password),
      usuario.passwordHash
    );

    if (!passwordValida) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "JWT_SECRET no configurado",
      });
    }

    const token = jwt.sign(
      {
        usuarioId: usuario.id,
        email: usuario.email,
      },
      jwtSecret,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
};