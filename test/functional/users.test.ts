import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe('When creating a new User', () => {
    it('Should successfully create a new user', async () => {
      const newUser: User = {
        name: 'Teste da Silva',
        email: 'teste@teste.com',
        password: 'teste1',
      };

      const { status, body } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining({ name: newUser.name, email: newUser.email }));
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
});
