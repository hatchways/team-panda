var express = require("express");
const models = require("../models").default;
const { upload } = require("../storage/config");
const { CustomError } = require("../errors");
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

    // PUT /users/:userId/pets/:petId/edit
    //for a user to update their pet's profile page
    petsOwnerRouter.put(
        "/:petId/edit",
        auth.authenticate("jwt", { session: false }),
        async (req, res, next) => {
            const { Pet, Post, PetTag, Tag } = models;
            const { petId } = req.params;
            const { name, about, birthdate, tags, animal } = req.body;
            try {
                const pet = await Pet.findByPk(petId);
                let petProfile = {};
                let updatedTags = [];
                if (name) petProfile.name = name;
                if (about) petProfile.about = about;
                if (birthdate) petProfile.birthdate = birthdate;
                if (tags) {
                    // find or create a new tag in tag table
                    // then set the association between a pet and tags
                    let tagItems = tags.map(tag => ({ title: tag }));
                    let createdTags = await Promise.all(
                        tagItems.map(tagItem => {
                            return Tag.findOrCreate({
                                where: tagItem,
                                defaults: tagItem
                            });
                        })
                    );
                    createdTags = createdTags.map(created => created[0]);
                    updatedTags = await pet.setTags(createdTags);
                }
                if (animal) petProfile.animal = animal;
                const [updatedCount, updatedData] = await Pet.update(
                    petProfile,
                    {
                        where: { id: petId },
                        returning: true,
                        plain: true
                    }
                );
                const updatedPetProfile = (updatedData && updatedData[0]) || {};
                let data = { profile: updatedPetProfile, tags };
                res.status(200).send(data);
            } catch (error) {
                next(error);
            }
        }
    );

    // GET /users/:userId/pets/:petId
    //public route: get pet details and their posts
    petsOwnerRouter.get("/:petId", async (req, res, next) => {
        const { Pet, Post } = models;
        const { petId } = req.params;
        try {
            const petAndPosts = await Pet.findByPk(petId, {
                include: [{ model: Post, as: "post" }]
            });
            if (!petAndPosts) throw new CustomError("Pet does not exist");
            res.status(200).send(petAndPosts);
        } catch (error) {
            next(error);
        }
    });

    // POST /users/:userId/pets/:petId/posts/new
    //private route for a user to create a post for their pet
    petsOwnerRouter.post(
        "/:petId/posts/new",
        auth.authenticate("jwt", { session: false }),
        upload.single("postImage"),
        async (req, res, next) => {
            const { Post } = models;
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

    // PUT /users/:userId/pets/:petId/posts/:postId
    //private route for a user to edit their pet's post
    petsOwnerRouter.put(
        "/:petId/posts/:postId",
        auth.authenticate("jwt", { session: false }),
        upload.single("postImage"),
        async (req, res, next) => {
            const { Post } = models;
            const { postId } = req.params;
            const { caption, content } = req.body;
            try {
                let editContent = {
                    caption,
                    content
                };
                if (req.file) editContent.image = req.file.location;
                const post = await Post.findByPk(postId);
                const data = await post.update(editContent);
                res.status(201).send(data);
            } catch (error) {
                next(error);
            }
        }
    );

    return petsOwnerRouter;
};
