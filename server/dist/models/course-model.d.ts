import { Document, Types } from "mongoose";
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
        type: String;
        enum: ["upcoming", "completed"];
        default: "upcoming";
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<ICourse, {}, {}, {}, Document<unknown, {}, ICourse, {}, {}> & ICourse & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=course-model.d.ts.map