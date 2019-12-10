const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const mockery = require("mockery");
const { stub } = require("sinon");
const { makeMockModels } = require("sequelize-test-helpers");
const jwt = require("jsonwebtoken");
const { ValidationError, ValidationErrorItem } = require("sequelize-mock");

var app;
var User;
var Pet;
var testUser;
var testPet;
var testPet2;
var testPetDB;
var testPet2DB;
var jwtRequest;
let testPet3;
let Tag;
let Post;
let testTagDB;
let testPetTagDB;
let updatedTestPet3DB;
let postsDB;

describe("Pets routes", () => {
    before(() => {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });
        Pet = {
            create: stub(),
            findByPk: stub(),
            findOne: stub(),
            update: stub()
        };
        User = { findOne: stub(), createPet: stub() };
        Tag = { findOrCreate: stub() };
        Post = { create: stub(), update: stub(), findByPk: stub() };
        const mockModels = makeMockModels({ Pet, User, Tag, Post }, "./models");
        const mockModule = {
            default: mockModels
        };
        testUser = {
            id: 25,
            email: "jdoe1@email.com",
            name: "John",
            password: "pass12"
        };
        testPet = {
            animal: "Dog",
            name: "Clifford",
            date_of_birth: "2019-10-28T23:23:35.007Z",
            about: "I am a dog. Woof"
        };
        testPet2 = {
            animal: "Cat",
            name: "Garfield",
            date_of_birth: "2019-10-28T23:23:35.007Z",
            about: "I am a cat."
        };
        testPet3 = {
            id: 4,
            ownerId: testUser.id,
            animal: "Cat",
            name: "Shiro",
            date_of_birth: "2019-10-28T23:23:35.007Z",
            about: "I am an energetic cat"
        };
        testPetDB = { ...testPet, id: 2, ownerId: testUser.id };
        testPet2DB = { ...testPet2, id: 3, ownerId: testUser.id };
        updatedTestPet3DB = {
            ...testPet3,
            about: "Hello I am an energetic cat I like dogs",
            name: "Kuroneko"
        };
        testTagDB = [
            { id: 1, title: "striped" },
            { id: 2, title: "energetic" },
            { id: 3, title: "fat" }
        ];
        testPetTagDB = [
            { pet_id: 4, tag_id: 1 },
            { pet_id: 4, tag_id: 2 },
            { pet_id: 4, tag_id: 3 }
        ];

        postsDB = [
            {
                id: 1,
                pet_id: 4,
                caption: "this is my first post!!",
                content:
                    "HEllo there! Lorem Ipsum and some text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum ligula ipsum, interdum condimentum lacus semper nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames"
            },
            {
                id: 2,
                pet_id: 4,
                caption: "this is my secoond post!!",
                content:
                    "second postHEllo there! Lorem Ipsum and some text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum ligula ipsum, interdum condimentum lacus semper nec. Pellentesque habitant"
            }
        ];

        mockery.registerMock("../models", mockModule);
        app = require("../../app.js").app;
        jwtRequest = jwt.sign({ id: testUser.id }, "tempSecret");
    });

    after(done => {
        mockery.disable();
        mockery.deregisterAll();
        done();
    });

    describe("/users/:userId/pets routes", () => {
        describe("POST /users/:userId/pets", () => {
            it("should return 401 if jwt is not included", done => {
                chai.request(app)
                    .post(`/users/${testUser.id}/pets`)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.eql("Unauthorized");
                        done();
                    });
            });

            it("should return 401 if user does not exist", done => {
                User.findOne.resolves(null);
                chai.request(app)
                    .post(`/users/${testUser.id}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testPet)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.eql("Unauthorized");
                        done();
                    });
            });

            it("should return 403 forbidden if jwt user does not match user id param", done => {
                chai.request(app)
                    .post(`/users/${testUser.id + 1}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.should.have
                            .property("errorMsg")
                            .eql("Forbidden");
                        done();
                    });
            });

            it("should return 201 status if a pet was successfully created", done => {
                User.findOne.resolves({
                    ...testUser,
                    createPet: stub().resolves(testPetDB)
                });
                chai.request(app)
                    .post(`/users/${testUser.id}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testPet)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property("animal").eql("Dog");
                        res.body.should.have
                            .property("ownerId")
                            .eql(testUser.id);
                        done();
                    });
            });

            it("Should handle Sequelize ValidationErrors", done => {
                User.findOne.resolves({
                    ...testUser,
                    createPet: stub().rejects(
                        new ValidationError("SequelizeValidationError", [
                            new ValidationErrorItem("Name cannot be empty")
                        ])
                    )
                });
                chai.request(app)
                    .post(`/users/${testUser.id}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have
                            .property("errorMsg")
                            .eql("Name cannot be empty");
                        done();
                    });
            });
        });

        describe("GET /users/:userId/pets", () => {
            it("should return 401 if a jwt is not provided", done => {
                chai.request(app)
                    .get(`/users/${testUser.id}/pets`)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.eql("Unauthorized");
                        done();
                    });
            });

            it("should return 500 if user does not exist", done => {
                User.findOne.resolves(null);
                chai.request(app)
                    .get(`/users/${testUser.id}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.should.have
                            .property("error")
                            .eql(
                                `User with id of '${testUser.id}' does not exist`
                            );
                        done();
                    });
            });

            it("should return all of a user's pets", done => {
                User.findOne.resolves({
                    ...testUser,
                    getPets: stub().resolves([testPetDB, testPet2DB])
                });
                chai.request(app)
                    .get(`/users/${testUser.id}/pets`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("array").to.have.length(2);
                        done();
                    });
            });
        });

        describe("PUT /users/:userId/pets/:petId/edit", () => {
            const testReqBody = {
                about: "Hello I am an energetic cat I like dogs",
                name: "Kuroneko",
                tags: ["striped", "energetic", "fat"]
            };

            it("should return 401 if a jwt is not is not included", () => {
                return chai
                    .request(app)
                    .put(`/users/${testUser.id}/pets/${testPet3.id}/edit`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(401);
                        expect(res.text).to.equal("Unauthorized");
                    });
            });

            it("should return 500 if user does not exist", () => {
                User.findOne.resolves(null);
                return chai
                    .request(app)
                    .put(`/users/${testUser.id}/pets/${testPet3.id}/edit`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(500);
                        expect(res.body.error).to.equal(
                            `User with id of '${testUser.id}' does not exist`
                        );
                    });
            });

            it("should update a user's pet profile", () => {
                User.findOne.resolves(testUser);
                Pet.findByPk.resolves({
                    ...testPet3,
                    setTags: stub().resolves([
                        testPetTagDB.length,
                        testPetTagDB
                    ])
                });
                testReqBody.tags.forEach((tag, i) => {
                    Tag.findOrCreate
                        .withArgs({
                            where: { title: tag },
                            defaults: { title: tag }
                        })
                        .resolves([testTagDB[i]]);
                });
                Pet.update.resolves([1, updatedTestPet3DB]);
                return chai
                    .request(app)
                    .put(`/users/${testUser.id}/pets/${testPet3.id}/edit`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body.profile).to.deep.equal(
                            updatedTestPet3DB
                        );
                        expect(res.body.tags).to.deep.equal(testReqBody.tags);
                    });
            });
        });
        describe("GET /users/:userId/pets/:petId", () => {
            it("should return 400 if pet does not exist", () => {
                Pet.findByPk.resolves(null);
                return chai
                    .request(app)
                    .get(`/users/${testUser.id}/pets/${testPet3.id}`)
                    .then(res => {
                        expect(res).to.have.status(400);
                        expect(res.body.errorMsg).to.equal(
                            "Pet does not exist"
                        );
                    });
            });
            it("should return the pet profile and their posts", () => {
                Pet.findByPk.resolves({ ...testPet3, post: postsDB });
                return chai
                    .request(app)
                    .get(`/users/${testUser.id}/pets/${testPet3.id}`)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.equal({
                            ...testPet3,
                            post: postsDB
                        });
                    });
            });
        });
        describe("POST /users/:userId/pets/:petId/posts/new", () => {
            const testReqBody = {
                caption: "this is my third post",
                content:
                    "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum"
            };
            it("should return 500 if user does not exist", () => {
                User.findOne.resolves(null);
                return chai
                    .request(app)
                    .post(`/users/${testUser.id}/pets/${testPet3.id}/posts/new`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(500);
                        expect(res.body.error).to.equal(
                            `User with id of '${testUser.id}' does not exist`
                        );
                    });
            });
            it("should return 201 when a post is created", () => {
                User.findOne.resolves(testUser);
                Post.create.resolves({ ...testReqBody, id: 3, pet_id: 4 });
                return chai
                    .request(app)
                    .post(`/users/${testUser.id}/pets/${testPet3.id}/posts/new`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.deep.equal({
                            ...testReqBody,
                            id: 3,
                            pet_id: 4
                        });
                    });
            });
        });
        describe("PUT /users/:userId/pets/:petId/posts/:postId/edit", () => {
            const testReqBody = {
                caption: "this is my 2nd post with modified stuff",
                content:
                    "lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum"
            };
            it("should return 500 if user does not exist", () => {
                User.findOne.resolves(null);
                return chai
                    .request(app)
                    .put(`/users/${testUser.id}/pets/${testPet3.id}/posts/new`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(500);
                        expect(res.body.error).to.equal(
                            `User with id of '${testUser.id}' does not exist`
                        );
                    });
            });
            it("should return 201 when a post is updated", () => {
                User.findOne.resolves(testUser);
                Post.update.resolves([
                    1,
                    {
                        ...postsDB[1],
                        ...testReqBody,
                        id: 2,
                        pet_id: 4
                    }
                ]);
                return chai
                    .request(app)
                    .put(`/users/${testUser.id}/pets/${testPet3.id}/posts/2`)
                    .set("Authorization", `Bearer ${jwtRequest}`)
                    .send(testReqBody)
                    .then(res => {
                        expect(res).to.have.status(201);
                        expect(res.body).to.deep.equal({
                            ...postsDB[1],
                            ...testReqBody
                        });
                    });
            });
        });
    });
});
