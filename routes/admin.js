const express = require('express');
const router = express.Router();
const POST = require('../models/post');
const USER = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.jwt_Secret;

//CHECK LOGIN
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

//GET ADMIN LOGIN
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index', { locals, layout: adminLayout });
    }
    catch (error) {
        console.log(error);
    }
});

//POST ADMIN REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const user = await USER.create({ username, password: hashPassword });
            res.status(201).json({ message: 'USER CREATED', user });
        }
        catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'USER USED' })
            }
            res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
        }
    }
    catch (error) {
        console.log(error);
    }
});

//POST ADMIN CHECK LOGIN
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await USER.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'INVALID CREDENTIALS' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'INVALID CREDENTIALS' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard')
        
    }
    catch (error) {
        console.log(error);
    }
});

//GET ADMIN DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }
        const data = await POST.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }

});


//POST ADMIN NEW POST
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new POST({
                title: req.body.title,
                body: req.body.body
            });

            await POST.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});


//GET ADMIN CREATE NEW POST
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});


//GET EDIT POST
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const data = await POST.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }
});


//PUT EDIT POST
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await POST.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/dashboard`);

    } catch (error) {
        console.log(error);
    }

});

//DELETE POST
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await POST.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});


//ADMIN LOGOUT
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
});
module.exports = router;