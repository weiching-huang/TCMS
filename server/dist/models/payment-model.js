import { Schema, model, Document, Types } from "mongoose";
const paymentSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    teacherShare: { type: Number, required: true },
    adminShare: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});
export default model("Payment", paymentSchema);
//# sourceMappingURL=payment-model.js.map