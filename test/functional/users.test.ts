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
  });
});
