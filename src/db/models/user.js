'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
  };
  return User;
};