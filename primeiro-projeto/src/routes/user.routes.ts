import { Router } from "express";
import { createUser, deleteUser, listUser, updateUser } from "../controllers/user.controller";

const r = Router();
// criar Usuário
r.post("/criar", createUser);
// listar usuários
r.get("/listar", listUser);
// atualizar usuário
r.put("/atualizar/:id", updateUser);
// remover usuário
r.delete("/deletar/:id", deleteUser);

export default r;