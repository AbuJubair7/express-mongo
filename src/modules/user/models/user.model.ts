import { Document, model, Schema } from "mongoose";

export interface IUser extends Document<string> {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  lastLoggedInAt?: Date;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
      trim: true,
    },
    lastLoggedInAt: {
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

export const User = model<IUser>("User", UserSchema);
export default User;
