const wikiQueries = require("../db/queries.wikis");
const collaboratorQueries = require("../db/queries.collaborators")
const userQueries = require("../db/queries.users");
const markdown = require( "markdown" ).markdown;

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
        wikiQueries.getAllWikis(req.user ? req.user.id : null, (err, wikis) => {
            //user req id here?
            
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wiki/index", {wikis, title: "Wikis"})
            }
        })
    }, 
    create(req, res, next){

        let privacy;

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
                res.redirect(500, "/wikis/new");
                console.log(err)
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    },
    show(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/")
            } else {
                let wikiMDhtml = markdown.toHTML(wiki.body)
                res.render("wiki/show", {wiki, body: wikiMDhtml, title: "Wiki"});
            }
        });
    },
    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                //console.log("topicController destroy err right below...")
                //console.log(err)
                res.redirect(
                    typeof err === "number" ? err : 500,
                    `/wikis/${req.params.wikiId}`
                  );
            } else {
                res.redirect(303, "/wikis")
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err || wiki == null){
                console.log(err)
                res.redirect(404, "/");
            } else {
                /*var collaborator;
                for(var i=0; i < wiki.collaborators.length; i++){
                    if(wiki.collaborators[i] === currentUser.id){
                        collaborator = true;
                    }
                }*/
                /*const authorized = new Authorizer(req.user, topic).edit();
                if(authorized){*/
                    res.render("wiki/edit", {wiki, /*collaborator,*/ title: "Edit"});
                /*} else {
                    req.flash("You are not authorized to do that.")
                    res.redirect(`/topics/${req.params.id}`)
                }*/
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    update(req, res, next){
        var userExists;
        var userAlreadyCollaborating;
        function doesUserExist(req){
            var collaboratorUsername = req.body.collaborator;
            userQueries.findUser(collaboratorUsername)
            .then((user) => {
                if(user){
                    console.log(".userExists returns...")
                    console.log(user)
                    userExists = true
                } else {
                    userExists = false
                }
            })
        };
        function collaboratorAlreadyExists(wikiId, userId){
            collaboratorQueries.getCollaborators(wikiId)
            .then((collaborators) => {
                for(var i=0; i<collaborators.length; i++){
                    if(collaborators[i].userId == userId){
                        userAlreadyCollaborating = true;
                    } else {
                        userAlreadyCollaborating = false;
                    }
                }
            })
        };
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(401, `/wikis/${req.params.wikiId}/edit`);
                console.log(err)
            } else {
                if(req.body.collaborator != null){
                    console.log("1) req.body.collaborator is not null")
                    doesUserExist(req);
                    if(userExists == false){
                        res.redirect(404, `/wikis/${req.params.wikiId}/edit`)
                        console.log("Username does not exist.")
                    } else {
                        collaboratorAlreadyExists(wiki.id, req.user.id)
                        console.log("collaboratorAlreadyExists was ran...")
                        if(userAlreadyCollaborating == false){
                            collaboratorQueries.createCollaborator(req.params.wikiId, req.user.id, (err, collaborator) => {
                                if(err || collaborator == null){
                                    console.log(err);
                                    res.redirect(`/wikis/${req.params.wikiId}`);
                                }
                            })
                        }
                    }
                }
                res.redirect(`/wikis/${req.params.wikiId}`);
            }
        });
    },
    collabCreate(req, res, next){
        wikiQueries.collabCreate(req, (err) => {
            if(err){
                res.redirect("/");
                console.log(err);
            } else {
                res.redirect(`/wikis/${req.params.wikiId}`);
            }
        });
    },
    collabDelete(req, res, next){
        wikiQueries.collabDelete(req, (err) => {
            if(err){
                res.redirect("/");
                console.log(err);
            } else {
                res.redirect(`/wikis`);
            }
        });
    }
  }