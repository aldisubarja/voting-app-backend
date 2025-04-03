const express = require('express');
const { mongoURI, port } = require('./app/modules/config');
const routeWrapper = require('./app/modules/routeWrapper');
const { connectMongoDB } = require('./app/modules/mongo');
const cors = require('cors');
const allowedOrigins = ['http://localhost:5173'];
const app = express();

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/', routeWrapper);
app.listen(port, () => console.log(`Server running on port ${port}`));

connectMongoDB(mongoURI)

module.exports = app