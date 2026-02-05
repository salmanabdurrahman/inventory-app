import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for business logic errors
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode,
        message,
        error: 'Business Error',
      },
      statusCode,
    );
  }
}

/**
 * Exception when an entity is not found
 */
export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, id?: number | string) {
    const message = id
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Exception when entity already exists (duplicate)
 */
export class EntityAlreadyExistsException extends HttpException {
  constructor(entityName: string, field?: string) {
    const message = field
      ? `${entityName} with this ${field} already exists`
      : `${entityName} already exists`;

    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Exception for invalid credentials
 */
export class InvalidCredentialsException extends HttpException {
  constructor(message = 'Invalid email or password') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Exception for forbidden actions
 */
export class ForbiddenActionException extends HttpException {
  constructor(message = 'You do not have permission to perform this action') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Exception for validation errors
 */
export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: errors,
        error: 'Validation Error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
