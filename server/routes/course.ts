import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import Course from "../models/course-model.js";
import User from "../models/user-model.js";
import Enrollment from "../models/enroll-model.js";
import Payment from "../models/payment-model.js";

import { isAdmin } from "../middleware/isAdmin.js";
import { isTeacherOfCourse } from "../middleware/isTeacherOfCourse.js";
const router: Router = express.Router();

//管理者建立課程
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        teacher,
        maxStudents,
        totalSessions,
        fee,
        materials,
        teacherShareRatio,
        adminShareRatio,
      } = req.body;

      // 檢查比例是否正確
      if (teacherShareRatio + adminShareRatio !== 100) {
        return res.status(400).json({
          success: false,
          message: "分帳比例必須加總為100%",
        });
      }

      // 確認老師是否存在
      const teacherUser = await User.findById(teacher);
      if (!teacherUser || teacherUser.role !== "teacher") {
        return res.status(400).json({
          success: false,
          message: "找不到老師",
        });
      }

      // 建立課程
      const course = await Course.create({
        title,
        description,
        teacher,
        maxStudents,
        totalSessions,
        fee,
        materials,
        teacherShareRatio,
        adminShareRatio,
      });

      res.status(201).json({
        success: true,
        message: "課程建立成功",
        course,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "伺服器錯誤",
      });
    }
  }
);
//管理者刪除課程
router.delete(
  "/:courseId",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "課程不存在" });
      }

      await Course.findByIdAndDelete(courseId);

      res.json({ success: true, message: "課程刪除成功" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

//管理者更新課程
router.put(
  "/:courseId",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      // 檢查更新內容中的分帳比例
      const { teacherShareRatio, adminShareRatio, ...rest } = req.body;
      if (
        teacherShareRatio !== undefined &&
        adminShareRatio !== undefined &&
        teacherShareRatio + adminShareRatio !== 100
      ) {
        return res.status(400).json({
          success: false,
          message: "分帳比例必須加總為100%",
        });
      }
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.courseId,
        req.body,
        { new: true, runValidators: true }
      ).populate("teacher", "_id name email");
      if (!updatedCourse) {
        return res.status(404).json({ success: false, message: "課程不存在" });
      }
      res.json({ success: true, message: "課程更新成功", data: updatedCourse });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

// 取得所有課程
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { teacherId, studentId, page = 1, limit = 6, search } = req.query;
      let query: any = {};
      const user: any = req.user;
      // Admin 可以看所有課程
      if (user.role === "admin") {
        if (teacherId) query.teacher = teacherId;
        if (studentId) {
          const enrollments = await Enrollment.find({ student: studentId })
            .select("course")
            .lean();
          const courseIds = enrollments.map((e) => e.course);
          query._id = { $in: courseIds };
        }
      }

      // Teacher 只能看自己的課程
      if (user.role === "teacher") {
        query.teacher = user._id;
      }

      // Student 只能看自己報名的課程
      if (user.role === "student") {
        const enrollments = await Enrollment.find({ student: user._id })
          .select("course")
          .lean();
        const courseIds = enrollments.map((e) => e.course);
        query._id = { $in: courseIds };
      }

      // 搜尋功能
      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const courses = await Course.find(query)
        .populate("teacher", "name email")
        .select(
          "title description fee teacher maxStudents totalSessions status"
        )
        .skip(skip)
        .limit(Number(limit));

      //.populate("announcements"); 之後announcement寫好在加
      const total = await Course.countDocuments(query);
      res.json({
        success: true,
        data: courses,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "伺服器錯誤，無法取得課程",
      });
    }
  }
);

//查詢目前新開課
router.get("/ads", async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({
      status: "upcoming",
    }).select("title description fee totalSessions maxStudents");

    res.json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得廣告課程",
    });
  }
});

//學生查看自己報名的課程
// router.get(
//   "/enrolled",
//   passport.authenticate("jwt", { session: false }),
//   async (req: Request, res: Response) => {
//     try {
//       const user = req.user as any;
//       if (user.role !== "student") {
//         return res
//           .status(403)
//           .json({ success: false, message: "只有學生可以查看" });
//       }

//       // 找出學生報名的所有課程 ID
//       const enrollments = await Enrollment.find({ student: user._id }).populate(
//         "course"
//       );

//       res.json({ success: true, data: enrollments });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: "伺服器錯誤" });
//     }
//   }
// );

//取得單一課程資訊

