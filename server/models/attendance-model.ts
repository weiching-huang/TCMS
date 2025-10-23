import { Schema, model, Document, Types } from "mongoose";

export interface IAttendance extends Document {
  course: Types.ObjectId; 
  date: Date;
  records: {
    student: Types.ObjectId;
    status: "present" | "absent" | "leave";
    isManualLeave?: boolean;
  }[];
}

const attendanceSchema = new Schema<IAttendance>(
  {
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
  },
  { timestamps: true }
);

export default model<IAttendance>("Attendance", attendanceSchema);