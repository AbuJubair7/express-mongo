import { Router } from "express";
import { OrganizationService } from "./organization.service.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import UserService from "../user/user.service.js";

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
        console.log("Organization creation result:", result);
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
  }
}
