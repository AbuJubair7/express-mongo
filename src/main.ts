import express from "express";
import UserController from "./modules/user/user.controller.js";
import UserService from "./modules/user/user.service.js";

// declare routes here
export const routes = {
  "/user": express.Router(),
};

// declare services here
export const services = {
  user: new UserService(),
};

// declare controllers here
export const controllers = {
  user: new UserController(services.user, routes["/user"]),
};
