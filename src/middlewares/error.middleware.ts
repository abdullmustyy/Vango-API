import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

import { AnyZodObject } from "zod";
import { fromError } from "zod-validation-error";

class CustomError extends Error {
  constructor(name: string, message: string, public statusCode?: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

function createCustomError(name: string, statusCode: number = 500) {
  return class extends CustomError {
    constructor(message: string) {
      super(name, message, statusCode);
    }
  };
}

const NotFoundError = createCustomError("Not Found Error", 404);
const BadRequestError = createCustomError("Bad Request Error", 400);
const UnauthorizedError = createCustomError("Unauthorized Error", 401);
const ForbiddenError = createCustomError("Forbidden Error", 403);
const InternalServerError = createCustomError("Internal Server Error", 500);
const MethodNotAllowedError = createCustomError(
  "Method Not Allowed Error",
  405
);
const ConflictError = createCustomError("Conflict Error", 409);
const UnprocessableEntityError = createCustomError(
  "Unprocessable Entity Error",
  422
);

const errorHandler = (
  err: CustomError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("An error occurred:", err);

  const errorResponse = {
    success: false,
    status: err instanceof CustomError ? err.statusCode || 500 : 500,
    message: err.message || err || "Something went wrong",
    path: req.path,
    error: err.name || "Internal Server Error",
    timestamp: new Date().toISOString(),
  };

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      const errorCause = err.meta && (err.meta.cause as string);

      const notFoundError = new NotFoundError(
        errorCause || "Resource not found."
      );

      const notFoundErrorResponse = {
        ...errorResponse,
        status: notFoundError.statusCode || 500,
        message: notFoundError.message,
        error: notFoundError.name,
      };

      if (err.meta && err.meta.modelName === "Otp") {
        const otpError = new NotFoundError("The OTP provided is invalid.");

        const otpErrorResponse = {
          ...errorResponse,
          status: otpError.statusCode || 500,
          message: otpError.message,
          error: otpError.name,
        };

        return res
          .status(otpErrorResponse.status || 500)
          .json(otpErrorResponse);
      }

      return res
        .status(notFoundErrorResponse.status)
        .json(notFoundErrorResponse);
    }

    return res.status(errorResponse.status || 500).json(errorResponse);
  }

  res.status(errorResponse.status).json(errorResponse);
};

const checkValidity = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      const errorResponse = {
        success: false,
        status: 400,
        message: fromError(error, { includePath: false }).toString(),
        path: req.path,
        error: `Bad Request Error: ${fromError(error, { prefix: null })}`,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(errorResponse);
    }
  };
};

export {
  CustomError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  ConflictError,
  errorHandler,
  checkValidity,
};
