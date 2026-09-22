import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./config/database";
import "./models";
import productoRoutes from "./routes/productoRoutes";
import ventaRoutes from "./routes/ventaRoutes";

// Variables de entorno
dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rutas de productos
app.use("/productos", productoRoutes);
// Rutas de ventas
app.use("/ventas", ventaRoutes);

// Para chequear rápido que levante la API
app.get("/", (_req, res) => {
  res.json({ message: "API de gestión de stock y ventas funcionando" });
});

const PORT = process.env.PORT || 3000;

// Pruebo la conexión y creo las tablas de los modelos que todavía no existen
database
  .authenticate()
  .then(async () => {
    console.log("Conectado a PostgreSQL");

    await database.sync();

    console.log("Modelos sincronizados");
  })
  .catch((error) => {
    console.error("Error al conectar con PostgreSQL:", error);
  });

// Levanto el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});