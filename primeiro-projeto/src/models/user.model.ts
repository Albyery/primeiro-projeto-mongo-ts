import mongoose, { Schema, Document } from "mongoose";

export interface UserDoc extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    createAt: Date;
    updateAt: Date;
}
const UserSchema = new Schema<UserDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<UserDoc>("User", UserSchema);