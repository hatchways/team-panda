const Pet = require(".").Pet;

const post = (sequelize, DataTypes) => {
    const Post = sequelize.define("post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pet_id: {
            type: DataTypes.INTEGER
        },
        caption: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        date_of_creation: {
            type: DataTypes.DATE
        },
        likes: {
            type: DataTypes.INTEGER
        },
        type: {
            type: DataTypes.STRING
        }
    });

    Post.associate = function(models) {
        Post.belongsTo(models.Pet, {
            foreignKey: "pet_id"
        });
    };

    return Post;
};

export default post;
