import { SetupServer } from '@src/server';
import superTest from 'supertest';

let server: SetupServer;

jest.setTimeout(20000);
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = superTest(server.getApp());
  global.server = server;
});

afterAll(async () => {
  await server.close();
});
