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
    }, 
    create(req, res, next){

        let privacy

        if(req.body.privacy === "private"){
            privacy = true;
        } else {
            privacy = false;
        }
       
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: privacy,
            userId: req.user.id
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                res.redirect(500, "/wiki/new");
                console.log(err)
            } else {
                res.redirect(303, `/wiki/${wiki.id}`);
            }
        });
    }
  }