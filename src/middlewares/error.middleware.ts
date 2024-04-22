import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

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
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("An error occurred:", err);

  const errorResponse = {
    success: false,
    status: err.statusCode || 500,
    message: err.message || err || "Something went wrong",
    path: req.path,
    error: err.name || "Internal Server Error",
    timestamp: new Date().toISOString(),
  };

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaResponse = {
      ...errorResponse,
    };

    return res.status(prismaResponse.status || 500).json(prismaResponse);
  }

  // if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //   const prismaError = new CustomError(
  //     "Prisma Client Known Request Error",
  //     err.message,
  //     500
  //   );

  //   return res.status(prismaError.statusCode || 500).json(prismaError);
  // }

  res.status(errorResponse.status).json(errorResponse);
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
};
