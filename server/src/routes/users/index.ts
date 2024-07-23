import { Router as ExpressRouter } from "express"

import { handleMethodNotAllowed, parseRouteId } from "@/common/middleware"

import handlers from "./users_handlers"

const users_router = ExpressRouter()

users_router.route("/").get(handlers.getUsersList).post(handlers.createUser).all(handleMethodNotAllowed("GET", "POST"))

users_router
  .route("/:user_id")
  .all(parseRouteId("user_id"))
  .get((req,res) => handlers.getUserDetails(req,res,true))
  .patch(handlers.patchUserDetails)
  .delete(handlers.deleteUser)
  .all(handleMethodNotAllowed("GET", "PATCH", "DELETE"))

users_router
  .route("/partial/:user_id")
  .get((req,res) => handlers.getUserDetails(req,res,false))
  .all(handleMethodNotAllowed("GET"))

export default users_router
