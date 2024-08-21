import { App } from "@otterhttp/app"

import { handleMethodNotAllowed, parseRouteId } from "@/common/middleware"

import { usersHandlers } from "./users-handlers"

const usersApp = new App()

usersApp
  .route("/")
  .get(usersHandlers.getUsersList())
  .post(usersHandlers.createUser())
  .all(handleMethodNotAllowed("GET", "POST"))

usersApp
  .route("/:user_id")
  .all(parseRouteId("user_id"))
  .get(usersHandlers.getUserDetails())
  .patch(usersHandlers.patchUserDetails())
  .delete(usersHandlers.deleteUser())
  .all(handleMethodNotAllowed("GET", "PATCH", "DELETE"))

export { usersApp }
