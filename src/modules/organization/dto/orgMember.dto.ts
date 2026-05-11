export interface OrganizationMemberDTO {
  orgId: string;
  userId: string;
  role: string;
  status: string;
  invitedAt: Date;
  joinedAt?: Date;
}

export interface UpdateOrganizationMemberRoleDTO {
  role: string;
}

export const ORGANIZATION_MEMBER_ROLES = ["owner", "admin", "member"] as const;
export type OrganizationMemberRole = (typeof ORGANIZATION_MEMBER_ROLES)[number];
