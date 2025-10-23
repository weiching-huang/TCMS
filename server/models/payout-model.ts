import { Schema, model, Document } from "mongoose";

export interface IPayout extends Document {
  teacher: Schema.Types.ObjectId;   // 哪位老師
  month: string;                    // YYYY-MM，例如 "2025-09"
  totalSessions: number;            // 實際上課堂數 (結算時統計)
  totalAmount: number;              // 學生實際上課所付總金額
  teacherShare: number;             // 給老師的金額
  adminShare: number;               // 教室抽成
  status: "pending" | "paid";       // 狀態 (待付款 / 已付款)
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // 格式建議 YYYY-MM
    totalSessions: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    teacherShare: { type: Number, required: true },
    adminShare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IPayout>("Payout", payoutSchema);
