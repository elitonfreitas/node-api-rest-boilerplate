'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: './config/local.env' });
const request = require('supertest');
const App = require('src/App');
const Messages = require('src/commons/constants/Messages');
const HttpStatusCode = require('src/commons/constants/HttpStatusCode');
const UserModel = require('src/api/modules/users/models/User.model');

describe('Profile integration', () => {
  process.env.DB_HOST = process.env.MONGO_URL;
  process.env.CORS_ORIGIN = '*';
  const rootPath = process.env.ROOT_API_PATH;
  let app = {};

  beforeAll(async () => {
    app = await new App().start();
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    app.close();
  });

  const userPass = '123456';
  const validUser = {
    name: 'User test',
    email: 'user@teste.com',
    password: userPass,
    profiles: [1],
    active: true,
  };

  let userId = '';
  let token = 'Bearer ';
  const userPath = `${rootPath}/users/`;
  const profilePath = `${rootPath}/profiles/`;

  test('should create a new User', async () => {
    const response = await request(app).post(userPath).send(validUser);
    userId = response.body.data._id;
    expect(response.statusCode).toBe(HttpStatusCode.CREATED);
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

  test('should update a profile Admin', async () => {
    const response = await request(app)
      .put(profilePath)
      .send([{ _id: 1, 'acl.users': 'm' }])
      .set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.ACCEPTED);
  });

  test('should get error to try update a profile with invalid data', async () => {
    const response = await request(app)
      .put(profilePath)
      .send([{ _id: 1, acl: 'm' }])
      .set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).toStrictEqual([Messages.INVALID_PARAMS]);
  });

  test('should get error to try update a profile with invalid format', async () => {
    const response = await request(app).put(profilePath).send({ _id: 1, acl: 'm' }).set('Authorization', token);
    expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).toStrictEqual([Messages.INVALID_PARAMS]);
  });

  test('should delete User', async () => {
    const response = await request(app)
      .delete(userPath + userId)
      .set('Authorization', token);

    expect(response.statusCode).toBe(HttpStatusCode.ACCEPTED);
  });
});
