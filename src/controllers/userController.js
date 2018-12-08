const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signUp(req, res, next){
      res.render("user/signup", {title: "Sign-Up"});
    },
    create(req, res, next){
        //#1
        let newUser = {
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
        };

        let msg = {
            to: newUser.email,
            from: 'test@example.com',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
                })
            }
        });
        sgMail.send(msg)
        .catch((err) => {
            console.log(err)
        })
    }
  }