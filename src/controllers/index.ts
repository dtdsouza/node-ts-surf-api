import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, err: mongoose.Error.ValidationError | Error): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const { code, error } = this.handleClientError(err);
      res.status(code).send({ code, error });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong' });
    }
  }

  private handleClientError(error: mongoose.Error.ValidationError): { code: number; error: string } {
    const duplicatedError = Object.values(error.errors).filter(({ kind }) => kind === CUSTOM_VALIDATION.DUPLICATED);
    return duplicatedError.length ? { code: 409, error: error.message } : { code: 422, error: error.message };
  }
}
