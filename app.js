const express = require('express');
const path = require('path');
const dotenv = require('dotenv')
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

dotenv.config();
const cors = require('cors');


const indexRouter = require('./routes');

app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(indexRouter);

module.exports = app;
