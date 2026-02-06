import mongoose, { Schema, Document } from "mongoose";

export interface IQuote extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message?: string;
  status: "pending" | "contacted" | "quoted" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "quoted", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quote ||
  mongoose.model<IQuote>("Quote", QuoteSchema);
