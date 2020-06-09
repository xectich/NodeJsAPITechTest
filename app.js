const express = require("express");
const app = express();

const routes = require('./services/routes.js');

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.use('/users', routes);

module.exports = app;