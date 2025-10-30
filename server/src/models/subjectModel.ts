import { model, Schema } from "mongoose";
import { ISubject } from "../types/subjectTypes";

const SubjectSchema = new Schema<ISubject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    userId:{type:String,required:true}
  },
  {
    timestamps: true,
  }
);
export const SubjectModel = model<ISubject>("Subject", SubjectSchema);