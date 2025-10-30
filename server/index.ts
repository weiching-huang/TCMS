import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import passportConfig from "./config/passport.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.js";
import courseRoute from "./routes/course.js";
import attendanceRoute from "./routes/attendance.js";
import payoutRoute from "./routes/payout.js";
import annouceRoute from "./routes/announcement.js";
import userRoute from "./routes/user.js";
dotenv.config();
passportConfig(passport);

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tcms-system.vercel.app", 
  "https://tcms-system-git-master-weiching-huangs-projects.vercel.app", 
  "https://tcms-system-g68bdl6bp-weiching-huangs-projects.vercel.app", 
];

const dbConnectString = process.env.DB_CONNECT;

if (!dbConnectString) {
  throw new Error("DB_CONNECT is not defined in the environment variables.");
}

mongoose
  .connect(dbConnectString)
  .then(() => {
    console.log("connect to Mongo Atlas.");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("--- CORS CHECK: Received Origin ---", origin);
      // 允許無來源 (例如移動應用或 curl 請求)
      if (!origin) return callback(null, true);
      // 檢查來源是否在允許清單中
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(cors());
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/courses", courseRoute);
app.use("/attendance", attendanceRoute);
app.use("/payouts", payoutRoute);
app.use("/announcement", annouceRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
