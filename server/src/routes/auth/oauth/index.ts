import { Router as ExpressRouter} from "express";

import { handleMethodNotAllowed, handleNotImplemented } from "@/common/middleware";
import wrapped_oauth_provider from "@/routes/auth/oauth/wrapper";


const oauth_router = ExpressRouter();

oauth_router.route("/authorize")
  .get(handleNotImplemented)
  .post(wrapped_oauth_provider.authorize())
  .all(handleMethodNotAllowed);


oauth_router.route("/token")
  .post(wrapped_oauth_provider.token())
  .all(handleMethodNotAllowed);


export default oauth_router;
