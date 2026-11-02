import { Router } from "express";
import { obtenerDashboard } from "../controllers/dashboardController";

const router = Router();

// GET /dashboard
router.get("/", obtenerDashboard);

export default router;