import { Schema, model, Document } from "mongoose";
const payoutSchema = new Schema({
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
}, { timestamps: true });
export default model("Payout", payoutSchema);
//# sourceMappingURL=payout-model.js.map