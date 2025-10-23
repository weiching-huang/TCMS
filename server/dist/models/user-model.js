import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        required: true,
    },
    phone: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
};
export default model("User", userSchema);
//# sourceMappingURL=user-model.js.map