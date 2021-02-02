'use strict';

const BaseIntegrationTest = require('../BaseIntegrationTest');
const UserModel = require('src/api/modules/users/models/User.model');

class ProfileIntegrationTest extends BaseIntegrationTest {
  constructor() {
    super('Profile Integration', UserModel);
  }

  test() {
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
    const userPath = `${this.rootPath}/users/`;
    const profilePath = `${this.rootPath}/profiles/`;

    test('should create a new User', async () => {
      const response = await this.request(this.app).post(userPath).send(validUser);
      userId = response.body.data._id;
      expect(response.statusCode).toBe(this.HttpStatusCode.CREATED);
    });

    test('should authenticate with user', async () => {
      const response = await this.request(this.app).post(`${this.rootPath}/auth`).send({
        email: validUser.email,
        password: validUser.password,
      });
      token += response.body.data.token;

      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
      expect(response.body.data.token).toBeDefined();
    });

    test('should update a profile Admin', async () => {
      const response = await this.request(this.app)
        .put(profilePath)
        .send([{ _id: 1, 'acl.users': 'm' }])
        .set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
    });

    test('should get error to try update a profile with invalid data', async () => {
      const response = await this.request(this.app)
        .put(profilePath)
        .send([{ _id: 1, acl: 'm' }])
        .set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toStrictEqual([this.Messages.INVALID_PARAMS]);
    });

    test('should get error to try update a profile with invalid format', async () => {
      const response = await this.request(this.app).put(profilePath).send({ _id: 1, acl: 'm' }).set('Authorization', token);
      expect(response.statusCode).toBe(this.HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toStrictEqual([this.Messages.INVALID_PARAMS]);
    });

    test('should delete User', async () => {
      const response = await this.request(this.app)
        .delete(userPath + userId)
        .set('Authorization', token);

      expect(response.statusCode).toBe(this.HttpStatusCode.ACCEPTED);
    });
  }
}

new ProfileIntegrationTest().run();
