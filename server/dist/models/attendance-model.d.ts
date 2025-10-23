import { Document, Types } from "mongoose";
export interface IAttendance extends Document {
    course: Types.ObjectId;
    date: Date;
    records: {
        student: Types.ObjectId;
        status: "present" | "absent" | "leave";
        isManualLeave?: boolean;
    }[];
}
declare const _default: import("mongoose").Model<IAttendance, {}, {}, {}, Document<unknown, {}, IAttendance, {}, {}> & IAttendance & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=attendance-model.d.ts.map