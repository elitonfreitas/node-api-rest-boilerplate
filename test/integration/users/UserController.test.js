'use strict';

const BaseIntegrationTest = require('../BaseIntegrationTest');
const UserModel = require('src/api/modules/users/models/User.model');

class UserIntegrationTest extends BaseIntegrationTest {
  constructor() {
    super('User Integration', UserModel);
  }

  test() {
    const userPass = '123456';
    const validUser = {
      name: 'User test',
      email: 'user@teste.com',
      password: userPass,
      profiles: [1],
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
    const userPath = `${this.rootPath}/users/`;

    test('should create a new User', async () => {
      const response = await this.request(this.app).post(userPath).send(validUser);
      userId = response.body.data._id;
      expect(response.statusCode).toBe(this.HttpStatusCode.CREATED);
    });

    test('should dont create a new User without name', async () => {
      const invalidUser = Object.assign({}, validUser);
      delete invalidUser.name;
      const response = await this.request(this.app).post(userPath).send(invalidUser);
      expect(response.statusCode).toBe(this.HttpStatusCode.PRECONDITION_FAILED);
      expect(response.body.message).toStrictEqual([`${this.Messages.FIELD_REQUIRED}`.replace('{{param}}', 'name')]);
    });

    test('should dont create a new User without email', async () => {
      const invalidUser = Object.assign({}, validUser);
      delete invalidUser.email;
      const response = await this.request(this.app).post(userPath).send(invalidUser);
      expect(response.statusCode).toBe(this.HttpStatusCode.PRECONDITION_FAILED);
    });

    test('should authenticate with new User', async () => {
      const response = await this.request(this.app).post(`${this.rootPath}/auth`).send({
        email: validUser.email,
        password: validUser.password,
      });
      token += response.body.data.token;

      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
      expect(response.body.data.token).toBeDefined();
    });

    test('should update User by id', async () => {
      validUser.name = 'User test edited';
      const response = await this.request(this.app)
        .put(userPath + userId)
        .send(validUser)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
      expect(response.body.data.name).toBe(validUser.name);
    });

    test('should dont update User without id', async () => {
      validUser.name = 'User test edited';
      const response = await this.request(this.app).put(userPath).send(validUser).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toStrictEqual([this.Messages.INVALID_PARAMS]);
    });

    test('should dont update User with invalid id', async () => {
      validUser.name = 'User test edited';
      const response = await this.request(this.app)
        .put(userPath + invalidId)
        .send(validUser)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toStrictEqual([this.Messages.UPDATE_NOT_OCURRED]);
    });

    test('should get User by id', async () => {
      const response = await this.request(this.app)
        .get(userPath + userId)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data._id).toBe(userId);
    });

    test('should get User by id with no result', async () => {
      const response = await this.request(this.app)
        .get(userPath + invalidId)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.message).toStrictEqual([this.Messages.NO_RESULT]);
    });

    test('should get all Users with pager', async () => {
      const response = await this.request(this.app).get(`${userPath}?limit=10`).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data.list).toHaveLength(1);
    });

    test('should get all Users with pager, sort and filter', async () => {
      const response = await this.request(this.app)
        .get(`${userPath}?limit=10&sortBy=name|-1&filter=name:r;user;i|active:b;true|email:${validUser.email}`)
        .set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data.list).toHaveLength(1);
    });

    test('should get all Users with empty filter', async () => {
      const response = await this.request(this.app).get(`${userPath}?current=1&filter=`).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data.list).toHaveLength(1);
    });

    test('should get all Users with invalid filter', async () => {
      const response = await this.request(this.app).get(`${userPath}?current=1&filter=name;user`).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data.list).toHaveLength(1);
    });

    test('should get all Users without pager', async () => {
      const response = await this.request(this.app).get(userPath).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.data).toHaveLength(1);
    });

    test('should dont delete User without id', async () => {
      const response = await this.request(this.app).delete(userPath).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toStrictEqual([this.Messages.INVALID_PARAMS]);
    });

    test('should dont delete User with invalid id', async () => {
      const response = await this.request(this.app)
        .delete(userPath + invalidId)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toStrictEqual([this.Messages.DATA_NOT_FOUND]);
    });

    test('should delete User', async () => {
      const response = await this.request(this.app)
        .delete(userPath + userId)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
    });

    test('should get all Users with no results with pager', async () => {
      const response = await this.request(this.app).get(`${userPath}?limit=10`).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.message).toStrictEqual([this.Messages.NO_RESULT]);
    });

    test('should get all Users with no results without pager', async () => {
      const response = await this.request(this.app).get(userPath).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.OK);
      expect(response.body.message).toStrictEqual([this.Messages.NO_RESULT]);
    });
  }
}

new UserIntegrationTest().run();
