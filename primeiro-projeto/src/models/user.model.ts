import mongoose, { Schema, Document, mongo } from "mongoose";

export interface UserDoc extends Document {
    name: string;
    email: string;
    passwordHash: string;
    createAt: Date;
    updateAt: Date;
}

const UserSchema = new Schema<UserDoc>(
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        passwordHash: { type: String, required: true }
    },
    { timestamps: true }
)

export const UserModel = mongoose.model<UserDoc>("User", UserSchema);