import { Document, model, Schema } from "mongoose";

export interface IInvite extends Document<string> {
  _id: string;
  orgId: string;
  userId: string;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    _id: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const Invite = model<IInvite>("Invite", InviteSchema);
export default Invite;
