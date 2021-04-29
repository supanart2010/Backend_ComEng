const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.post('/register', async(req, res) => {
    try {
        //ยังไม่ได้ validate ว่า ช่องที่กรอกแต่ละช่องเป็น email จริงไหม หรือ pass ต้องเกินกี่ตัว
        const { username, password, email } = req.body;
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