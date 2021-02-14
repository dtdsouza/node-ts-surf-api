import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  @Post('')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await new User(req.body);

      res.status(201).send(newUser);
    } catch (error) {
      res.status(500).send('Something went wrong');
    }
  }
}
