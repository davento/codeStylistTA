import { Router } from "express";
import { processInput } from "../controllers/input.controller.js";

const router = Router();

// == Function to process the input
router.get("/input", processInput);

export default router;