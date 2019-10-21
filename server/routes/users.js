var express = require("express");
var router = express.Router();
const models = require('../models').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
  models.User.create(newUser)
    .then((user) => {
      res.status(201).send({
        success: `User with email ${user.email} has been created`,
        token: jwt.sign(user.email, "tempSecret")
      });
    })
    .catch((e)=> {
      if(e && e.errors){
        return res.status(400).send({errorMsg:e.errors[0].message});
      }
      res.status(400).send(e);
    });
});

router.post('/login', (req, res) => {
  let user_cred = {
    email: req.body.email,
    password: req.body.password,
  }
  models.User.findOne({where: {email: user_cred.email}}).then((user)=> {
      if (user){
        bcrypt.compare(user_cred.password,user.password, (err,areEqual) => {
          if(areEqual){
            return res.status(200).send({
              success: 'User credentials were valid',
              token: jwt.sign(user.email, "tempSecret")
            });
          }
          res.status(401).send({errorMsg: 'Incorrect username/password'});  
        });
      }else {
        res.status(401).send({errorMsg: 'Incorrect username/password'});  
      }
    }).catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;