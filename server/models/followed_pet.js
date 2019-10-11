const followed_pet = (sequelize, DataTypes) => {
  const Followed_pet = sequelize.define('followed_pet', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true     
    },
    pet_id: {
      type: DataTypes.INTEGER,
      primaryKey: true     
    }
  });
  return Followed_pet;
}

export default followed_pet;