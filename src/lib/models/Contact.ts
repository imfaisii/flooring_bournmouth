import mongoose, { Schema, type Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "responded"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
