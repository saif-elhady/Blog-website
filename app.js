require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const { isActiveRoute } = require('./routes/routeHelpers');

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
app.use(cookieParser());
app.use(methodOverride('_method'));

const dbURI = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(dbURI)
    .then((result) => app.listen(PORT))   
    .catch((err) => console.log(err));

app.use('/', require('./routes/main'));
app.use('/', require('./routes/admin'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.locals.isActiveRoute = isActiveRoute; 



