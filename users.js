// users.js

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
const addUser = (id, email, hashedPassword) => {
    users[id] = { 
        id: id,
        email: email,
        password: hashedPassword
    };
};


module.exports = { users, addUser };