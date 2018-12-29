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
    createCollaborator(wikiId, userId, callback){
        return Collaborator.create({
            wikiId: wikiId,
            userId: userId
        })
        .then((collaborator) => {
            callback(null, collaborator)
        })
        .catch((err) => {
            callback(err)
        })
    }
}