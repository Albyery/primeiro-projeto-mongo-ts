import { Request, Response } from "express";
import * as NoteModel from "../models/note.model";
export function list(_req: Request, res: Response) {
    res.json({ data: NoteModel.listAll() });
}
export function get(req: Request, res: Response) {
    const item = NoteModel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Note não encontrada" });
    res.json({ data: item });
}
export function create(req: Request, res: Response) {
    const { title, content } = req.body ?? {};
    if (!title) return res.status(400).json({ error: "title obrigatório" });
    const item = NoteModel.create({ title, content });
    res.status(201).json({ data: item });
}
export function update(req: Request, res: Response) {
    const item = NoteModel.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "Note não encontrada" });
    res.json({ data: item });
}
export function remove(req: Request, res: Response) {
    const item = NoteModel.remove(req.params.id);
    if (!item) return res.status(404).json({ error: "Note não encontrada" });
    res.json({ data: item });
}