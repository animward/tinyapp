// users.js
const users = {
    userRandomID: {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },

    user2RandomID: {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
};

// add user
const addUser = (id, email, password) => {
    users[id] = { id, email, password };
};

// find user by email
const findUserByEmail = (email) => {
    for (let user in users) {
        if (users[user].email === email) {
            return users[user];
        }
    }
    return null;
};

module.exports = { users, addUser, findUserByEmail };