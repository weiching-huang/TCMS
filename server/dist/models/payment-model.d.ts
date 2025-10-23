import { Document, Types } from "mongoose";
export interface IPayment extends Document {
    course: Types.ObjectId;
    student: Types.ObjectId;
    teacher: Types.ObjectId;
    amount: number;
    teacherShare: number;
    adminShare: number;
    status: "pending" | "completed" | "refunded";
    createdAt: Date;
}
declare const _default: import("mongoose").Model<IPayment, {}, {}, {}, Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=payment-model.d.ts.map