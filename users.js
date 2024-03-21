// users.js

const express_server = require('./express_server');
const bcrypt = require('bcryptjs');

// user database
const users = {
    userRandomID: {
        id: "userRandomID",
        email: "user@example.com",
        password: "1234",
    },

    user2RandomID: {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
};

// add user now with hashed password
const addUser = (id, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = { id, email, password: hashedPassword};
};

// find user by email
const findUserByEmail = (email) => {
    for (let userId in users) {
        if (users[userId].email === email) {
            return users[userId];
        }
    }
    return null;
};

module.exports = { users, addUser, findUserByEmail };