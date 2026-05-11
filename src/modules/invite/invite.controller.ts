import { Router, Request, Response } from "express";
import { InviteService } from "./invite.service.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { canInvite } from "../../middleware/inviteMiddleware.js";
import canUpdateInvite from "../../middleware/canUpdateInvite.middleware.js";

export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly app: Router,
  ) {}

  activateRoutes() {
    // create invite
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

    // get invite by id
    this.app.get("/", verifyToken, async (req: Request, res: Response) => {
      try {
        const { _id } = res.locals.user;
        const invite = await this.inviteService.getInviteById(_id as string);
        if (!invite) {
          return res
            .status(404)
            .json({ success: false, message: "Invite not found" });
        }
        res.json({ success: true, data: invite });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // update invite status
    this.app.patch(
      "/:inviteId",
      verifyToken,
      canUpdateInvite,
      async (req: Request, res: Response) => {
        try {
          const { inviteId } = req.params;
          const { status } = req.body;
          const result = await this.inviteService.updateInviteStatus(
            inviteId as string,
            status as string,
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
