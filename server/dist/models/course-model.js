import { Schema, model, Document, Types } from "mongoose";
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    maxStudents: {
        type: Number,
        required: true,
    },
    totalSessions: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    materials: [String],
    announcements: [
        {
            type: Schema.Types.ObjectId,
            ref: "Announcement",
        },
    ],
    teacherShareRatio: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    adminShareRatio: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        enum: ["upcoming", "completed"],
        default: "upcoming",
        required: true,
    },
}, { timestamps: true });
export default model("Course", courseSchema);
//# sourceMappingURL=course-model.js.map