import { Document, Types } from "mongoose";
export interface IEnrollment extends Document {
    student: Types.ObjectId;
    course: Types.ObjectId;
    status: "pending" | "paid" | "canceled";
    paidAt?: Date;
}
declare const _default: import("mongoose").Model<IEnrollment, {}, {}, {}, Document<unknown, {}, IEnrollment, {}, {}> & IEnrollment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=enroll-model.d.ts.map