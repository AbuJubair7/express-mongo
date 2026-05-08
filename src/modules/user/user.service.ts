import { UserDTO } from "./dto/user.dto.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface UserResponse {
  success: boolean;
  message: string;
  data?: UserDTO | UserDTO[];
  token?: string;
}

interface PaginatedUserResponse extends UserResponse {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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
      return {
        success: true,
        message: "User created successfully",
        data: savedUser,
        token,
      };
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
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const isPasswordValid = await bcrypt.compare(
        user.password || "",
        existingUser.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const token = this.createToken(existingUser.toObject());
      return {
        success: true,
        message: "Login successful",
        data: existingUser,
        token,
      };
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
        return {
          success: false,
          message: "User not found",
        };
      }
      return {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };
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
      return {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(
        `Error updating user: ${error instanceof Error ? error.message : String(error)}`,
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
      return {
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      };
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

      return {
        success: true,
        message: "Users retrieved successfully",
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      throw new Error(
        `Error retrieving users: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // Generate JWT token
  createToken = (user: UserDTO): string => {
    const token = jwt.sign(user, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
    return token;
  };
}
