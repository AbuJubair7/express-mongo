import { Request, Response, NextFunction } from "express";
import OrganizationMembers from "../modules/organization/models/orgMembers.model.js";

export const canInvite = async (req: Request, res: Response, next: NextFunction) => {
  const {orgId, userId} = req.query;

  if (!orgId || !userId) {
    return res.status(400).json({ success: false, message: "Missing orgId or userId" });
  }

  try {
    const isOwnerOrAdmin = await OrganizationMembers.findOne({
      orgId: orgId as string,
      userId: userId as string,
      role: { $in: ["owner", "admin"] },
    });

    if (isOwnerOrAdmin) {
      return next();
    }
    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};