import Invite, { IInvite } from "./models/invite.model.js";
import crypto from "crypto";

interface InviteResponse {
  success: boolean;
  message: string;
  data?: IInvite | IInvite[];
}

const sendResponse = (
  success: boolean,
  message: string,
  data?: IInvite | IInvite[],
): InviteResponse => {
  return { success, message, data };
};

export class InviteService {
  constructor() {}

  createInvite = async (
    orgId: string,
    userId: string,
  ): Promise<InviteResponse> => {
    try {
      const invite = new Invite({
        _id: crypto.randomUUID(),
        orgId,
        userId,
      });
      const savedInvite = await invite.save();
      return sendResponse(true, "Invite created successfully", savedInvite);
    } catch (error) {
      return sendResponse(false, "Failed to create invite");
    }
  };

  //get invite by id
  getInviteById = async (userId: string): Promise<InviteResponse> => {
    try {
      const invites = await Invite.find({ userId });
      if (invites.length === 0) {
        return sendResponse(true, "Invite not found");
      }
      return sendResponse(true, "Invite retrieved successfully", invites);
    } catch (error) {
      return sendResponse(false, "Failed to retrieve invite");
    }
  };

  // update invite status
  updateInviteStatus = async (
    inviteId: string,
    status: string,
  ): Promise<InviteResponse> => {
    try {
      const invite = await Invite.findById(inviteId as string);
      if (!invite) {
        return sendResponse(false, "Invite not found");
      }
      invite.status = status as string;
      const updatedInvite = await invite.save();
      return sendResponse(
        true,
        "Invite status updated successfully",
        updatedInvite,
      );
    } catch (error) {
      return sendResponse(false, "Failed to update invite status");
    }
  };
}
