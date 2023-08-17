const express = require("express");
const passport = require("./localStrategy");
const router = express.Router();
const { getTestsFromDB, getPassesFromDB } = require("../models/db");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }

  // User is not authenticated, redirect them to the login page
  res.redirect("admin/login");
}

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/admin");
  }
);

router.get("/", isAuthenticated, (req, res) => {
  Promise.all([getTestsFromDB(), getPassesFromDB()])
    .then(([tests, passes]) => {
      res.render("admin", { tests, passes });
    })
    .catch(console.log);
});

module.exports = router;
