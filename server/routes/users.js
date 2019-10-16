var express = require("express");
var router = express.Router();
const models = require('../models').default;

router.post('/', (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
  models.User.create(newUser)
    .then((user) => {
      res.status(201).send(`User with email ${user.email} has been created`);
    })
    .catch((e)=> {
      if(e && e.errors){
        res.status(400).send(e.errors[0].message);
      }
      res.status(400).send(e);
    });
});

router.get('/', (req, res) => {
  models.User.findAll().then((users)=> {
      res.send(users);
    }).catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;