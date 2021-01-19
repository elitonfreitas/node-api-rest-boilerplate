const aclGuest = {
  users: ['get'],
};
const aclUser = {
  ...aclGuest,
  users: ['*'],
};
const aclAdmin = {
  ...aclGuest,
  ...aclUser,
  users: ['*'],
};

module.exports = [
  {
    _id: 1,
    name: 'Admin',
    acl: aclAdmin,
  },
  {
    _id: 2,
    name: 'User',
    acl: aclUser,
  },
  {
    _id: 3,
    name: 'Guest',
    acl: aclGuest,
  },
];
