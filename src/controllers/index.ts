import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/user';
import ApiError, { APIError } from '@src/util/errors/api-error';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, err: mongoose.Error.ValidationError | Error): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const { code, error } = this.handleClientError(err);
      res.status(code).send(ApiError.format({ code, message: error }));
    } else {
      logger.error(err);
      res.status(500).send(ApiError.format({ code: 500, message: 'Something went wrong' }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }

  private handleClientError(error: mongoose.Error.ValidationError): { code: number; error: string } {
    const duplicatedError = Object.values(error.errors).filter(({ kind }) => kind === CUSTOM_VALIDATION.DUPLICATED);
    return duplicatedError.length ? { code: 409, error: error.message } : { code: 422, error: error.message };
  }
}
