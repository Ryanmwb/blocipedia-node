module.exports = {
    signUp(req, res, next){
      res.render("user/signup", {title: "Sign-Up"});
    }
  }