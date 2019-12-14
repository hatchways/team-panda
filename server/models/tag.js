module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('tag', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        underscored: true
    });
    Tag.associate = ({Pet}) => {
        Tag.belongsToMany(Pet, {through: "pet_tag"})
    };
    return Tag;
}
