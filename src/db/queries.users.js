// #1
const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
// #2
  createUser(newUser, callback){

// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4
    return User.create({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  upgrade(req, callback){
    return User.findById(userId)
    .then((user) => {
      if(!user){
        return callback("User not found", null);
      }
      let upgradeUser = {
        username: req.user.username,
        email: req.user.email,
        password: req.user.password,
        role: 1
      }
      user.update(upgradeUser, {
        fields: Object.keys(upgradeUser)
      })
      .then(() => {
        callback(null, user)
      })
      .catch((err) => {
        callback(err);
      });
    })
  }
}