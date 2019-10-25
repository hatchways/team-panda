const User = require('.').User;

const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('user_profile', { //createdAt is a collum which was generated aut by sequelize
    location: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    overview: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.STRING
    },
    profile_pic: {
      type: DataTypes.STRING
    },
    profile_bg: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });

  UserProfile.associate = function(models) {
    UserProfile.belongsTo(models.User)

    UserProfile.hasMany(models.Pet, {
      foreignKey: 'owner_id',
      as: 'pets'
    });

    UserProfile.belongsToMany(models.Pet, {
      through: 'Followed_pet',
      as: 'following',
      foreignKey: 'user_id'
    })
  };

  return UserProfile;
}

export default userProfile;

