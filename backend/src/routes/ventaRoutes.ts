import { Router } from "express";
import { crearVenta } from "../controllers/ventaController";

const router = Router();

// POST /ventas
router.post("/", crearVenta);

export default router;