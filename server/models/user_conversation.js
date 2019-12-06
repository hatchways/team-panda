module.exports = (sequelize, DataTypes) => {
    const UserConversation = sequelize.define(
        "user_conversation",
        {
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
    return UserConversation;
};

