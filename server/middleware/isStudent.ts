import type { Request, Response, NextFunction } from "express";

export const isStudent = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any; 

  if (!user) {
    return res.status(401).json({ success: false, message: "尚未登入" });
  }

  if (user.role !== "student") {
    return res.status(403).json({ success: false, message: "只有學生可以操作" });
  }

  next();
};
