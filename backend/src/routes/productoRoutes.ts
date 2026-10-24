import { Router } from "express";
import {
  crearProducto,
  desactivarProducto,
  editarProducto,
  listarProductos,
  reponerStock,
  listarProductosStockBajo,
} from "../controllers/productoController";

const router = Router();

router.get("/", listarProductos);
router.post("/", crearProducto);
router.get("/stock-bajo", listarProductosStockBajo);
router.put("/:id", editarProducto);
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/reponer", reponerStock);

export default router;