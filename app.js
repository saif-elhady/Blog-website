require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//connect to mongodb
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbURI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI)
    .then((result) => app.listen(PORT))   
    .catch((err) => console.log(err));

app.use('/', require('./routes/main'));

