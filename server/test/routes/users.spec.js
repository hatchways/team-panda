const chai = require("chai");
const chaiHttp = require("chai-http");
const mockery = require('mockery');
const { match, stub, resetHistory } = require('sinon');
const { makeMockModels } = require('sequelize-test-helpers');
const bcrypt = require('bcrypt');

var app;
var User;
var testUser;

chai.should();
chai.use(chaiHttp);


describe("POST /users routes", () => {
  before((done) => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });
      User = { create: stub(), findOne: stub() }
      const mockModels = makeMockModels({ User }, './models');
      const mockModule= {
        default: mockModels
      }
      mockery.registerMock('../models', mockModule);
      app = require("../../app.js");
      testUser = {
        "email": "jdoe1@email.com",
        "name": "John",
        "password": "pass12",
        "confirmPassword": "pass12"
      }
      done();
  });

  after((done) => {
    mockery.disable();
    mockery.deregisterAll();
    done();
  });


  describe("POST /users/register", () => {
  
    it("should return the saved user, and return a JWT", (done)=> {
      User.create.resolves({
        "email": "jdoe1@email.com",
        "name": "John",
        "password": "pass12",
        "confirmPassword": "pass12"
      });
      chai
        .request(app)
        .post(`/users/register`)
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  
    it("should return 400 error if email is invalid", (done)=> {
      User.create.rejects({errors: [{message: "Email is invalid."}]});
      chai
        .request(app)
        .post(`/users/register`)
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errorMsg')
          .eql("Email is invalid.");
          done();
        })
    });
  
    it("should return 400 error if email is already taken", (done)=> {
      User.create.rejects({errors: [{message: "This email is already taken. Please try another one."}]});
      chai
        .request(app)
        .post(`/users/register`)
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errorMsg')
          .eql("This email is already taken. Please try another one.");
          done();
        });
    });
  
    it("should return 400 error if passwords do not match", (done)=> {
      User.create.rejects({errors: [{message: "Passwords must match."}]});
      chai
        .request(app)
        .post(`/users/register`)
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errorMsg')
          .eql("Passwords must match.")
          done();
        });
    });
  
    it("should return 400 error if password is less than 6 characters", (done)=> {
      User.create.rejects({errors: [{message: "Password must be at least 6 characters."}]});
      chai
        .request(app)
        .post(`/users/register`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errorMsg')
          .eql("Password must be at least 6 characters.");
          done();
        });
    });
  });
  
  describe("POST /users/login", () => {
  
    beforeEach( () => {
      testUser = {
        "email": "jdoe1@email.com",
        "name": "John",
        "password": "pass12",
        "confirmPassword": "pass12"
      }
    });
  
    it ("should return a 200 response when the credentials are valid", (done) => {
      let userFromDB = {
        "email": "jdoe1@email.com",
        // bcrypt hashed password from DB
        "password": bcrypt.hashSync(testUser.password, 4),
      }
      User.findOne.resolves(userFromDB);
      chai
        .request(app)
        .post("/users/login")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success')
          .eql('User credentials were valid')
          done();
        });
    });
  
    it ("should return a 401 response when the email does not exist in the DB", (done) => {
      User.findOne.resolves(null);
      chai
        .request(app)
        .post("/users/login")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errorMsg')
          .eql('Incorrect username/password');
          done();
        });
    });
    it ("should return a 401 response when the password is incorrect", (done) => {
      let userFromDB = {
        "email": "jdoe1@email.com",
        // bcrypt hashed password from DB
        "password": bcrypt.hashSync("different password in DB", 4),
      }
      User.findOne.resolves(userFromDB);
      chai
        .request(app)
        .post("/users/login")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('errorMsg')
          .eql('Incorrect username/password');
          done();
        });
    });
  });
});