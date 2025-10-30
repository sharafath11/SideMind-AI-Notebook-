import { Document, Types } from "mongoose";

export interface ISubject extends Document {
  _id: Types.ObjectId;   
  userId:string
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
