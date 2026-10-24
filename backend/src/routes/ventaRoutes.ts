import { Router } from "express";
import {
  crearVenta,
  listarVentas,
} from "../controllers/ventaController";

const router = Router();

//GET /ventas
router.get("/", listarVentas);
// POST /ventas
router.post("/", crearVenta);

export default router;