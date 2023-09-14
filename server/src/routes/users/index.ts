import { Router as ExpressRouter } from "express";

import {
  handleMethodNotAllowed,
  parseRouteId
} from "@/common/middleware";

import handlers from "./users_handlers";


const users_router = ExpressRouter();

users_router.route("/")
  .get(handlers.getUsersList)
  .post(handlers.createUser)
  .all(handleMethodNotAllowed("GET", "POST"));

users_router.route("/:user_id")
  .all(parseRouteId("user_id"))
  .get(handlers.getUserDetails)
  .patch(handlers.patchUserDetails)
  .delete(handlers.deleteUser)
  .all(handleMethodNotAllowed("GET", "PATCH", "DELETE"));

export default users_router;
