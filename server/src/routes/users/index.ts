import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed, parseRouteId } from "@/common/middleware"

import handlers from "./users_handlers"

const usersApp = new App()

usersApp.route("/").get(handlers.getUsersList).post(handlers.createUser).all(handleMethodNotAllowed("GET", "POST"))

usersApp
  .route("/:user_id")
  .all(parseRouteId("user_id"))
  .get(handlers.getUserDetails)
  .patch(handlers.patchUserDetails)
  .delete(handlers.deleteUser)
  .all(handleMethodNotAllowed("GET", "PATCH", "DELETE"))

export { usersApp }
