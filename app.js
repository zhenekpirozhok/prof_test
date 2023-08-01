const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.use('/', routes);

const port = 8081;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});