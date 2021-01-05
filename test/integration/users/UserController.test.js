'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const request = require('supertest');
const App = require('src/App');

describe('User integration', () => {
  process.env.DB_HOST = process.env.MONGO_URL;
  process.env.CORS_ORIGIN = '*';
  const rootPath = '/api';
  let app = {};

  beforeAll(async () => {
    app = await new App().start();
  });

  afterAll(() => {
    app.close();
  });

  const userPass = '123456';

  const validUser = {
    name: 'User test',
    email: 'user@teste.com',
    password: userPass,
    level: '1',
    teste: 123,
    active: true,
    addresses: [
      {
        address: 'Rua A',
        number: '222',
        city: 'Recife',
        state: 'PE',
        country: 'Brasil',
      },
    ],
  };
  let userId = '';
  let token = 'Bearer ';
  const userPath = `${rootPath}/users/`;

  test('should create a new User', async () => {
    const response = await request(app).post(userPath).send(validUser);
    userId = response.body.data._id;

    expect(response.statusCode).toBe(200);
  });

  test('should authenticate with new User', async () => {
    const response = await request(app).post(`${rootPath}/auth`).send({
      email: validUser.email,
      password: validUser.password,
    });
    token += response.body.data.token;

    expect(response.statusCode).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  test('should update User by id', async () => {
    validUser.name = 'User test edited';
    const response = await request(app)
      .put(userPath + userId)
      .send(validUser)
      .set('Authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.name).toBe(validUser.name);
  });

  test('should get User by id', async () => {
    const response = await request(app)
      .get(userPath + userId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body.data._id).toBe(userId);
  });

  test('should get all Users', async () => {
    const response = await request(app).get(userPath).set('Authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.list).toHaveLength(1);
  });

  test('should delete new User', async () => {
    const response = await request(app)
      .delete(userPath + userId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(200);
  });
});
