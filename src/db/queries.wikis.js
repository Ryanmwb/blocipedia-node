const Wiki = require("./models").Wiki

module.exports = {
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addWiki(newWiki, callback){
        return Wiki.create({
          title: newWiki.title,
          body: newWiki.body,
          private: newWiki.private,
          userId: newWiki.userId
        })
        .then((topic) => {
          callback(null, topic);
        })
        .catch((err) => {
          callback(err);
        })
    }
}