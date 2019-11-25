const chai = require("chai");
const chaiHttp = require("chai-http");
const mockery = require("mockery");
const { match, stub, resetHistory } = require("sinon");
const { makeMockModels } = require("sequelize-test-helpers");
const jwt = require("jsonwebtoken");

var app;
var User;
var UserProfile;
var testUser;
var testUserProfile;
var jwtRequest;
chai.should();
chai.use(chaiHttp);

describe("/users/ profile routes", () => {
    before(done => {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });
        User = { findOne: stub() };
        UserProfile = { create: stub(), updateById: stub(), findOne: stub() };
        User.findOne.resolves();
        const mockModels = makeMockModels({ User, UserProfile }, "./models");
        const mockModule = {
            default: mockModels
        };
        mockery.registerMock("../models", mockModule);
        app = require("../../app.js");
        testUser = {
            id: 25,
            email: "jdoe1@email.com",
            name: "John",
            password: "pass12"
        };
        testUserProfile = {
            location: "Some location",
            overview: "This is my overview",
            introduction: "This is my introduction",
            profile_pic: "8as9fy70a87f0.jpg",
            profile_bg: "7d6f8q7317f637.jpg"
        };
        jwtRequest = jwt.sign({ id: testUser.id }, "tempSecret");
        done();
    });

    beforeEach(() => {
        // Default stub resolve
        User.findOne.resolves(testUser);
        UserProfile.create.resolves(testUserProfile);
        UserProfile.findOne.resolves(testUserProfile);
    });

    after(done => {
        mockery.disable();
        mockery.deregisterAll();
        done();
    });

    describe("POST /users/:userId", () => {
        it("should return 401 unauthorized if no jwt is given", done => {
            chai.request(app)
                .post(`/users/${testUser.id}`)
                .send(testUserProfile)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.eql("Unauthorized");
                    done();
                });
        });

        it("should return 403 unauthorized if id in jwt does not match id in request params", done => {
            let differentUser = { ...testUser };
            differentUser.id = 2;
            chai.assert(differentUser.id == 2);
            User.findOne.resolves(differentUser);
            chai.request(app)
                .post(`/users/${differentUser.id}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .send(UserProfile)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property("errorMsg").eql("Forbidden");
                    done();
                });
        });

        it("should store user info and return info in response", done => {
            UserProfile.create.resolves({
                ...testUserProfile,
                userId: 25,
                createdAt: "2019-10-28T01:29:12.555Z"
            });
            chai.request(app)
                .post(`/users/${testUser.id}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .send(testUserProfile)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have
                        .property("location")
                        .eql("Some location");
                    res.body.should.have
                        .property("overview")
                        .eql("This is my overview");
                    res.body.should.have.property("createdAt");
                    res.body.should.have.property("userId").eql(25);
                    done();
                });
        });
    });

    describe("PUT /users/:userId", () => {
        let newInfo;

        before(() => {
            newInfo = {
                location: "New place",
                overview: "This is a different overview"
            };
        });

        it("should return 401 unauthorized if no jwt is given", done => {
            chai.request(app)
                .put(`/users/${testUser.id}`)
                .send(newInfo)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.eql("Unauthorized");
                    done();
                });
        });

        it("should return 403 unauthorized if id in jwt does not match id in request params", done => {
            let differentUser = { ...testUser };
            differentUser.id = 2;
            chai.assert(differentUser.id == 2);
            User.findOne.resolves(differentUser);
            chai.request(app)
                .put(`/users/${differentUser.id}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .send(UserProfile)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property("errorMsg").eql("Forbidden");
                    done();
                });
        });

        it("should return 200 status and updated user if jwt id and param id match", done => {
            UserProfile.updateById.resolves({});
            chai.request(app)
                .put(`/users/${testUser.id}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .send(newInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("location").eql("New place");
                    res.body.should.have
                        .property("overview")
                        .eql("This is a different overview");
                    done();
                });
        });
    });

    describe("GET /users/:userId", () => {
        it("should return 401 if there is no jwt provided", done => {
            chai.request(app)
                .get(`/users/${testUser.id}`)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.eql("Unauthorized");
                    done();
                });
        });

        it("should return a user's profile info", done => {
            chai.request(app)
                .get(`/users/${testUser.id}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.eql(testUserProfile);
                    done();
                });
        });

        it("should return another user's profile info", done => {
            let differentUserProfile = {
                location: "Differen location",
                overview: "Different overview",
                introduction: "Different intro",
                profile_pic: "7d6f8q7317f637.jpg",
                profile_bg: "8as9fy70a87f0.jpg"
            };
            let differentUserId = 5;
            UserProfile.findOne.resolves(differentUserProfile);
            chai.request(app)
                .get(`/users/${differentUserId}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.eql(testUserProfile);
                    done();
                });
        });

        it("should have a 404 status if user does not exist with that userId", done => {
            let differentUserId = 5;
            UserProfile.findOne.resolves(null);
            chai.request(app)
                .get(`/users/${differentUserId}`)
                .set("Authorization", `Bearer ${jwtRequest}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
