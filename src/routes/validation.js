const User = require("../db/models").User;

module.exports = {
 
    validateUsers(req, res, next) {
      if(req.method === "POST") {
 
 // #1
        //req.checkBody("name", "cannot be empty").isLength({min: 1});  This works for signUp but not signIn
        req.checkBody("email", "must be valid").isEmail();
        req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6})
        req.checkBody("password_conf", "must match password provided").optional().matches(req.body.password);
      }
 
      const errors = req.validationErrors();

      const duplicate = User.findOne({
        email: req.body.email
      })
      console.log("duplicate is...")
      console.log(duplicate)
      console.log("Duplicate end")
      if (errors) {
        if(duplicate != null) {
          console.log("if duplicate is null..")
          console.log(duplicate)
          req.flash("email has already been used", errors);
          return res.redirect(req.headers.referer);
        }
        req.flash("error", errors);
        return res.redirect(req.headers.referer);
      } else {
        return next();
      }
    }
 }