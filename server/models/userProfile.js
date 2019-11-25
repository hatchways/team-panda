const User = require(".").User;

const userProfile = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define(
        "user_profile",
        {
            //createdAt is a collum which was generated aut by sequelize
            location: {
                type: DataTypes.STRING,
                defaultValue: "Toronto, Canada"
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            overview: {
                type: DataTypes.STRING,
                defaultValue: "This is my overview"
            },
            introduction: {
                type: DataTypes.STRING,
                defaultValue: "This is my introduction"
            },
            profilePic: {
                type: DataTypes.STRING
            },
            profileBg: {
                type: DataTypes.STRING
            }
        },
        {
            underscored: true
        }
    );

    UserProfile.associate = function(models) {
        UserProfile.belongsTo(models.User);

        UserProfile.belongsToMany(models.Pet, {
            through: "Followed_pet",
            as: "following",
            foreignKey: "user_id"
        });
    };
    UserProfile.updateById = (id, updatedUserProfile) => {
        return UserProfile.findOne({ where: { userId: id } }).then(profile => {
            profile.update(updatedUserProfile);
        });
    };
    return UserProfile;
};

export default userProfile;
