const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("routes : static", () => {
  describe("POST /User", () => {
    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: `${base}user`, 
        form: {
          name: "test name",
          email: "testemail@gmail.com",
          password: "12345678",
          password_conf: "12345678"
        }
      }
      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "testemail@gmail.com"}})
        .then((user) => {
            //console.log(user)
          expect(user).not.toBeNull();
          expect(user.email).toBe("testemail@gmail.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    });
  });
});