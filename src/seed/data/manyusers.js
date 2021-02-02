const users = [];
const passUser = '123456';

for (let i = 0; i <= 100; i++) {
  users.push({
    active: true,
    profiles: [1],
    name: `Admin ${i}`,
    email: `admin${i}@test.com`,
    password: passUser,
    options: {},
  });
}

module.exports = users;
