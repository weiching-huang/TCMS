import { Schema, model, Document, Types } from "mongoose";

export interface IAnnouncement extends Document {
  course?: Types.ObjectId;
  title: string;
  content: string;
  createdBy: Types.ObjectId;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" }, // 可選，代表某門課程公告
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IAnnouncement>("Announcement", announcementSchema);
