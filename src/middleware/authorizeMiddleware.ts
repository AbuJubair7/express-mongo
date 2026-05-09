import { Request, Response, NextFunction } from "express";
import UserService from "../modules/user/user.service.js";
import { UserDTO } from "../modules/user/dto/user.dto.js";

const isValid = async (req: Request, res: Response): Promise<boolean> => {
  try {
    if (res.locals.user?.userType === "admin") return true;

    const id = req.params.id as string | undefined;
    if (!id) return false;

    const userService = new UserService();
    const result = await userService.getUserById(id);
    if (!result.success || !result.data) return false;

    const userData = result.data as UserDTO;
    return userData.email === res.locals.user.email;
  } catch {
    return false;
  }
};

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.method === "DELETE" || req.method === "PATCH") {
      const isValidResult = await isValid(req, res);
      if (!isValidResult) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Authorization error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }

  next();
};
