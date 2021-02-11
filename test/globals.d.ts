declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
    server: import('@src/server').SetupServer;
  }
}
