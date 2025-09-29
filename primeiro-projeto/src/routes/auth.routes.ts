import { Router } from "express";
import { login } from "../controllers/auth.controller";
const r = Router();
// POST /api/v1/auth/login
r.post("/login", login);
export default r;