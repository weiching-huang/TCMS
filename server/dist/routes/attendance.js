import express, { Router } from "express";
import passport from "passport";
import Attendance from "../models/attendance-model.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isStudent } from "../middleware/isStudent.js";
import { isTeacherOfCourse } from "../middleware/isTeacherOfCourse.js";
const router = express.Router();
//學生查看自己出缺席
router.get("/me", passport.authenticate("jwt", { session: false }), isStudent, async (req, res) => {
    try {
        const studentId = req.user._id;
        const attendance = await Attendance.find({
            "records.student": studentId,
        }).select("course date records");
        // 過濾出該學生的出缺席紀錄
        const studentRecords = attendance.map((att) => {
            const studentRecord = att.records.find((r) => r.student.toString() === studentId.toString());
            return {
                course: att.course,
                date: att.date,
                status: studentRecord?.status,
            };
        });
        res.json(studentRecords);
    }
    catch (error) {
        res.status(500).json({ message: "查詢失敗", error });
    }
});
// 老師新增點名紀錄
router.post("/:courseId", passport.authenticate("jwt", { session: false }), isTeacherOfCourse, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { records } = req.body;
        // 檢查當天是否已有該課程的點名紀錄
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        let attendance = await Attendance.findOne({
            course: courseId,
            date: { $gte: today, $lte: endOfDay },
        });
        if (attendance) {
            // 如果已存在，則更新學生的紀錄
            const existingMap = new Map(attendance.records.map((r) => [r.student.toString(), r]));
            records.forEach((newRecord) => {
                const existing = existingMap.get(newRecord.student.toString());
                if (existing?.isManualLeave || existing?.status === "leave") {
                    return;
                }
                existingMap.set(newRecord.student.toString(), newRecord);
            });
            attendance.records = Array.from(existingMap.values());
            await attendance.save();
            return res.json({ message: "點名紀錄已更新", attendance });
        }
        else {
            // 如果不存在，則建立新的點名紀錄
            attendance = new Attendance({
                course: courseId,
                date: new Date(),
                records,
            });
            await attendance.save();
            return res.status(201).json({ message: "新增點名成功", attendance });
        }
    }
    catch (error) {
        res.status(500).json({ message: "新增點名失敗", error });
    }
});
//查詢課程點名紀錄 (Teacher / Admin)
router.get("/:courseId", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    const user = req.user;
    if (user.role === "admin")
        return next();
    return isTeacherOfCourse(req, res, next);
}, async (req, res) => {
    try {
        const { courseId } = req.params;
        const attendance = await Attendance.find({ course: courseId })
            .populate("records.student", "name email")
            .sort({ date: -1 });
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ message: "查詢失敗", error });
    }
});
// 學生請假
router.post("/:courseId/leave", passport.authenticate("jwt", { session: false }), isStudent, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;
        // 找到今天的點名紀錄
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        let attendance = await Attendance.findOne({
            course: courseId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });
        // 檢查當天是否已經有該學生的請假紀錄
        const existingLeave = await Attendance.findOne({
            course: courseId,
            date: { $gte: startOfDay, $lte: endOfDay },
            "records.student": studentId,
            "records.status": "leave",
        });
        if (existingLeave) {
            return res.status(400).json({
                success: false,
                message: "已經請過假了",
            });
        }
        if (attendance) {
            // 已經有老師點名 → 禁止事後請假
            return res.status(400).json({
                success: false,
                message: "無法事後請假，請聯絡老師處理",
            });
        }
        // 沒有點名 → 學生可自己請假，建立新紀錄
        const newAttendance = new Attendance({
            course: courseId,
            date: new Date(),
            records: [{ student: studentId, status: "leave", isManualLeave: true }],
        });
        await newAttendance.save();
        res.json({
            success: true,
            message: "請假成功",
            course: newAttendance.course,
            date: newAttendance.date,
            status: "leave",
        });
    }
    catch (error) {
        res.status(500).json({ message: "請假失敗", error });
    }
});
export default router;
//# sourceMappingURL=attendance.js.map