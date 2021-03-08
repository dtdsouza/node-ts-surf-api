import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a new User', () => {
    it('Should successfully create a new user with encrypted password', async () => {
      const newUser: User = {
        name: 'Teste da Silva',
        email: 'teste@teste.com',
        password: 'teste1',
      };

      const { status, body } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(201);
      await expect(AuthService.comparePassword(newUser.password, body.password)).resolves.toBe(true);
      expect(body).toEqual(expect.objectContaining({ ...newUser, ...{ password: expect.any(String) } }));
    });

    it('Should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'teste@teste.com',
        password: 'teste1',
      };

      const { status, body } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(422);
      expect(body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when emails already exists', async () => {
      const newUser: User = {
        name: 'Teste da Silva',
        email: 'teste@teste.com',
        password: 'teste1',
      };

      await global.testRequest.post('/users').send(newUser);

      const { status, body } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(409);
      expect(body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database',
      });
    });
  });

  describe('When authenticating a user', () => {
    it('should return a token for a valid user', async () => {
      const newUser = {
        name: 'Teste da Silva',
        email: 'test@teste.com',
        password: 'teste1',
      };

      await new User(newUser).save();
      const { body } = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });

      expect(body).toEqual(expect.objectContaining({ token: expect.any(String) }));
    });

    it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const { status, body } = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-email@email.com', password: '1234' });

      expect(status).toBe(401);
      expect(body.error).toBe('User not found');
    });

    it('should return UNAUTHORIZED if the user is found but passwords does not match', async () => {
      const newUser = {
        name: 'Teste da Silva',
        email: 'teste@teste.com',
        password: 'teste1',
      };
      await new User(newUser).save();
      const { status, body } = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: 'different password' });

      expect(status).toBe(401);
      expect(body.error).toBe('Password does not match');
    });
  });
});
