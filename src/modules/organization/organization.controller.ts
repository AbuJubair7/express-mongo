import { Router } from "express";
import { OrganizationService } from "./organization.service.js";
import { verifyToken } from "../../middleware/auth.middleware.js";

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
  }
}
