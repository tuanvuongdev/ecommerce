const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');
require('./dbs/init.mongodb');
require('dotenv').config();

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
checkOverload()

// init routes
app.use('/', require('./routes'));

// handling error


module.exports = app;