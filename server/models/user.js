var bcrypt = require("bcrypt");

const user = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: {
                    args: true,
                    msg: "This email is already taken. Please try another one."
                },
                allowNull: false,
                validate: {
                    isEmail: {
                        args: true,
                        msg: "Email is invalid."
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [6],
                        msg: "Password must be at least 6 characters."
                    }
                }
            },
            confirmPassword: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    passwordsMatch: function(val) {
                        if (val !== this.get("password")) {
                            throw new Error("Passwords must match.");
                        }
                    }
                }
            }
        },
        {
            defaultScope: {
                attributes: { exclude: ["currentPassword"] }
            },
            hooks: {
                afterValidate: (usr, options) => {
                    return hashPass(usr);
                },

                afterCreate: (usr, options) => {
                    return usr.createUser_profile({ userId: usr.id });
                }
            },
            timestamps: false
        }
    );

    User.associate = function(models) {
        User.hasMany(models.Pet, {
            foreignKey: "ownerId",
            as: "pets"
        });

        User.hasOne(models.UserProfile, {
            foreignKey: "id"
        });

        User.belongsToMany(models.Conversation, {through: 'user_conversation'});
    };
    return User;
};

function hashPass(newUser) {
    return bcrypt.hash(newUser.password, 12).then(hash => {
        newUser.password = hash;
    });
}

export default user;
