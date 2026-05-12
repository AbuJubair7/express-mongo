import { Router } from "express";
import { OrganizationService } from "./organization.service.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authorized } from "../../middleware/authorize.middleware.js";

export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly app: Router,
  ) {}

  // Placeholder for organization-related controller methods
  activateRoutes() {
    // create org
    this.app.post("/", verifyToken, async (req, res) => {
      try {
        const result = await this.organizationService.createOrganization(
          req.body,
          res.locals.user,
        );
        res.json(result);
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // get all orgs
    this.app.get("/", verifyToken, async (req, res) => {
      try {
        const result = await this.organizationService.getAllOrganizations();
        res.json(result);
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // get org by id
    this.app.get("/:orgId", verifyToken, async (req, res) => {
      try {
        const { orgId } = req.params;
        const result = await this.organizationService.getOrganizationById(orgId as string);
        if (!result.success) {
          return res.status(404).json(result);
        }
        res.json(result);
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

    // get members of org
    this.app.get("/:orgId/members", verifyToken, async (req, res) => {
      try {
        const { orgId } = req.params;
        const result = await this.organizationService.getOrganizationMembers(orgId as string);
        if (!result.success) {
          return res.status(404).json(result);
        }
        res.json(result);
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    });

     // remove a member from an org (owner/admin only)
    this.app.delete(
      "/:orgId/members/:memberId",
      verifyToken,
      authorized,
      async (req, res) => {
        try {
          const { orgId, memberId } = req.params;
          const result = await this.organizationService.removeMember(
            orgId as string,
            memberId as string,
          );
          if (!result.success) {
            return res.status(404).json(result);
          }
          res.json(result);
        } catch (error) {
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
      },
    );

    // update a member's role (owner/admin only)
    this.app.patch(
      "/:orgId/members/:memberId",
      verifyToken,
      authorized,
      async (req, res) => {
        try {
          const { orgId, memberId } = req.params;
          const { role } = req.body ?? {};
          if (!role) {
            return res
              .status(400)
              .json({ success: false, message: "Missing role" });
          }
          const result = await this.organizationService.updateMemberRole(
            orgId as string,
            memberId as string,
            role as string,
          );
          if (!result.success) {
            return res.status(400).json(result);
          }
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
