const express = require('express');
const app = express();
const session = require('express-session');
const routes = require('./routes/routes');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'mySecretKey', resave: false, saveUninitialized: true }));
app.use('/', routes);
app.set('view engine', 'ejs');

const port = 8081;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});