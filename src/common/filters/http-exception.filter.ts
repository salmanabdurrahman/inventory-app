import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Check if response has already been sent
    if (response.headersSent) {
      this.logger.warn('Response already sent, skipping error handling');
      return;
    }

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        message = exceptionResponse.message || exception.message;
        error = exceptionResponse.error || exception.name;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception.name;

      // Log the full error for debugging
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'UnknownError';
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
    );

    // Check if request accepts HTML (browser request)
    const acceptHeader = request.headers.accept || '';
    const isHtmlRequest = acceptHeader.includes('text/html');

    if (isHtmlRequest) {
      // For HTML requests, render an error page or redirect with flash message
      return this.handleHtmlError(response, request, status, message, error);
    }

    // For API requests, return JSON
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message: Array.isArray(message) ? message : [message],
    });
  }

  private handleHtmlError(
    response: Response,
    request: Request,
    status: number,
    message: string | string[],
    error: string,
  ) {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;

    // For certain status codes, we can redirect back with error
    const referer = request.headers.referer;

    // Store error in session if available
    if (request.session) {
      (request.session as any).flash = {
        type: 'error',
        message: errorMessage,
      };
    }

    // Handle specific status codes
    switch (status) {
      case HttpStatus.NOT_FOUND:
        return response.status(status).render('errors/404', {
          layout: false,
          message: errorMessage,
          path: request.url,
        });

      case HttpStatus.FORBIDDEN:
        return response.status(status).render('errors/403', {
          layout: false,
          message: errorMessage,
        });

      case HttpStatus.UNAUTHORIZED:
        return response.redirect('/users/login');

      case HttpStatus.BAD_REQUEST:
        // Redirect back with error message
        if (referer) {
          return response.redirect(referer);
        }
        return response.status(status).render('errors/400', {
          layout: false,
          message: errorMessage,
          errors: Array.isArray(message) ? message : [message],
        });

      default:
        return response.status(status).render('errors/500', {
          layout: false,
          message: errorMessage,
          error,
        });
    }
  }
}
