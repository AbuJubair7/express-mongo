import { Document, model, Schema } from "mongoose";

export interface IOrganizationMembers extends Document<string> {
  _id: string;
  orgId: string;
  userId: string;
  role: string;
  status: string;
  invitedAt: Date;
  joinedAt?: Date;
  created_at: Date;
  updated_at: Date;
}

const OrganizationMembersSchema = new Schema<IOrganizationMembers>(
  {
    _id: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    invitedAt: {
      type: Date,
      required: true,
    },
    joinedAt: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const OrganizationMembers = model<IOrganizationMembers>(
  "OrganizationMembers",
  OrganizationMembersSchema,
);
export default OrganizationMembers;
