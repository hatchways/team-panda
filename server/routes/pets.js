var express = require("express");
const models = require("../models").default;

module.exports.petsRouter = auth => {
    let petsRouter = express.Router();
    petsRouter.get(
        "/",
        auth.authenticate("jwt", { session: false }),
        (req, res) => {
            models.Pet.findAll().then(allPets => {
                res.send(allPets);
            });
        }
    );
    return petsRouter;
};

module.exports.petsOwners = auth => {
    let petsOwnerRouter = express.Router({ mergeParams: true });
    petsOwnerRouter.post(
        "/",
        auth.authenticate("jwt-param-id", { session: false }),
        (req, res, next) => {
            let newPet = req.body;
            req.user
                .createPet(newPet)
                .then(pet => {
                    res.status(201).send(pet);
                })
                .catch(next);
        }
    );

    petsOwnerRouter.get(
        "/",
        auth.authenticate("jwt", { session: false }),
        (req, res, next) => {
            req.user
                .getPets()
                .then(usersPets => {
                    res.send(usersPets);
                })
                .catch(next);
        }
    );
    return petsOwnerRouter;
};
