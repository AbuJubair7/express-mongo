import { UserDTO } from "./dto/user.dto.js";
import User, { IUser } from "./models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface UserResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PaginatedUserResponse extends UserResponse {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const sendResponse = (
  success: boolean,
  message: string,
  data?: IUser | IUser[],
  token?: string,
  pagination?: { page: number; limit: number; total: number; pages: number },
): UserResponse | PaginatedUserResponse => {
  return {
    success,
    message,
    data,
    token,
    pagination,
  };
};

export default class UserService {
  constructor() {}

  createUser = async (userData: UserDTO): Promise<UserResponse> => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = new User({
      _id: crypto.randomUUID(),
      ...userData,
    });
    try {
      const savedUser = await user.save();
      const token = this.createToken(userData);
      savedUser.password = "***"; // Hide password in response
      return sendResponse(true, "User created successfully", savedUser, token);
    } catch (error) {
      throw new Error(
        `Error creating user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  loginUser = async (user: Partial<UserDTO>): Promise<UserResponse> => {
    try {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        return sendResponse(false, "Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(
        user.password || "",
        existingUser.password,
      );
      if (!isPasswordValid) {
        return sendResponse(false, "Invalid email or password");
      }

      const token = this.createToken(existingUser.toObject());
      existingUser.password = ""; // Hide password in response
      return sendResponse(true, "Login successful", existingUser, token);
    } catch (error) {
      throw new Error(
        `Error logging in user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  getUserById = async (id: string): Promise<UserResponse> => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return sendResponse(false, "User not found");
      }
      return sendResponse(true, "User retrieved successfully", user);
    } catch (error) {
      throw new Error(
        `Error retrieving user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  updateUser = async (
    id: string,
    user: Partial<UserDTO>,
  ): Promise<UserResponse> => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }
      updatedUser.password = "***"; // Hide password in response
      return sendResponse(true, "User updated successfully", updatedUser);
    } catch (error) {
      throw new Error(
        `Error updating user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  updatePassword = async (
    id: string,
    passwords: PasswordUpdate,
  ): Promise<UserResponse> => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const isOldPasswordValid = await bcrypt.compare(
        passwords.oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        return {
          success: false,
          message: "Old password is incorrect",
        };
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        return {
          success: false,
          message: "New password and confirm password do not match",
        };
      }

      user.password = await bcrypt.hash(passwords.newPassword, 10);
      const updatedUser = await user.save();
      updatedUser.password = "***"; // Hide password in response
      return sendResponse(true, "Password updated successfully", updatedUser);
    } catch (error) {
      throw new Error(
        `Error updating password: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  deleteUser = async (id: string): Promise<UserResponse> => {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }
      deletedUser.password = "***"; // Hide password in response
      return sendResponse(true, "User deleted successfully", deletedUser);
    } catch (error) {
      throw new Error(
        `Error deleting user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  getUsers = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedUserResponse> => {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find().skip(skip).limit(limit);
      const total = await User.countDocuments();
      const pages = Math.ceil(total / limit);

      for (const user of users) {
        user.password = "***"; // Hide password in response
      }

      return sendResponse(
        true,
        "Users retrieved successfully",
        users,
        undefined,
        {
          page,
          limit,
          total,
          pages,
        },
      );
    } catch (error) {
      throw new Error(
        `Error retrieving users: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Generate JWT token
  createToken = (user: any): string => {
    const token = jwt.sign(user, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
    return token;
  };
}
