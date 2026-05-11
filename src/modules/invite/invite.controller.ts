import { Router, Request, Response } from "express";
import { InviteService } from "./invite.service.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { canInvite } from "../../middleware/inviteMiddleware.js";

export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly app: Router,
  ) {}

  activateRoutes() {
    this.app.post(
      "/",
      verifyToken,
      canInvite,
      async (req: Request, res: Response) => {
        try {
          const { orgId, userId } = req.query;
          const result = await this.inviteService.createInvite(
            orgId as string,
            userId as string,
          );
          res.json(result);
        } catch (error) {
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
      },
    );
  }
}
