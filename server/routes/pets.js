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

    //public route: get pet details and their posts
    petsOwnerRouter.get("/:petId", async (req, res, next) => {
        const { Pet, Post } = models;
        const { petId } = req.params;
        try {
            //TODO: finish
            const petAndPosts = await Pet.findByPk(petId, { include: [Post] });
            res.status(200).send(petAndPosts);
        } catch (error) {
            next(error);
        }
    });

    //private route for a user to create a post for their pet
    petsOwnerRouter.post(
        "/:petId/posts/new",
        auth.authenticate("jwt-param-id", { session: false }),
        upload.single("postImage"),
        async (req, res, next) => {
            const { Pet, Post } = models;
            const { petId } = req.params;
            const { caption, content } = req.body;
            try {
                let newPost = {
                    pet_id: petId,
                    caption,
                    content,
                    date_of_creation: new Date()
                };
                if (req.file) newPost.image = req.file.location;
                const createdPost = await Post.create(newPost);
                res.status(201).send(createdPost);
            } catch (error) {
                next(error);
            }
        }
    );

    petsOwnerRouter.put(
        "/:petId/posts/:postId",
        auth.authenticate("jwt-param-id", { session: false }),
        upload.single("postImage"),
        async (req, res, next) => {
            const { Pet, Post } = models;
            const { petId, postId } = req.params;
            const { caption, content } = req.body;
            try {
                let editContent = {
                    caption,
                    content
                };
                if (req.file) editContent.image = req.file.location;
                const editedPost = await Post.update(editContent, {
                    where: { id: postId }
                });
                res.status(201).send(editedPost);
            } catch (error) {
                next(error);
            }
        }
    );

    return petsOwnerRouter;
};
