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