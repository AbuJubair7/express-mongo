import Organization, { IOrganization } from "./models/organization.model.js";
import { OrganizationDTO } from "./dto/organization.dto.js";
import crypto from "crypto";
import { IUser } from "../user/models/user.model.js";
import { IOrganizationMembers, OrganizationMembers } from "./models/orgMembers.model.js";
import { ORGANIZATION_MEMBER_ROLES } from "./dto/orgMember.dto.js";

interface OrganizationResponse {
  success: boolean;
  message: string;
  data?: IOrganization | IOrganization[] | IOrganizationMembers[] | IOrganizationMembers;
}

const sendResponse = (
  success: boolean,
  message: string,
  data?: IOrganization | IOrganization[] | IOrganizationMembers[] | IOrganizationMembers,
): OrganizationResponse => {
  return {
    success,
    message,
    data,
  };
};

export class OrganizationService {
  constructor() {}

  // create organization
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

  // get all organizations
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

  // get organization by id
  getOrganizationById = async (orgId: string): Promise<OrganizationResponse> => {
    try {
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return sendResponse(false, "Organization not found");
      }
      return sendResponse(true, "Organization fetched successfully", organization);
    } catch (error) {
      throw new Error("Failed to fetch organization");
    }
  };

  // get members from organization id
  getOrganizationMembers = async (orgId: string): Promise<OrganizationResponse> => {
    try {
      const members = await OrganizationMembers.find({ orgId });
      return sendResponse(true, "Members fetched successfully", members);
    } catch (error) {
      throw new Error("Failed to fetch members");
    }
  };

   // remove a member from an organization
  removeMember = async (
    orgId: string,
    memberId: string,
  ): Promise<OrganizationResponse> => {
    try {
      const member = await OrganizationMembers.findOne({ _id: memberId, orgId });
      if (!member) {
        return sendResponse(false, "Member not found");
      }
      await OrganizationMembers.deleteOne({ _id: memberId, orgId });
      return sendResponse(true, "Member removed successfully", member);
    } catch (error) {
      throw new Error("Failed to remove member");
    }
  };

  // update a member's role
  updateMemberRole = async (
    orgId: string,
    memberId: string,
    role: string,
  ): Promise<OrganizationResponse> => {
    try {
      if (!ORGANIZATION_MEMBER_ROLES.includes(role as (typeof ORGANIZATION_MEMBER_ROLES)[number])) {
        return sendResponse(
          false,
          `Invalid role. Allowed: ${ORGANIZATION_MEMBER_ROLES.join(", ")}`,
        );
      }
      const member = await OrganizationMembers.findOne({ _id: memberId, orgId });
      if (!member) {
        return sendResponse(false, "Member not found");
      }
      member.role = role;
      const updated = await member.save();
      return sendResponse(true, "Member role updated successfully", updated);
    } catch (error) {
      throw new Error("Failed to update member role");
    }
  };
}
