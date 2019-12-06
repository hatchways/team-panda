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
            to: {
                type: DataTypes.INTEGER,
            },
            from: {
                type: DataTypes.INTEGER,
            }
        }
    );
    return Message;
};

