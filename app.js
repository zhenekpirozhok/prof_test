const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.use('/', routes);
app.set('view engine', 'ejs');

const port = 8081;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});