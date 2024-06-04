const express = require('express');
const router = express.Router();
const POST= require('../models/post')

//GET HOME
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        let perPage = 10;
        let page = req.query.page || 1;
        const data = await POST.aggregate([{ $sort: { createdAt: -1} }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        
            const count = await POST.countDocuments({});
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);
        
            res.render('index', { 
                locals,
                data,
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: '/'
            });
        
    }
    catch (error) {
        console.log(error);
    }
});  

//GET POST
router.get('/post/:id', async (req, res) => {
    try {
        let ID = req.params.id;
        const data = await POST.findById({ _id: ID });
        
    
        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${ID}`
        })
    }
        
    catch (error) {
        console.log(error);
    }
});

//POST SEARCH
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await POST.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });
        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });
    }
    catch (error) {
        console.log(error);
    }
});


//GET ABOUT
router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});


//GET CONTACT
router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
});


module.exports = router;