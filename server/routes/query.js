const express = require("express");
const router = express.Router();
const models = require("../models").default;
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = auth => {
    router.get(
        "/",
        // auth.authenticate("jwt", { session: false }),
        (req, res, next) => {
            let typeDict = {
                pet: models.Pet,
                user: models.User,
                post: models.Post
            };
            let model = typeDict[req.query["type"]];
            model
                .findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${req.query["search"]}%`
                        }
                    }
                })
                .then(matchedModels => {
                    res.send(matchedModels);
                })
                .catch(next);
        }
    );
    return router;
};
