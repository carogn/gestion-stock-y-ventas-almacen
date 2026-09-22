import { Router } from "express";
import {
  listarProductos,
  crearProducto,
} from "../controllers/productoController";

const router = Router();

// GET /productos
router.get("/", listarProductos);

// POST /productos
router.post("/", crearProducto);

export default router;