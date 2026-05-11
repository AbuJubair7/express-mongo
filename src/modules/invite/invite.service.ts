import Invite, { IInvite } from "./models/invite.model.js";
import crypto from "crypto";

interface InviteResponse {
  success: boolean;
  message: string;
  data?: IInvite;
}

const sendResponse = (success: boolean, message: string, data?: IInvite): InviteResponse => {
  return { success, message, data };
};

export class InviteService {
  constructor() {}

  createInvite = async (orgId: string, userId: string): Promise<InviteResponse> => {
    try {
      const invite = new Invite({
        _id: crypto.randomUUID(),
        orgId,
        userId,
      })
      const savedInvite = await invite.save();
      return sendResponse(true, "Invite created successfully", savedInvite);
    } catch (error) {
      return sendResponse(false, "Failed to create invite");
    }
  };
}
