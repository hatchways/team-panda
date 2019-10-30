import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "./routes/authentication";
import { CustomError } from "./errors/"

import indexRouter from "./routes/index";
import pingRouter from "./routes/ping";
import usersRouter from "./routes/users";

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/users", usersRouter(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// handle Sequelize errors
app.use(function(err, req, res, next) {
  if(err && err.name && err.name.includes('Sequelize')){
    res.status(400).send({errorMsg:err.errors[0].message});
  }else{
    next(err);
  }
});

// handle custom errors
app.use(function(err, req, res, next) {
  if (err instanceof CustomError){
    res.status(err.status).send({errorMsg:err.message});
  }else{
    next(err);
  }
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

module.exports = app;
