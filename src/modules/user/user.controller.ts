import { Router, Request, Response } from "express";
import UserService from "./user.service.js";

export default class UserController {
  // Implement user-related controller methods here
  constructor(
    private readonly userService: UserService,
    private readonly app: Router,
  ) {}
  activateRoutes = (): void => {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("User route is working!");
    });
  };
}
