import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  teacher: Types.ObjectId;
  amount: number;
  teacherShare: number; 
  adminShare: number; 
  status: "pending" | "completed" | "refunded";
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  teacherShare: { type: Number, required: true },
  adminShare: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IPayment>("Payment", paymentSchema);
