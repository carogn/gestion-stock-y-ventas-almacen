import bcrypt from "bcryptjs";
import database from "../config/database";
import Usuario from "../models/Usuario";

async function crearUsuarioAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const nombre = process.env.ADMIN_NOMBRE || "Administrador";

    if (!email || !password) {
      throw new Error(
        "Configurá ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env"
      );
    }

    await database.authenticate();
    await database.sync();

    const existente = await Usuario.findOne({
      where: { email },
    });

    if (existente) {
      console.log("El usuario administrador ya existe");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Usuario.create({
      nombre,
      email,
      passwordHash,
      activo: true,
    });

    console.log("Usuario administrador creado correctamente");
  } catch (error) {
    console.error("Error al crear usuario:", error);
    process.exitCode = 1;
  } finally {
    await database.close();
  }
}

crearUsuarioAdmin();