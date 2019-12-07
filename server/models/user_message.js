module.exports = (sequelize, DataTypes) => {
    const UserMessage = sequelize.define(
        "user_message",
        {
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
    return UserMessage;
};

