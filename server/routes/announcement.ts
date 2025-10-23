import type { Request, Response, NextFunction } from "express";
import express, { Router } from "express";
import passport from "passport";
import { Types } from "mongoose";
import Announcement from "../models/announcement-model.js";
import Course from "../models/course-model.js";
import { isAdmin } from "../middleware/isAdmin.js";
import Enrollment from "../models/enroll-model.js";

const router: Router = Router();

/**
 * 新增公告
 * 權限：Admin / Teacher
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (user.role !== "admin" && user.role !== "teacher") {
        return res
          .status(403)
          .json({ success: false, message: "只有管理者或老師可新增公告" });
      }

      const { courseId, title, content } = req.body;

      if (user.role === "teacher") {
        const course = await Course.findById(courseId);
        if (!course || course.teacher.toString() !== user._id.toString()) {
          return res
            .status(403)
            .json({ success: false, message: "只能新增自己課程的公告" });
        }
      }

      if (!title || !content) {
        return res
          .status(400)
          .json({ success: false, message: "標題與內容必填" });
      }

      const announcement = await Announcement.create({
        course: courseId || undefined,
        title,
        content,
        createdBy: user._id,
      });

      // 若有 courseId，把公告加到課程
      if (courseId) {
        const course = await Course.findById(courseId);
        if (course) {
          course.announcements.push(announcement._id as Types.ObjectId);
          await course.save();
        }
      }

      res.json({ success: true, message: "公告新增成功", data: announcement });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

//取得全部公告
router.get("/", async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 12;
  const skip = (page - 1) * limit;
  try {
    const totalAnnouncements = await Announcement.countDocuments();
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: announcements,
      totalPages: Math.ceil(totalAnnouncements / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

//學生查看自己有報名課程的公告

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const studentId = user._id;
      if (user.role !== "student") {
        return res
          .status(403)
          .json({ success: false, message: "只有學生可以查看自己的公告" });
      }

      // 找出學生報名的課程
      const enrollments = await Enrollment.find({ student: studentId }).select(
        "course"
      );
      const courseIds = enrollments.map((e) => e.course);

      // 找出課程的公告
      const announcements = await Announcement.find({
        course: { $in: courseIds },
      })
        .populate("course", "title") 
        .sort({ createdAt: -1 }); 

      res.json({ success: true, data: announcements });
    } catch (err) {
      res.status(500).json({ success: false, message: "伺服器發生錯誤" });
    }
  }
);

// 老師查看自己課程的公告
router.get(
  "/mine",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (user.role !== "teacher") {
        return res.status(403).json({
          success: false,
          message: "只有老師可以查看自己課程公告",
        });
      }

      // 找出老師開設的課程
      const courses = await Course.find({ teacher: user._id }).select("_id");
      const courseIds = courses.map((c) => c._id);

      // 找出這些課程的公告
      const announcements = await Announcement.find({
        course: { $in: courseIds },
      })
        .populate("course", "title")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: announcements });
    } catch (err) {
      res.status(500).json({ success: false, message: "伺服器發生錯誤" });
    }
  }
);

//取得單一公告

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("course", "title");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "公告不存在" });
    }

    res.json({ success: true, data: announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

/**
 * 刪除公告
 * 權限：Admin / 建立該公告的 Teacher
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const announcement = await Announcement.findById(req.params.id);

      if (!announcement) {
        return res.status(404).json({ success: false, message: "公告不存在" });
      }

      // 權限檢查：Admin 或是公告建立者
      if (
        user.role !== "admin" &&
        announcement.createdBy.toString() !== user._id.toString()
      ) {
        return res
          .status(403)
          .json({ success: false, message: "無權限刪除此公告" });
      }

      // 從課程中移除該公告 ID
      if (announcement.course) {
        await Course.updateOne(
          { _id: announcement.course },
          { $pull: { announcements: announcement._id } }
        );
      }

      await announcement.deleteOne();

      res.json({ success: true, message: "公告已刪除" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

export default router;
