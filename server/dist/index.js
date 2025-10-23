import express from 'express';
import mongoose from 'mongoose';
import passport from "passport";
import passportConfig from "./config/passport.js";
import dotenv from 'dotenv';
import cors from "cors";
import authRoute from './routes/auth.js';
import courseRoute from './routes/course.js';
import attendanceRoute from './routes/attendance.js';
import payoutRoute from './routes/payout.js';
import annouceRoute from './routes/announcement.js';
import userRoute from './routes/user.js';
dotenv.config();
passportConfig(passport);
const app = express();
const dbConnectString = process.env.DB_CONNECT;
if (!dbConnectString) {
    throw new Error("DB_CONNECT is not defined in the environment variables.");
}
mongoose.connect(dbConnectString).then(() => {
    console.log("connect to Mongo Atlas.");
}).catch((e) => {
    console.log(e);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(cors());
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/courses", courseRoute);
app.use("/attendance", attendanceRoute);
app.use("/payouts", payoutRoute);
app.use("/announcement", annouceRoute);
app.listen(8080, () => {
    console.log("Server is running on port 8080.");
});
//# sourceMappingURL=index.js.map