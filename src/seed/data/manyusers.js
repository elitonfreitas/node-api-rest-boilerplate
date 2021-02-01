const users = [];

for (let i = 0; i <= 100; i++) {
  users.push({
    active: true,
    profiles: [1],
    name: `Admin ${i}`,
    email: `admin${i}@test.com`,
    password: '123456',
    options: {},
  });
}

module.exports = users;
