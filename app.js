const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');








const indexRouter = require('./routes');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(indexRouter);

module.exports = app;
