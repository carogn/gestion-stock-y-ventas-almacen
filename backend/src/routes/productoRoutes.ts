import { Router } from "express";
import {
  crearProducto,
  desactivarProducto,
  editarProducto,
  listarProductos,
  reponerStock,
} from "../controllers/productoController";

const router = Router();

router.get("/", listarProductos);
router.post("/", crearProducto);
router.put("/:id", editarProducto);
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/reponer", reponerStock);

export default router;