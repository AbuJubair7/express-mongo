import express from "express";
import UserController from "./modules/user/user.controller.js";
import UserService from "./modules/user/user.service.js";
import { OrganizationService } from "./modules/organization/organization.service.js";
import { OrganizationController } from "./modules/organization/organization.controller.js";
import { InviteService } from "./modules/invite/invite.service.js";
import { InviteController } from "./modules/invite/invite.controller.js";

// declare routes here
export const routes = {
  "/user": express.Router(),
  "/organization": express.Router(),
  "/invite": express.Router(),
};

// declare services here
export const services = {
  userService: new UserService(),
  organizationService: new OrganizationService(),
  inviteService: new InviteService()
};

// declare controllers here
export const controllers = {
  userController: new UserController(services.userService, routes["/user"]),
  organizationController: new OrganizationController(services.organizationService, routes["/organization"]),
  inviteController: new InviteController(services.inviteService, routes["/invite"])
};
