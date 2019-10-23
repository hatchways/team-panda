var express = require("express");
var router = express.Router();
const models = require('../models').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res, next) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
  models.User.create(newUser)
    .then((user) => {
      res.status(201).json(createJWTResponse(user));
    }).catch(next);
});

router.post('/login', (req, res, next) => {
  let user_cred = {
    email: req.body.email,
    password: req.body.password,
  }
  models.User.findOne({where: {email: user_cred.email}}).then((user)=> {
      return validateLogin(user, user_cred);
    }).then((user) => {
      res.status(200).json(createJWTResponse(user));
    }).catch(next);
});

function validateLogin(actualUser, givenUser){
  if (actualUser){
    return bcrypt.compare(givenUser.password,actualUser.password).then((res) =>{
      if(res){ return Promise.resolve(actualUser) }
        return Promise.reject({loginError: 'Incorrect username/password'})  
    });
  }else {
    return Promise.reject({loginError: 'Incorrect username/password'});  
  }
}

function createJWTResponse(user){
  return {
      "email": user.email,
      "id": user.id,
      "token": jwt.sign(user.id, "tempSecret")
    }
}
module.exports = router;