import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user.model";

// Carregar variáveis de ambiente do .env
dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido no .env");
}

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
        const options: SignOptions = {
            expiresIn: JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"],
        };

        jwt.sign(payload, JWT_SECRET, options, (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro ao gerar token" });
            }

            if (!token) {
                return res.status(500).json({ error: "Token não gerado" });
            }

            return res.json({ data: { token, expiresIn: JWT_EXPIRES_IN } });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro no login" });
    }
}
