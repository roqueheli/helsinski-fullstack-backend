const express = require('express');

const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const { errorHandler, unknownEndpoint, requestLogger } = require('./utils/middleware');
const config = require('./utils/config');
const { info, error } = require('./utils/logger');
const peopleRouter = require('./controllers/people');

mongoose.set('strictQuery', false);

info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => info('connected to MongoDB'))
  .catch((error) => error('error connecting to MongoDB:', error.message));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);

app.use('/api/persons', peopleRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
