import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../types/userTypes";

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleId: { type: String, required: true,unique:true },
}, { timestamps: true })
export const UserModel :Model<IUser>=mongoose.model<IUser>("User",userSchema)