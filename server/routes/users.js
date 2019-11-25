var express = require("express");
var router = express.Router();
const models = require("../models").default;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors");
const { upload } = require("../storage/config");

module.exports = auth => {
    router.use("/:userId/pets", require("./pets").petsOwners(auth));
    router.post("/register", (req, res, next) => {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        };
        models.User.create(newUser)
            .then(user => {
                res.status(201).json(createJWTResponse(user));
            })
            .catch(next);
    });

    router.post("/login", (req, res, next) => {
        let user_cred = {
            email: req.body.email,
            password: req.body.password
        };
        models.User.findOne({ where: { email: user_cred.email } })
            .then(user => {
                return validateLogin(user, user_cred);
            })
            .then(user => {
                res.status(200).json(createJWTResponse(user));
            })
            .catch(next);
    });

    router.post(
        "/:userId",
        auth.authenticate("jwt-param-id", { session: false }),
        (req, res, next) => {
            let userProfile = req.body;
            userProfile.userId = req.params.userId;
            models.UserProfile.create(userProfile)
                .then(userProfile => {
                    res.status(201).send(userProfile);
                    // SequelizeForeignKeyConstraintError
                })
                .catch(next);
        }
    );

    router.put(
        "/:userId",
        auth.authenticate("jwt-param-id", { session: false }),
        upload.fields([
            {
                name: "profilePic",
                maxCount: 1
            },
            {
                name: "profileBg",
                maxCount: 1
            }
        ]),
        (req, res, next) => {
            let updatedProfile = req.body;
            updatedProfile.userId = req.params.userId;
            findImages(req, updatedProfile);
            models.UserProfile.updateById(updatedProfile.userId, updatedProfile)
                .then(() => {
                    res.status(200).send(updatedProfile);
                })
                .catch(next);
        }
    );

    router.get(
        "/:userId",
        auth.authenticate("jwt", { session: false }),
        (req, res, next) => {
            models.UserProfile.findOne({ where: { userId: req.params.userId } })
                .then(userProfile => {
                    if (userProfile) {
                        return res.status(200).send(userProfile);
                    }
                    res.status(404).send();
                })
                .catch(next);
        }
    );

    return router;
};

function validateLogin(actualUser, givenUser) {
    if (actualUser) {
        return bcrypt
            .compare(givenUser.password, actualUser.password)
            .then(res => {
                if (res) {
                    return Promise.resolve(actualUser);
                }
                return Promise.reject(
                    new AuthenticationError("Incorrect username/password")
                );
            });
    } else {
        return Promise.reject(
            new AuthenticationError("Incorrect username/password")
        );
    }
}

function createJWTResponse(user) {
    return {
        email: user.email,
        id: user.id,
        name: user.name,
        token: jwt.sign({ id: user.id }, "tempSecret")
    };
}

function findImages(req, profile) {
    if (req.files && req.files["profilePic"]) {
        profile.profilePic = req.files["profilePic"][0].location;
    }
    if (req.files && req.files["profileBg"]) {
        profile.profileBg = req.files["profileBg"][0].location;
    }
}
