import { Request, Response, NextFunction } from "express";
import OrganizationMembers from "../modules/organization/models/orgMembers.model.js";

export const canInvite = async (req: Request, res: Response, next: NextFunction) => {
  const {orgId, userId} = req.query;
  const { _id } = res.locals.user;

  if (!orgId || !userId) {
    return res.status(400).json({ success: false, message: "Missing orgId or userId" });
  }

  try {
    const isOwnerOrAdmin = await OrganizationMembers.findOne({
      orgId: orgId as string,
      userId: _id as string,
      // role: { $in: ["owner", "admin"] },
    });
    console.log("canInvite check for userId:", userId, "orgId:", orgId, "isOwnerOrAdmin:", isOwnerOrAdmin);
    if (isOwnerOrAdmin?.role === "owner" || isOwnerOrAdmin?.role === "admin") {
      return next();
    }
    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};