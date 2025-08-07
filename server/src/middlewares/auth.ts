import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { role?: string }; // assume middleware decoded token

  if (!user || user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next();
}
