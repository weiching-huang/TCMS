import { Schema, model, Document, Types } from "mongoose";
const enrollmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    status: {
        type: String,
        enum: ["pending", "paid", "canceled"],
        default: "pending",
    },
    paidAt: { type: Date },
});
export default model("Enrollment", enrollmentSchema);
//# sourceMappingURL=enroll-model.js.map