module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define(
        "conversation",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            underscored: true
        }
    );

    Conversation.associate = function(models) {
        Conversation.hasMany(models.Message);
        Conversation.belongsToMany(models.User, {
            through: "user_conversation"
        });
    };

    return Conversation;
};
