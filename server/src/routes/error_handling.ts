// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AuthenticationError from "passport/lib/errors/authenticationerror.js"
import { ZodError } from "zod"
import createHttpError, { isHttpError } from "http-errors"
import { Request, Response, NextFunction } from "express"
import { OAuthError } from "@node-oauth/oauth2-server"

import { sendHttpErrorResponse, sendZodErrorResponse, sendOAuthErrorResponse } from "@/common/response"
import { ConflictError, NullError, ValueError } from "@/common/errors"

export default function api_error_handler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (response.headersSent) {
    return next(error)
  }

  if (isHttpError(error)) {
    return sendHttpErrorResponse(response, error)
  }

  if (error instanceof OAuthError) {
    return sendOAuthErrorResponse(response, error)
  }

  if (error instanceof ZodError) {
    return sendZodErrorResponse(response, error)
  }

  if (error instanceof AuthenticationError) {
    return sendHttpErrorResponse(
      response,
      createHttpError((error as AuthenticationError).status, "Authentication failed"),
    )
  }

  if (error instanceof ValueError) {
    return sendHttpErrorResponse(response, new createHttpError.BadRequest(error.message))
  }

  if (error instanceof NullError) {
    return sendHttpErrorResponse(response, new createHttpError.NotFound(error.message))
  }

  if (error instanceof ConflictError) {
    return sendHttpErrorResponse(response, new createHttpError.Conflict(error.message))
  }

  console.error("Unexpected API error:")
  Error.captureStackTrace(error)
  console.error(error.stack)
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError())
}
