import type { Request, Response, NextFunction } from "express";
import express, { Router } from "express";
import passport from "passport";
import Payout from "../models/payout-model.js";
import Attendance from "../models/attendance-model.js";
import Course from "../models/course-model.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router: Router = express.Router();

// 管理者專用

//查詢所有老師的 payout
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { month } = req.query;
      const filter: any = {};
      if (month) filter.month = month;

      const payouts = await Payout.find(filter).populate(
        "teacher",
        "name email"
      );
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ message: "查詢失敗", error });
    }
  }
);

// 老師專用
// 查詢自己的 payout 列表
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (user.role !== "teacher") {
        return res
          .status(403)
          .json({ success: false, message: "只有老師可以查看" });
      }
      const { month } = req.query;
      const filter: any = { teacher: user._id };
      if (month) filter.month = month;

      const payouts = await Payout.find(filter).sort({ month: -1 });
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ message: "查詢失敗", error });
    }
  }
);
// 查詢單筆自己的 payout 詳細內容
router.get(
  "/me/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (user.role !== "teacher") {
        return res
          .status(403)
          .json({ success: false, message: "只有老師可以查看" });
      }
      const payout = await Payout.findById(req.params.id);
      if (!payout) return res.status(404).json({ message: "找不到該 payout" });

      // 確保只能查自己的
      if (String(payout.teacher) !== String(user._id)) {
        return res.status(403).json({ message: "無權限查看此 payout" });
      }

      res.json(payout);
    } catch (error) {
      res.status(500).json({ message: "查詢失敗", error });
    }
  }
);

// 查詢單筆 payout 詳細內容
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const payout = await Payout.findById(req.params.id).populate(
        "teacher",
        "name email"
      );
      if (!payout) return res.status(404).json({ message: "找不到該 payout" });
      res.json(payout);
    } catch (error) {
      res.status(500).json({ message: "查詢失敗", error });
    }
  }
);

// 觸發結算程序
router.post(
  "/settle",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const previousMonth = currentMonth - 1;

      const startDate = new Date(currentYear, previousMonth, 1);
      const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      console.log("上個月開始日期：", startDate);
      console.log("上個月結束日期：", endDate);

      // 取得一個 YYYY-MM 格式的月份字串，用於 Payout 文件的唯一標識
      const settlementMonth = `${startDate.getFullYear()}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      // 取得該月份所有上課紀錄
      const attendances = await Attendance.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate(
        "course",
        "teacher fee totalSessions teacherShareRatio adminShareRatio"
      );

      // 用 Map 按老師統計
      const teacherMap: Map<
        string,
        {
          totalSessions: number;
          totalAmount: number;
          teacherShare: number;
          adminShare: number;
        }
      > = new Map();

      for (const att of attendances) {
        const course = att.course as any;
        if (!course) continue;

        const teacherId = course.teacher.toString();
        const feePerSession = course.fee / course.totalSessions;
        const teacherRatio = course.teacherShareRatio / 100 ;
        const adminRatio = course.adminShareRatio / 100 ;

        // 計算本次 attendance 實際上課的人數
        const attendedCount = att.records.filter(
          (r) => r.status === "present"
        ).length;
        const totalAmount = attendedCount * feePerSession;
        const teacherShare = totalAmount * teacherRatio;
        const adminShare = totalAmount * adminRatio;

        if (!teacherMap.has(teacherId)) {
          teacherMap.set(teacherId, {
            totalSessions: 0,
            totalAmount: 0,
            teacherShare: 0,
            adminShare: 0,
          });
        }

        const stats = teacherMap.get(teacherId)!;
        stats.totalSessions += attendedCount;
        stats.totalAmount += totalAmount;
        stats.teacherShare += teacherShare;
        stats.adminShare += adminShare;
      }

      // 將統計結果寫入 Payout
      const payoutResults = [];
      for (const [teacherId, stats] of teacherMap.entries()) {
        // 避免同一老師同月重複結算
        let payout = await Payout.findOne({
          teacher: teacherId,
          month: settlementMonth,
        });
        if (!payout) {
          payout = new Payout({
            teacher: teacherId,
            month: settlementMonth,
            totalSessions: stats.totalSessions,
            totalAmount: stats.totalAmount,
            teacherShare: stats.teacherShare,
            adminShare: stats.adminShare,
            status: "pending",
          });
        } else {
          // 如果已存在，更新金額
          payout.totalSessions = stats.totalSessions;
          payout.totalAmount = stats.totalAmount;
          payout.teacherShare = stats.teacherShare;
          payout.adminShare = stats.adminShare;
        }

        await payout.save();
        payoutResults.push(payout);
      }
      const formattedStartDate = `${startDate.getFullYear()}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${startDate.getDate().toString().padStart(2, "0")}`;

      const formattedEndDate = `${endDate.getFullYear()}-${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

      const settledate = `${formattedStartDate} ~ ${formattedEndDate}`;

      res.json({
        success: true,
        month: settlementMonth,
        settledate: settledate,
        payouts: payoutResults,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "結算失敗", error });
    }
  }
);

// 更新 payout 狀態 (例如標記已付薪水)
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const payout = await Payout.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!payout)
        return res.status(404).json({ message: "找不到該筆 payout" });
      res.json({ message: "更新成功", payout });
    } catch (error) {
      res.status(500).json({ message: "更新失敗", error });
    }
  }
);

export default router;
