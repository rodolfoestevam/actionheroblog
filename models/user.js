module.exports = function (sequelize, Datatypes) {

    const User = sequelize.define('User', {
        'userName': {
            type: Sequelize.STRING,
            allowNull: false,
        },
        'passwordHash': {
            type: DataTypes.TEXT,
            allowNull: false
        },
        'passwordSalt': {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    // force: true will drop the table if it already exists
    User.sync({
        force: true
    }).then(() => {
        // Table created
        return User.create({
            firstName: 'Rodolfo'
        });
    });

}