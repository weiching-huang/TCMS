import { Schema, Document } from "mongoose";
export interface IPayout extends Document {
    teacher: Schema.Types.ObjectId;
    month: string;
    totalSessions: number;
    totalAmount: number;
    teacherShare: number;
    adminShare: number;
    status: "pending" | "paid";
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<IPayout, {}, {}, {}, Document<unknown, {}, IPayout, {}, {}> & IPayout & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=payout-model.d.ts.map