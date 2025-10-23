import { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "teacher" | "student";
    phone?: string;
    avatar?: string;
    createdAt: Date;
    comparePassword(Password: string): Promise<boolean>;
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user-model.d.ts.map