import { Note } from "../types/note";
import crypto from "crypto";
const notes: Note[] = [];
export function listAll(): Note[] { return notes; }
export function findById(id: string): Note | undefined { return notes.find(n => n.id === id); }
export function create(data: Pick<Note, "title" | "content">): Note {
    const now = new Date().toISOString();
    const note: Note = {
        id: crypto.randomUUID(), title: data.title, content: data.content,
        createdAt: now, updatedAt: now
    };
    notes.push(note);
    return note;
}
export function update(id: string, data: Partial<Pick<Note, "title" | "content">>): Note |
    undefined {
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return undefined;
    const before = notes[idx];
    const updated: Note = {
        ...before, title: data.title ?? before.title, content: data.content ??
            before.content, updatedAt: new Date().toISOString()
    };
    notes[idx] = updated;
    return updated;
}
export function remove(id: string): Note | undefined {
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return undefined;
    const [deleted] = notes.splice(idx, 1);
    return deleted;
}