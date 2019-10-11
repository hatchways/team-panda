const User = require('.').User;

const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('userProfile', { //createdAt is a collum which was generated aut by sequelize
    location: {
      type: DataTypes.STRING
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
    timestamps: false// check
  });

  UserProfile.associate = function(models) {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'id',
    });

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

