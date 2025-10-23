import { Schema, model, Document, Types } from "mongoose";
const announcementSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course" }, // 可選，代表某門課程公告
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export default model("Announcement", announcementSchema);
//# sourceMappingURL=announcement-model.js.map