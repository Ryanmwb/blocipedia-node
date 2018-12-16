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
      return User.update(
        {role: 1},
        {where: {id: req.user.id}}
      ) 
      .then((user) => {
        callback(null, user)
      })
      .catch((err) => {
        callback(err);
      });
  },
  downgrade(req, callback){
    return User.update(
      {role: 0},
      {where: {id: req.user.id}}
    )
    .then((user) => {
      callback(null, user)
    })
    .catch((err) => {
      callback(err)
    });
  }
}