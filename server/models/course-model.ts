import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacher: Types.ObjectId;
  maxStudents: number;
  totalSessions: number;
  fee: number;
  materials: string[];
  announcements: Types.ObjectId[];
  teacherShareRatio: number;
  adminShareRatio: number;
  status: {
  type: String,
  enum: ["upcoming", "completed"], 
  default: "upcoming"
},
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
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
  },
  { timestamps: true }
);

export default model<ICourse>("Course", courseSchema);
