const chai = require("chai");
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

describe("Pets routes", () => {
    before(() => {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });
        Pet = { create: stub() };
        User = { findOne: stub(), createPet: stub() };
        const mockModels = makeMockModels({ Pet, User }, "./models");
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
        testPetDB = { ...testPet, id: 2, ownerId: testUser.id };
        testPet2DB = { ...testPet2, id: 3, ownerId: testUser.id };
        mockery.registerMock("../models", mockModule);
        app = require("../../app.js");
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
    });
});
