import { Router } from "express";
import { createUser, listUser, updateUser, deleteUser } from
    "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication";
const r = Router();
// Público: cadastro (sign-up)
r.post("/", createUser);
// Protegido: a partir daqui, precisa de token
r.use(authenticate);

// Agora, somente com Bearer token válido:
r.get("/", listUser);
// r.get("/:id", getUser);
r.put("/:id", updateUser);
r.delete("/:id", deleteUser);