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