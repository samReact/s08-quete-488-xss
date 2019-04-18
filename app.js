const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cache = require("memory-cache");
const passport = require("passport");
const { check, validationResult } = require("express-validator/check");

require("./authentication-setup");
const dataInterface = require("./data-interface");
// const { createMessage, getMessages, seedUsers } = require("./data-interface");
global.cache = cache;
dataInterface.seedUsers();

const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(
    session({
      cookie: { sameSite: true },
      secret: "secretKeyThatShouldBeInEnvironmentConfig",
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Requests that do not require authentication
app
  .get("/messages", (_, res) =>
    res.send({ messages: dataInterface.getMessages() })
  )
  .post("/login", (req, res, next) => {
    passport.authenticate("local", (error, user) => {
      if (error) {
        return res.status(401).send({ error });
      }
      return req.login(user, _ => res.redirect("/me"));
    })(req, res, next);
  });

// Requests that require authentication
const getErrorAsObject = errors =>
  errors.reduce((errorObject, { param, msg }) => {
    errorObject[param] = msg;
    return errorObject;
  }, {});

app
  .use((req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.sendStatus(401);
  })
  .get("/me", (req, res) => res.send(req.user))
  .post(
    "/messages",
    [
      check("content")
        .not()
        .isEmpty()
        .withMessage("Content may not be empty"),
      check("personalWebsiteURL")
        .isURL({ require_protocol: true })
        .withMessage(
          "URL must be a valid HTTP URL starting with http:// or https://"
        )
    ],
    (req, res) => {
      const { content, personalWebsiteURL } = req.body;
      const errors = validationResult(req).array();

      if (errors.length) {
        return res.status(400).send({ errors: getErrorAsObject(errors) });
      }

      dataInterface.createMessage(
        req.user.username,
        content,
        personalWebsiteURL
      );
      return res.status(201).send({ messages: dataInterface.getMessages() });
    }
  );

module.exports = app;
