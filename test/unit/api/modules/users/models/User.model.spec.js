'use strict';

const TestBase = require('test/unit/TestBase');

class UserModelTest extends TestBase {
  constructor() {
    super('src/api/modules/users/models/User.model', true);
    this.passtest = '123456';
    this.userData = {
      name: 'User test',
      email: 'user@teste.com',
      password: this.passtest,
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
  }

  test() {
    it('should create & save user successfully', async () => {
      const validUser = new this.Model(this.userData);
      const savedUser = await validUser.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(this.userData.name);
      expect(savedUser.email).toBe(this.userData.email);
      expect(savedUser.password).toBeUndefined();
      expect(savedUser.active).toBe(this.userData.active);
      expect(savedUser.profiles).toHaveLength(1);
      expect(savedUser.addresses).toHaveLength(1);
    });

    it('should update user successfully with password', async () => {
      const savedUser = await this.Model.findOneAndUpdate({ name: 'User test' }, { $set: { password: this.passtest } }, { new: true });

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(this.userData.name);
      expect(savedUser.email).toBe(this.userData.email);
      expect(savedUser.password).toBeUndefined();
      expect(savedUser.active).toBe(this.userData.active);
      expect(savedUser.profiles).toHaveLength(1);
      expect(savedUser.addresses).toHaveLength(1);
    });

    it('should update user successfully without password', async () => {
      const savedUser = await this.Model.findOneAndUpdate({ name: 'User test' }, { $set: { active: false } }, { new: true });

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(this.userData.name);
      expect(savedUser.email).toBe(this.userData.email);
      expect(savedUser.password).toBeUndefined();
      expect(savedUser.active).toBe(!this.userData.active);
      expect(savedUser.profiles).toHaveLength(1);
      expect(savedUser.addresses).toHaveLength(1);
    });

    it('create user without required field should failed', async () => {
      let err;
      try {
        const validUser = new this.Model({ name: 'teste' });
        await validUser.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(this.mongoose.Error.ValidationError);
    });
  }
}

new UserModelTest().run();