router.get("/:courseId", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "teacher",
      "name email"
    );
    //.populate("announcements"); // 顯示公告
    if (!course) {
      return res.status(404).json({ success: false, message: "課程不存在" });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

//學生報名課程
router.post(
  "/:courseId/enroll",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "課程不存在" });
      }

      const user = req.user as any;
      const userId = user._id;
      const courseId = req.params.courseId;

      // 只有學生能報名課程
      if (user.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "只有學生可以報名課程",
        });
      }

      // 檢查課程人數是否已滿
      const enrollmentCount = await Enrollment.countDocuments({
        course: courseId,
        status: { $ne: "canceled" },
        //$ne 是 MongoDB 的 不等於 運算子。表示排除已取消報名的學生。
      });
      if (enrollmentCount >= course.maxStudents) {
        return res.status(400).json({ success: false, message: "課程已滿" });
      }

      // 檢查學生是否已報名
      const existing = await Enrollment.findOne({
        student: userId,
        course: courseId,
        status: { $ne: "canceled" },
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "已報名此課程" });
      }

      /// 建立報名紀錄
      await Enrollment.create({
        student: userId,
        course: courseId,
        status: "pending",
      });
      // 建立付款紀錄
      const payment = new Payment({
        course: courseId,
        student: userId,
        teacher: course.teacher,
        amount: course.fee,
        teacherShare: course.fee * (course.teacherShareRatio / 100),
        adminShare: course.fee * (course.adminShareRatio / 100),
        status: "pending", // 尚未繳費
      });
      await payment.save();

      res.json({ success: true, message: "報名成功，等待繳費" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

//管理者查看該課程的所有學生

router.get(
  "/:courseId/students",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (user.role === "admin") {
      return next(); // 管理員直接通過
    }
    return isTeacherOfCourse(req, res, next);
  },
  async (req: Request, res: Response) => {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
      status: { $ne: "canceled" },
    })
      .populate("student", "name email")
      .populate("course", "title");

    res.json({ success: true, data: enrollments });
  }
);

// 查詢單一課程的所有付款紀錄 (管理員)
router.get(
  "/:courseId/payments",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      // 確認課程存在
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "課程不存在" });
      }

      // 查詢付款紀錄
      const payments = await Payment.find({ course: courseId })
        .populate("student", "name email")
        .populate("teacher", "name email")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: payments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

//查詢未付款學生
router.get(
  "/:courseId/unpaid",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      //檢查課程是否存在
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "課程不存在" });
      }

      // 查找該課程所有未付款學生
      const unpaidPayments = await Enrollment.find({
        course: courseId,
        status: "pending",
      })
        .populate("student", "name email")
        .populate("course", "title");

      const unpaidStudents = unpaidPayments.map((p) => ({
        enrollmentId: p._id,
        courseTitle: (p.course as any).title,
        studentName: (p.student as any).name,
        studentEmail: (p.student as any).email,
        studentId: (p.student as any)._id,
        status: p.status,
      }));

      res.json({ success: true, students: unpaidStudents });
    } catch (error) {
      res.status(500).json({ success: false, message: "查詢失敗", error });
    }
  }
);

// 學生繳費(管理員才能點選)
router.put(
  "/:courseId/pay",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { studentId } = req.body;
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
        status: { $ne: "canceled" },
      });

      if (!enrollment) {
        return res
          .status(404)
          .json({ success: false, message: "未找到報名紀錄，無法繳費" });
      }

      if (enrollment.status === "paid") {
        return res
          .status(400)
          .json({ success: false, message: "已經繳過費了" });
      }
      // 找 payment
      const payment = await Payment.findOne({
        student: studentId,
        course: courseId,
        status: "pending",
      });
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "未找到付款紀錄" });
      }

      // 更新報名紀錄為已繳費
      enrollment.status = "paid";
      enrollment.paidAt = new Date();
      await enrollment.save();

      // 更新 payment
      payment.status = "completed";
      await payment.save();

      res.json({
        success: true,
        message: "繳費成功",
        data: enrollment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

// 學生退款 (管理員才能點選)
router.put(
  "/:courseId/refund",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { studentId } = req.body;

      // 找 enrollment
      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
        status: "paid", // 只有繳過費才能退款
      });
      if (!enrollment) {
        return res
          .status(404)
          .json({ success: false, message: "未找到已繳費紀錄，無法退款" });
      }

      // 找 payment
      const payment = await Payment.findOne({
        student: studentId,
        course: courseId,
        status: "completed",
      });
      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "未找到付款紀錄" });
      }
      if (payment.status === "refunded") {
        return res
          .status(400)
          .json({ success: false, message: "此學生已退款過" });
      }

      // 更新 enrollment
      enrollment.status = "canceled";
      await enrollment.save();

      // 更新 payment
      payment.status = "refunded";
      await payment.save();

      res.json({
        success: true,
        message: "退款成功",
        data: { enrollment, payment },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

export default router;
