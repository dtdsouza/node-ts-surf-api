import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/user';

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, config.get('App.auth.key'), { expiresIn: config.get('App.auth.tokenExpiresIn') });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
  }
}
