const express = require("express");
const app = express();
const flash = require('connect-flash');
const session = require("express-session");
const routes = require("./routes/routes");
const passport = require("passport");
const localStrategy = require("./routes/localStrategy");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "mySecretKey", resave: false, saveUninitialized: false })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/admin", adminRoutes);
app.use("/", routes);

app.set("view engine", "ejs");

const port = 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
