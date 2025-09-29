import { Router } from "express";
import notesRouter from "./notes.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = Router();

router.use("/notes", notesRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;