import bcrypt from "bcryptjs";
import database from "../config/database";
import Usuario from "../models/Usuario";

async function crearUsuarioAdmin() {
  try {
    await database.authenticate();
    await database.sync();

    const email = "admin@mandadito.com";
    const password = "admin123";

    const existente = await Usuario.findOne({
      where: { email },
    });

    if (existente) {
      console.log("El usuario admin ya existe");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Usuario.create({
      nombre: "Carolina",
      email,
      passwordHash,
      activo: true,
    });

    console.log("Usuario creado correctamente");
    console.log("Email:", email);
    console.log("Contraseña:", password);
  } catch (error) {
    console.error("Error al crear usuario:", error);
  } finally {
    await database.close();
  }
}

crearUsuarioAdmin();