export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details: any = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST', details: any = null) {
    super(message, 400, code, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', details: any = null) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN', details: any = null) {
    super(message, 403, code, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details: any = null) {
    super(message, 404, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', code = 'CONFLICT', details: any = null) {
    super(message, 409, code, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please slow down', code = 'RATE_LIMITED', details: any = null) {
    super(message, 429, code, details);
  }
}
