const passport = require("passport");
// const { findUser } = require("./data-interface");
const LocalStrategy = require("passport-local").Strategy;
const dataInterface = require("./data-interface");

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = dataInterface.findUser(username);
    if (user && user.password === password) {
      return done(null, user);
    }
    throw "Could not find user with credentials provided";
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = dataInterface.findUser(username);
  done(null, user);
});
