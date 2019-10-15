var bcrypt = require('bcrypt');

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks : {
      afterValidate: (usr, options) => {
        return hashPass(usr);
      }
    },
    timestamps: false
  });
  return User;
}


function hashPass(newUser){
  return bcrypt.hash(newUser.password, 12)
  .then((hash) => {
    newUser.password = hash;
  });
}

export default user;

