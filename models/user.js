// var bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes, api) => {
  const model = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paranoid: true
  });

  // Attach Class methods
  model.rehydrate = function (user) {
    return this.build(user)
  }

  // Attach Instance methods
  model.prototype.apiData = function () {
    return {
      id: this.id
    }
  }
  return model;
}

// model.prototype.checkPassword = async function (password, callback) {
//   return bcrypt.compare(password, this.passwordHash)
// }

// model.prototype.apiData = function (api) {
//   return {
//     id: this.id,
//     userName: this.userName,
//   }
// }

// model.sync({
//   force: true
// }).then(function () {
//   return User.create({
//     userName: 'Rodolfo'
//   })