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
        var isCollaborator 
        if(collaboratorQueries.isCollaborator(req) !== null){
            isCollaborator = true;
        } else if (collaboratorQueries.isCollaborator(req) == null) {
            isCollaborator = false;
        }
        
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/")
            } else {
                let wikiMDhtml = markdown.toHTML(wiki.body)
                res.render("wiki/show", {wiki, body: wikiMDhtml, title: "Wiki", isCollaborator});
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
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if(err || wiki == null){
                console.log("update err is...")
                console.log(err)
              res.redirect(401, `/wikis/${req.params.wikiId}/edit`);
            } else {
              res.redirect(`/wikis/${req.params.wikiId}`);
            }
        });
    },
    collaboratorForm(req, res, next){
        console.log(req.params.wikiId)
        console.log("wikiId is above")
        res.render("wiki/collaboratorForm", {title: "Add a collorator", wikiId: req.params.wikiId});
    },
    collaboratorCreate(req, res, next){
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if(err){
                console.log(err)
                res.redirect(`/wikis/${req.params.wikiId}`)
            } else {
                req.flash("notice", "Added collaborator")
                res.redirect(`/wikis`)
            }
        })
    },
    collaborators(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err){
                console.log(err);
                res.redirect("/wikis")
            } else {
                collaboratorQueries.getAllCollaborators(req.params.wikiId, (err, collaborators) => {
                    if(err){
                        console.log(err)
                        res.redirect(`/wikis/${req.params.wikiId}`)
                    } else {
                        res.render("wiki/collaborators", {collaborators, title: "Collaborators", wiki: wiki});
                    }
                })
            }
        })
    },
    deleteCollaborator(req, res, next){
        collaboratorQueries.deleteCollaborator(req, (err) => {
            if(err){
                console.log(err);
                res.redirect(`/wikis/${req.params.wikiId}/collaborators`)
            } else {
                res.redirect(`/wikis/${req.params.wikiId}/collaborators`)
            }
        })
    }
  }