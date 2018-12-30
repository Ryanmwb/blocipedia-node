const Collaborator = require("./models").Collaborator
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    getCollaborator(wikiId){
        return Collaborator.findOne({
            where: {
                wikiId: wikiId
            }
        })
        .catch((err) => {
            console.log(err)
        });
    },
    getAllCollaborators(wikiId, callback){
        return Collaborator.findAll({
            where: {
                wikiId: wikiId
            }
        })
        .then((collaborators) => {
            callback(null, collaborators)
        })
        .catch((err) => {
            callback(err)
        })
    },
    createCollaborator(req, callback){
        return Collaborator.findOne({
            where: {
                wikiId: req.params.wikiId,
                userId: req.body.collaboratorId
            }
        })
        .then((user) => {
            if(!user){
                return Collaborator.create({
                    wikiId: req.params.wikiId,
                    userId: req.body.collaboratorId
                })
                .then((collaborator) => {
                    callback(null, collaborator)
                })
                .catch((err) => {
                    callback(err)
                })
            } else {
                let err = "This user is already a collaborator on this Wiki";
                callback(err)
            }
        })
        
    }
}