Lista de Exercícios Tópicos Avançados em Computação II
Professor: Gustavo da Silva Andrade

Adicionando JWT às rotas de Usuário

1) Instalar bibliotecas necessárias
No terminal, na raiz do projeto:
npm i jsonwebtoken
npm i -D @types/jsonwebtoken
# (opcional, caso ainda não tenha)
npm i bcrypt
npm i -D @types/bcrypt
Se você carrega variáveis de ambiente via .env, confirme que usa dotenv:
npm i dotenv
2) Configurar variáveis no .env
Crie/altere o arquivo .env na raiz do projeto (e garanta que está no .gitignore):
JWT_SECRET=troque_esta_chave_por_algo_secreto_e_forte
JWT_EXPIRES_IN=1h
Dica: em src/server.ts, garanta que o .env é carregado:
import "dotenv/config";
3) Criar o controller de autenticação (emite o token)
Arquivo: src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
export async function login(req: Request, res: Response) {
try {
const { email, password } = req.body ?? {};
if (!email || !password) {

return res.status(400).json({ error: "email e password obrigatórios" });
}
const user = await UserModel.findOne({ email }).exec();
if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
const payload = { sub: user._id.toString(), email: user.email };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
return res.json({ data: { token, expiresIn: JWT_EXPIRES_IN } });
} catch (err) {
console.error(err);
return res.status(500).json({ error: "Erro no login" });
}
}
4) Criar as rotas de autenticação
Arquivo: src/routes/auth.routes.ts
import { Router } from "express";
import { login } from "../controllers/auth.controller";
const r = Router();
// POST /api/v1/auth/login
r.post("/login", login);
export default r;
Registrar no roteador principal (src/routes/index.ts):
import { Router } from "express";
import usersRouter from "./users.routes";
import authRouter from "./auth.routes";
const router = Router();
router.use("/users", usersRouter);
router.use("/auth", authRouter); // -> /api/v1/auth/login
export default router;
5) Criar middleware de autenticação (valida o token)

Arquivo: src/middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface JwtPayloadCustom {
sub: string;
email?: string;
iat?: number;
exp?: number;
}
export function authenticate(req: Request & { user?: any }, res: Response, next:
NextFunction) {
const auth = req.headers.authorization;
if (!auth || !auth.startsWith("Bearer ")) {
return res.status(401).json({ error: "Token ausente" });
}
const token = auth.slice(7);
try {
const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadCustom;
(req as any).user = { id: payload.sub, email: payload.email };
next();
} catch {
return res.status(401).json({ error: "Token inválido" });
}
}
6) Proteger as rotas de usuário com o middleware
Arquivo: src/routes/users.routes.ts (exemplo típico: cadastro e login públicos;
listagem/atualização/exclusão protegidas)
import { Router } from "express";
import { createUser, listUsers, getUser, updateUser, deleteUser } from
"../controllers/users.controller";
import { authenticate } from "../middlewares/authenticate";
const r = Router();
// Público: cadastro (sign-up)
r.post("/", createUser);
// Protegido: a partir daqui, precisa de token
r.use(authenticate);

// Agora, somente com Bearer token válido:
r.get("/", listUsers);
r.get("/:id", getUser);
r.put("/:id", updateUser);
r.delete("/:id", deleteUser);
export default r;
Variante: se quiser tudo protegido (inclusive cadastro), aplique
r.use(authenticate) antes de todas as rotas e remova a rota POST / da parte
pública.

7) Testes por etapa (Postman/cURL)
Etapa 1 — Criar um usuário (caso ainda não exista)
Garanta que o createUser do seu controller hasheia a senha com bcrypt (ver
Anexo A).
curl -X POST http://localhost:3000/api/v1/users \
-H "Content-Type: application/json" \
-d '{"name":"Gustavo","email":"rf1482@ucdb.br","password":"QueroFerias123"}'
Esperado: 201 Created com id, name, email e sem passwordHash.

Etapa 2 — Fazer login e obter JWT
curl -X POST http://localhost:3000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"name":"Gustavo","email":"rf1482@ucdb.br","password":"QueroFerias123"}'
Esperado: 200 OK com JSON contendo { "data": { "token": "<JWT>", "expiresIn": "1h" } }.
Copie o <JWT> retornado.

Etapa 3 — Acessar rota protegida COM token
curl http://localhost:3000/api/v1/users \
-H "Authorization: Bearer <JWT>"
Esperado: 200 OK listando usuários.

Etapa 4 — Acessar rota protegida SEM token
curl http://localhost:3000/api/v1/users
Esperado: 401 Unauthorized com { "error": "Token ausente" }.

Etapa 5 — Token inválido ou expirado
• Para testar expiração, defina temporariamente no .env:
JWT_EXPIRES_IN=10s
• Refaça o login, aguarde ~12s e tente acessar rota protegida com o token antigo:
deve retornar 401 com { "error": "Token inválido" }.
8) Dicas e solução de problemas
• 401 Token ausente: verifique o header exato Authorization: Bearer <token>.
• JWT inválido: normalmente é segredo diferente (confira JWT_SECRET) ou
token corrompido/expirado.
• .env não carregado: confirme import "dotenv/config"; em src/server.ts e se o
arquivo .env está na raiz.
• Senha não confere no login: certifique-se de que está hasheando no cadastro
e usando bcrypt.compare no login.
• CommonJS x ESM: mantenha "module":"CommonJS" no tsconfig.json e
"type":"commonjs" no package.json (ou ajuste o script dev com
--compiler-options).