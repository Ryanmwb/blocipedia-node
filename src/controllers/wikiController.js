const wikiQueries = require("../db/queries.wikis");

module.exports = {
    /*index(req, res, next){
      res.render("static/index", {title: "Welcome to Blocipedia"});
      console.log(req.user.username)
    }*/
    new(req, res, next){
        res.render("wiki/new", {title: "Create a Wiki"});
        console.log("new wiki")
    },
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wiki/index", {wikis})
            }
        })
    }/*, 
    create(req, res, next){
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        }
    }*/
  }