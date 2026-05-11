import { Request, Response, NextFunction } from "express";
import OrganizationMembers from "../modules/organization/models/orgMembers.model.js";

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId} = res.locals.user;
    const {orgId} = req.query;

    if (!userId || !orgId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const member = await OrganizationMembers.findOne({ orgId, userId });
    if (!member) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (member.role !== "owner" && member.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Authorization error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }

  next();
};
