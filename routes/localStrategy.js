const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getAdminByName, getAdminById } = require("../models/db");

passport.use(
  new LocalStrategy(async (userName, password, cb) => {
    const user = await getAdminByName(userName);

    if (!user) {
      return cb(null, false, { message: "Incorrect username." });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return cb(null, false, { message: "Incorrect password." });
    }

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user.id);
  });
});

passport.deserializeUser(function (id, cb) {
  getAdminById(id)
    .then((admin) => {
      return cb(null, admin);
    })
    .catch((err) => {
      return cb(err);
    });
});

module.exports = passport;
