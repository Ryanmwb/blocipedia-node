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
    },
    getWiki(id, callback){
        //return Topic.findById(id) //checkpoint has this code in along with the following line of code.  I assume this is an error on their part.
        return Wiki.findById(id, {
                include: [{
                  model: Post,
                  as: "posts"
                }]
              })
        .then((wiki) => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        })
    }
}