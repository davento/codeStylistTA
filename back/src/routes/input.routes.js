import { Router } from "express";
import { processInput } from "../controllers/input.controller";
// import controller functions

const router = Router();

// create the function for this
router.get("/input", processInput);

export default router;