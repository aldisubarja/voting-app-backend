const express = require('express');
const { mongoURI, port } = require('./app/modules/config');
const routeWrapper = require('./app/modules/routeWrapper');
const { connectMongoDB } = require('./app/modules/mongo');

const app = express();
app.use(express.json());
app.use('/', routeWrapper);
app.listen(port, () => console.log(`Server running on port ${port}`));

connectMongoDB(mongoURI)

module.exports = app