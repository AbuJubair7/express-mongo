export interface OrganizationMemberDTO {
  orgId: string;
  userId: string;
  role: string;
  status: string;
  invitedAt: Date;
  joinedAt?: Date;
}
