// test/helpersTest.js

const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js').default;
const { users } = require('../users.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    assert.equal(user.id, "userRandomID");
  });

  it('should return undefined with invalid email', function() {
    const user = findUserByEmail("noemail@banana.net", testUsers)
    assert.isUndefined(user);
    });
});