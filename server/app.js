const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const app = express();

app.use(cors())

/**
 * endpoint middlewares
 */
const REST = require('./routes/rest');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rest', REST)

module.exports = app;