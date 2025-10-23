import { Schema, model, Document, Types } from "mongoose";
const attendanceSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    date: { type: Date, required: true },
    records: [
        {
            student: { type: Schema.Types.ObjectId, ref: "User", required: true },
            status: {
                type: String,
                enum: ["present", "absent", "leave"],
                required: true,
            },
            isManualLeave: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });
export default model("Attendance", attendanceSchema);
//# sourceMappingURL=attendance-model.js.map