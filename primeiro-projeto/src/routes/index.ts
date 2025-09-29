import { Router } from "express";
import notesRouter from "./notes.routes";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use("/notes", notesRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;