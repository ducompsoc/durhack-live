import createHttpError, { isHttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";

import { sendHttpErrorResponse } from "@/common/response";
import { NullError, ValueError } from "@/common/errors";


export default function api_error_handler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (response.headersSent) {
    return next(error);
  }

  if (isHttpError(error)) {
    return sendHttpErrorResponse(response, error);
  }

  if (error instanceof ValueError) {
    return sendHttpErrorResponse(response, new createHttpError.BadRequest(error.message));
  }

  if (error instanceof NullError) {
    return sendHttpErrorResponse(response, new createHttpError.NotFound(error.message));
  }

  if (error instanceof TypeError) {
    return sendHttpErrorResponse(response, new createHttpError.BadRequest(error.message));
  }

  console.error("Unexpected API error:");
  Error.captureStackTrace(error);
  console.error(error.stack);
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError());
}