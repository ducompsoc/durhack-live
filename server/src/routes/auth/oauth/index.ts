import { Router as ExpressRouter } from "express";

import { handleMethodNotAllowed } from "@/common/middleware";


const oauth_router = ExpressRouter();

export default oauth_router;