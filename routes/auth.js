const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.post('/register', async(req, res) => {
    try {
        const { username, password, email } = req.body;
        // simple validation
        if (!email || !username || !password) {
            return res.render('register', { message: 'Please try again' });
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        user = new User({
            username,
            email,
            password: passwordHash
        });

        await user.save();
        console.log('save data');
        res.render('index', { user });
    } catch (error) {
        console.log(error);
    }
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/'
    }),
    async(req, res) => {
        const { username, password } = req.body;

        return res.redirect('/');
    }
);

module.exports = router;