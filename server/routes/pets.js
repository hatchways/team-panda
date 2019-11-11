var express = require("express");
const models = require("../models").default;
const { upload } = require("../storage/config");
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
        upload.single("profilePic"),
        (req, res, next) => {
            let newPet = req.body;
            if (req.file) newPet.profilePic = req.file.location;
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
