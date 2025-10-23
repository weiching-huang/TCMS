import { Schema, model, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  status: "pending" | "paid" | "canceled";
  paidAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollment>({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "canceled"],
    default: "pending",
  },
  paidAt: { type: Date },
});

export default model<IEnrollment>("Enrollment", enrollmentSchema);
