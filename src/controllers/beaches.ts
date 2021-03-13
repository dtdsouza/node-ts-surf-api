import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = await new Beach({ ...req.body, ...{ user: req.decoded?.id } }).save();

      res.status(201).send(beach);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
