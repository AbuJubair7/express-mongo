import express from "express";
import UserController from "./modules/user/user.controller.js";
import UserService from "./modules/user/user.service.js";
import { OrganizationService } from "./modules/organization/organization.service.js";
import { OrganizationController } from "./modules/organization/organization.controller.js";

// declare routes here
export const routes = {
  "/user": express.Router(),
  "/organization": express.Router(),
};

// declare services here
export const services = {
  userService: new UserService(),
  organizationService: new OrganizationService(),
};

// declare controllers here
export const controllers = {
  userService: new UserController(services.userService, routes["/user"]),
  organizationService: new OrganizationController(services.organizationService, routes["/organization"]),
};
