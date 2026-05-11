import { Request, Response, NextFunction } from "express";
import Invite from "../modules/invite/models/invite.model.js";

const canUpdateInvite = async (req: Request, res: Response, next: NextFunction) => {
  const { inviteId } = req.params;
  const { _id } = res.locals.user;

  if (!inviteId) {
    return res.status(400).json({ success: false, message: "Missing inviteId" });
  }

  try {
    const canUpdate = await Invite.findOne({
      userId: _id,
      status: "pending",
    });
    if (!canUpdate) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default canUpdateInvite;