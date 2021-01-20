/*
 * Permission description
 * "r": Access to read the resource (GET, OPTIONS, HEAD)
 * "w": Access to read and write the resource (GET, OPTIONS, HEAD, POST, PUT, PATCH)
 * "m": Access to manager (read, write and delete) the resource (GET, OPTIONS, HEAD, POST, PUT, PATCH, DELETE)
 */

const aclGuest = {
  users: 'r',
};
const aclUser = {
  ...aclGuest,
  users: 'w',
};
const aclAdmin = {
  ...aclGuest,
  ...aclUser,
  users: 'm',
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
