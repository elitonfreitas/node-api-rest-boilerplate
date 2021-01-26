const Base = require('src/commons/Base');

class Seed extends Base {
  constructor() {
    super();
    this.seedMap = [
      {
        model: 'src/api/modules/users/models/Resource.model',
        data: 'src/seed/data/resources',
        startOverwrite: true,
        envCondition: JSON.parse(process.env.USE_ACL || 'false'),
      },
      {
        model: 'src/api/modules/users/models/Profile.model',
        data: 'src/seed/data/profiles',
        startOverwrite: true,
        envCondition: JSON.parse(process.env.USE_ACL || 'false'),
      },
      {
        model: 'src/api/modules/users/models/User.model',
        data: 'src/seed/data/users.json',
        startOverwrite: false,
        envCondition: process.env.CI !== 'true',
      },
    ];
  }

  async create(seed) {
    const Model = require(seed.model);
    const data = require(seed.data);
    const alreadExists = await Model.find({});

    if (!alreadExists.length || seed.startOverwrite) {
      await Model.deleteMany({});
      await Model.insertMany(data);
      this.log.info(`Seeding ${data.length} ${seed.data}`, data);
    }
  }

  async run() {
    for (const seed of this.seedMap) {
      const condition = seed.envCondition !== undefined ? seed.envCondition : true;

      if (condition) {
        await this.create(seed);
      }
    }
  }
}

module.exports = new Seed();
