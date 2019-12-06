module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define(
        "conversation",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        }
    );

    Conversation.associate = function(models) {
        Conversation.hasMany(models.Message);
        Conversation.hasMany(models.User);
    };

    return Conversation;
};

