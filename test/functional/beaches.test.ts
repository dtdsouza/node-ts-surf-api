import { Beach } from '@src/models/beach';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Beaches functional tests', () => {
  describe('When creating a beach', () => {
    const defaultUser = {
      name: 'Teste da Silva',
      email: 'teste@test.com',
      password: '1234',
    };
    let token: string;

    beforeEach(async () => {
      await Beach.deleteMany({});
      await User.deleteMany({});
      const user = await new User(defaultUser).save();
      token = AuthService.generateToken(user.toJSON());
    });
    it('Should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('Should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
      expect(response.status).toEqual(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Beach validation failed: lat: Cast to Number failed for value "invalid string" at path "lat"',
      });
    });

    it('Should return 500 when database connection has an error', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      await global.server.close();

      const response = await global.testRequest.post('/beaches').set({ 'x-access-token': token }).send(newBeach);
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
});
