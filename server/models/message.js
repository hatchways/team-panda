module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        "message",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            text: {
                type: DataTypes.TEXT
            },
        }
    );

    Message.associate = function(models){
        Message.belongsTo(models.User, {as: "from"});
        Message.belongsTo(models.User, {as: "to"});
    }
    return Message;
};

