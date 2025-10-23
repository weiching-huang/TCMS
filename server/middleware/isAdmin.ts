import type{ Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "沒有權限操作"
    });
  }

  next();
};