import { Router as ExpressRouter} from "express";

import { handleMethodNotAllowed } from "@/common/middleware";
import handlers from "@/routes/auth/oauth/oauth_handlers";


const oauth_router = ExpressRouter();

oauth_router.route("/authorize")
  .get(handlers.getAuthorize)
  .post(handlers.postAuthorize)
  .all(handleMethodNotAllowed);

oauth_router.route("/token")
  .post(handlers.postToken)
  .all(handleMethodNotAllowed);


export default oauth_router;
