import { Router } from "express";
import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user-model.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

// 取得所有老師
router.get(
  "/teachers",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const teachers = await User.find({ role: "teacher" }).select(
        "name email"
      );
      res.json({ success: true, data: teachers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

// 取得所有學生
router.get(
  "/students",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const students = await User.find({ role: "student" }).select(
        "name email"
      );
      res.json({ success: true, data: students });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
  }
);

// 更新特定使用者
router.patch(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updatedData = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "找不到使用者" });
      }
      // 更新欄位
      if (updatedData.name !== undefined) user.name = updatedData.name;
      if (updatedData.email !== undefined) user.email = updatedData.email;
      if (updatedData.role !== undefined) user.role = updatedData.role;

      if (updatedData.password && updatedData.password !== "") {
        user.password = updatedData.password;
      }

      await user.save();
      
      res.json({ success: true, message: "使用者資料更新成功", data: user });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "伺服器錯誤，無法更新使用者資料" });
    }
  }
);

// 刪除特定使用者
router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "找不到使用者" });
      }

      res.json({ success: true, message: "使用者資料刪除成功" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "伺服器錯誤，無法刪除使用者資料" });
    }
  }
);

export default router;
