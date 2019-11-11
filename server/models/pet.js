const pet = (sequelize, DataTypes) => {
    const Pet = sequelize.define(
        "pet",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            ownerId: {
                type: DataTypes.INTEGER
            },
            animal: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: false
            },
            profilePic: {
                type: DataTypes.STRING
            },
            about: {
                type: DataTypes.STRING
            }
        },
        {
            underscored: true
        }
    );

    Pet.associate = function(models) {
        Pet.belongsTo(models.User, {
            as: "owner"
        });

        Pet.hasMany(models.Post, {
            foreignKey: "pet_id",
            as: "post"
        });

        Pet.belongsToMany(models.UserProfile, {
            through: "Followed_pet",
            as: "followers",
            foreignKey: "pet_id"
        });
    };

    return Pet;
};

export default pet;
