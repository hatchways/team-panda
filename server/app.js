import createError from "http-errors";
import express, { json, urlencoded } from "express";
import http from "http";
import socketIo from "socket.io";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "./routes/authentication";
import { CustomError, ForbiddenError } from "./errors/";
import jwt from "jsonwebtoken";
import models from "./models";

import indexRouter from "./routes/index";
import pingRouter from "./routes/ping";
import usersRouter from "./routes/users";
import { petsRouter } from "./routes/pets";
// import messages from "./routes/messages";

var app = express();
var server = http.createServer(app);
var io = socketIo(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers":
                "Content-Type, Authorization, token",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/users", usersRouter(passport));
app.use("/pets", petsRouter(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// handle Sequelize errors
app.use(function(err, req, res, next) {
    if (err && err.name && err.name.includes("Sequelize")) {
        res.status(400).send({ errorMsg: err.errors[0].message });
    } else {
        next(err);
    }
});

// handle custom errors
app.use(function(err, req, res, next) {
    if (err instanceof CustomError) {
        res.status(err.status).send({ errorMsg: err.message });
    } else {
        next(err);
    }
});

io.use(function(socket, next) {
    if (socket.handshake.headers && socket.handshake.headers.token) {
        jwt.verify(socket.handshake.headers.token, "tempSecret", function(
            err,
            decoded
        ) {
            console.log(err);
            if (err) return next(new ForbiddenError());
            socket.userId = decoded.userId;
            next();
        });
    }
    next(new CustomError("No token provided"));
}).on("connection", function(socket) {
    console.log("connected");
    socket.on("new message", function(conversationId, message) {
        models.Message.create(message).then(newMessage => {
            io.to(`${conversationId}`).emit(newMessage);
        });
    });
    socket.on("new conversation", function(userIds) {
        models.Conversation.create().then(newConversation => {
            models.User.findAll({
                attributes: {
                    exclude: ["password", "confirmPass"]
                },
                where: {
                    id: userIds
                }
            })
                .then(users => {
                    return newConversation.addUsers(users);
                })
                .then(() => {
                    for (let userId of userIds) {
                        socket.emit(userId, newConversation);
                    }
                });
        });
    });

    socket.on("join room", function(conversationId) {
        socket.join(conversationId);
    });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err });
});

module.exports = { app, server };
