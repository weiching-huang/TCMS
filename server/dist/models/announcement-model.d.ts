import { Document, Types } from "mongoose";
export interface IAnnouncement extends Document {
    course?: Types.ObjectId;
    title: string;
    content: string;
    createdBy: Types.ObjectId;
}
declare const _default: import("mongoose").Model<IAnnouncement, {}, {}, {}, Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=announcement-model.d.ts.map