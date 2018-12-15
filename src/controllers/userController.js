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
    },
    signInForm(req, res, next){
        res.render("user/signIn", {title: "Sign In"});
    }, 
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
              req.flash("notice", "Sign in failed. Please try again.")
              res.redirect("/users/sign_in");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
        })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("Notice", "You've successfully signed out!")
        res.redirect("/")
    },
    upgradeForm(req, res, next){
        var keyPublishable = process.env.PUBLISHABLE_KEY;
        res.render("user/upgradeForm", {title: "Upgrade", keyPublishable: keyPublishable})
    },
    charge(req, res, next){ 
        let amount = 1500; 
        const keySecret = process.env.SECRET_KEY;
        const stripe = require("stripe")(keySecret);
        console.log(keySecret)
        console.log("Creating customer...");
        stripe.customers.create({ 
          email: req.body.stripeEmail, 
          source: req.body.stripeToken 
        }) 
        .then(customer => {
          console.log("Created customer, creating charge...");
          stripe.charges.create({ 
            amount, 
            description: "Sample Charge", 
            currency: "usd", 
            customer: customer.id 
          })
          .then(charge => 
            userQueries.upgrade(req, (err, user) => {
                if(err || user == null){
                    res.redirect(404, "/");
                } else {
                    res.redirect("/wikis/new", {title: "Create"})
                }
            })
          )
        })
        .catch((err) => {
            console.log(err)
        }); 
    } 
}