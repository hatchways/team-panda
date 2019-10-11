const User = require('.').User;

const pet = (sequelize, DataTypes) => {
  const Pets = sequelize.define('pet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER    
    },
    animal: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    date_of_birth: {
      type: DataTypes.DATE
    },
    profile_pic: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.STRING
    }
  });

  Pets.associate = function(models) {
    Pets.belongsTo(models.UserProfile, {
      foreignKey: 'owner_id'
    });

    Pets.hasMany(models.Post, {
      foreignKey: 'pet_id',
      as: 'post'
    });

    Pets.belongsToMany(models.UserProfile, {
      through: 'Followed_pet',
      as: 'followers',
      foreignKey: 'pet_id'
    })
  };

  return Pets;
}

export default pet;