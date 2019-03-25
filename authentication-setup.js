const passport = require("passport");
const { findUser } = require("./data-interface");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = findUser(username);
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
  const user = findUser(username);
  done(null, user);
});
