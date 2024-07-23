import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed, parseRouteId } from "@/common/middleware"

import { usersHandlers } from "./users-handlers"

const usersApp = new App()

usersApp
  .route("/")
  .get(usersHandlers.getUsersList.bind(usersHandlers))
  .post(usersHandlers.createUser.bind(usersHandlers))
  .all(handleMethodNotAllowed("GET", "POST"))

usersApp
  .route("/:user_id")
  .all(parseRouteId("user_id"))
  .get(usersHandlers.getUserDetails.bind(usersHandlers))
  .patch(usersHandlers.patchUserDetails.bind(usersHandlers))
  .delete(usersHandlers.deleteUser.bind(usersHandlers))
  .all(handleMethodNotAllowed("GET", "PATCH", "DELETE"))

export { usersApp }
