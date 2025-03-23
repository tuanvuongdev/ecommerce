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
app.get('/', (req, res) => {
    const strCompress = 'hello world';
    return res.status(200).json({
        message: "Hello world",
        metadata: strCompress.repeat(10000)
    })
})

// handling error


module.exports = app;