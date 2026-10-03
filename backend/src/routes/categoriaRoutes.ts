import { Router } from "express";
import {
  crearCategoria,
  listarCategorias,
} from "../controllers/categoriaController";

const router = Router();

router.get("/", listarCategorias);
router.post("/", crearCategoria);

export default router;