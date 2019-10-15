var express = require("express");
var router = express.Router();
import models from '../models';

router.post('/', (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  models.User.create(newUser)
    .then((user) => {
      res.send(`User with email ${user.email} has been created`);
    }).catch((e)=> {
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