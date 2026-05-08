import { Router, Request, Response } from "express";
import UserService from "./user.service.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { UserDTO } from "./dto/user.dto.js";
import { authorized } from "../../middleware/authorizeMiddleware.js";

export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly app: Router,
  ) {}

  activateRoutes = (): void => {
    // get all users with pagination
    this.app.get("/", verifyToken, async (req: Request, res: Response) => {
      try {
        // if (res.locals.user.role !== "admin") {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Access denied",
        //   });
        // }
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const result = await this.userService.getUsers(page, limit);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error retrieving users: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    });

    // create user
    this.app.post("/", async (req: Request, res: Response) => {
      try {
        const result = await this.userService.createUser(req.body);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error creating user: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    });

    this.app.post("/login", async (req: Request, res: Response) => {
      try {
        const result = await this.userService.loginUser(req.body);
        if (!result.success) {
          return res.status(401).json(result);
        }
        res.json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error logging in: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    });

    // get user by id
    this.app.get("/:id", verifyToken, async (req: Request, res: Response) => {
      try {
        const result = await this.userService.getUserById(
          req.params.id as string,
        );
        if (!result.success) {
          return res.status(404).json(result);
        }
        res.json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          message: `Error retrieving user: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    });

    // update user
    this.app.patch(
      "/:id",
      verifyToken,
      authorized,
      async (req: Request, res: Response) => {
        try {
          const result = await this.userService.updateUser(
            req.params.id as string,
            req.body,
          );
          res.json(result);
        } catch (error) {
          res.status(500).json({
            success: false,
            message: `Error updating user: ${
              error instanceof Error ? error.message : String(error)
            }`,
          });
        }
      },
    );

    // delete user
    this.app.delete(
      "/:id",
      verifyToken,
      authorized,
      async (req: Request, res: Response) => {
        try {
          if (res.locals.user.role !== "admin") {
            const user = await this.userService.getUserById(
              req.params.id as string,
            );
            const userData = user.data as UserDTO;
            if (!user.success || userData.email !== res.locals.user.email) {
              return res.status(403).json({
                success: false,
                message: "Access denied",
              });
            }
          }
          const result = await this.userService.deleteUser(
            req.params.id as string,
          );
          res.json(result);
        } catch (error) {
          res.status(500).json({
            success: false,
            message: `Error deleting user: ${
              error instanceof Error ? error.message : String(error)
            }`,
          });
        }
      },
    );
  };
}
