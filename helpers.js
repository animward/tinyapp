// helper.js
const { users } = require("./users");
// find user by email
const findUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

module.exports = findUserByEmail;
