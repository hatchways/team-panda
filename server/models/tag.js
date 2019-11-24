module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('tag', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Tag.associate = ({Pet}) => {
        Tag.belongsToMany(Pet, {through: "pet_tag"})
    };
    return Tag;
}
