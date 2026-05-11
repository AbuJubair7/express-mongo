import Organization, { IOrganization } from "./models/organization.model.js";
import { OrganizationDTO } from "./dto/organization.dto.js";
import crypto from "crypto";
import { IUser } from "../user/models/user.model.js";
import { OrganizationMembers } from "./models/orgMembers.model.js";

interface OrganizationResponse {
  success: boolean;
  message: string;
  data?: IOrganization | IOrganization[];
}

const sendResponse = (
  success: boolean,
  message: string,
  data?: IOrganization | IOrganization[],
): OrganizationResponse => {
  return {
    success,
    message,
    data,
  };
};

export class OrganizationService {
  constructor() {}

  // Placeholder for organization-related methods
  createOrganization = async (
    orgData: OrganizationDTO,
    userData: IUser,
  ): Promise<OrganizationResponse> => {
    // Placeholder for creating an organization
    try {
      const newOrg = new Organization({
        _id: crypto.randomUUID(),
        ...orgData,
      });
      const newOrgMember = new OrganizationMembers({
        _id: crypto.randomUUID(),
        orgId: newOrg._id,
        userId: userData._id,
        role: "owner",
        status: "active",
        invitedAt: new Date(),
        joinedAt: new Date(),
      });

      await newOrg.save();
      await newOrgMember.save();
      return sendResponse(true, "Organization created successfully", newOrg);
    } catch (error) {
      throw new Error("Failed to create organization");
    }
  };

  getAllOrganizations = async (): Promise<OrganizationResponse> => {
    try {
      const organizations = await Organization.find();
      return sendResponse(
        true,
        "Organizations fetched successfully",
        organizations,
      );
    } catch (error) {
      throw new Error("Failed to fetch organizations");
    }
  };
}
