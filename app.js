require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    const locals = {
        title: 'nodejsBlog',
        description: 'A simple blog application using Node.js',
    }
    res.render('index', locals);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
