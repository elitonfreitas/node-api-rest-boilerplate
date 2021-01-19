'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const request = require('supertest');
const App = require('src/App');
const Messages = require('src/commons/constants/Messages');
const HttpStatusCode = require('src/commons/constants/HttpStatusCode');

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
    profile: 1,
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
  const invalidId = '5ccb4fc7930c1736b1da5044';
  let token = 'Bearer ';
  const userPath = `${rootPath}/users/`;

  test('should create a new User', async () => {
    const response = await request(app).post(userPath).send(validUser);
    userId = response.body.data._id;
    expect(response.statusCode).toBe(HttpStatusCode.CREATED);
  });

  test('should dont create a new User without name', async () => {
    const invalidUser = Object.assign({}, validUser);
    delete invalidUser.name;
    const response = await request(app).post(userPath).send(invalidUser);
    expect(response.statusCode).toBe(HttpStatusCode.PRECONDITION_FAILED);
    expect(response.body.message).toBe(`${Messages.FIELD_REQUIRED}`.replace('{{param}}', 'name'));
  });

  test('should dont create a new User without email', async () => {
    const invalidUser = Object.assign({}, validUser);
    delete invalidUser.email;
    const response = await request(app).post(userPath).send(invalidUser);
    expect(response.statusCode).toBe(HttpStatusCode.PRECONDITION_FAILED);
    expect(response.body.message).toBe(`${Messages.FIELD_REQUIRED}. ${Messages.FIELD_EMAIL}`.replace(/\{\{param\}\}/g, 'email'));
  });

  test('should authenticate with new User', async () => {
    const response = await request(app).post(`${rootPath}/auth`).send({
      email: validUser.email,
      password: validUser.password,
    });
    token += response.body.data.token;

    expect(response.statusCode).toBe(HttpStatusCode.ACCEPTED);
    expect(response.body.data.token).toBeDefined();
  });

  test('should update User by id', async () => {
    validUser.name = 'User test edited';
    const response = await request(app)
      .put(userPath + userId)
      .send(validUser)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.ACCEPTED);
    expect(response.body.data.name).toBe(validUser.name);
  });

  test('should dont update User without id', async () => {
    validUser.name = 'User test edited';
    const response = await request(app).put(userPath).send(validUser).set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).toBe(Messages.INVALID_PARAMS);
  });

  test('should dont update User with invalid id', async () => {
    validUser.name = 'User test edited';
    const response = await request(app)
      .put(userPath + invalidId)
      .send(validUser)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body.message).toBe(Messages.UPDATE_NOT_OCURRED);
  });

  test('should get User by id', async () => {
    const response = await request(app)
      .get(userPath + userId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.OK);
    expect(response.body.data._id).toBe(userId);
  });

  test('should get User by id with no result', async () => {
    const response = await request(app)
      .get(userPath + invalidId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.OK);
    expect(response.body.message).toBe(Messages.NO_RESULT);
  });

  test('should get all Users', async () => {
    const response = await request(app).get(userPath).set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.OK);
    expect(response.body.data.list).toHaveLength(1);
  });

  test('should dont delete User without id', async () => {
    const response = await request(app).delete(userPath).set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).toBe(Messages.INVALID_PARAMS);
  });

  test('should dont delete User with invalid id', async () => {
    const response = await request(app)
      .delete(userPath + invalidId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body.message).toBe(Messages.DATA_NOT_FOUND);
  });

  test('should delete User', async () => {
    const response = await request(app)
      .delete(userPath + userId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.ACCEPTED);
  });

  test('should get all Users with no results', async () => {
    const response = await request(app).get(userPath).set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.OK);
    expect(response.body.message).toBe(Messages.NO_RESULT);
  });
});
