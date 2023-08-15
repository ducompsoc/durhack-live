import { Router as ExpressRouter } from "express";

import handlers from "./user_handlers";
import {
  handleFailedAuthentication,
  handleMethodNotAllowed,
  handleNotImplemented,
  parseRouteId
} from "@/common/middleware";
import { useSelfId } from "@/routes/users/user_util";


const users_router = ExpressRouter();

users_router.route("/")
  .get(handleNotImplemented)
  .post(handleNotImplemented)
  .all(handleMethodNotAllowed);

users_router.route("/me")
  .all(useSelfId)
  .get(handlers.getSelfDetails)
  .patch(handlers.patchSelfDetails)
  .all(handleMethodNotAllowed);

users_router.route("/:user_id")
  .all(parseRouteId("user_id"))
  .get(handleNotImplemented)
  .patch(handleNotImplemented)
  .delete(handleNotImplemented)
  .all(handleMethodNotAllowed);

export default users_router;