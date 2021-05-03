const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.post('/register', async(req, res) => {

    //ยังไม่ได้ validate ว่า ช่องที่กรอกแต่ละช่องเป็น email จริงไหม หรือ pass ต้องเกินกี่ตัว
    const { username, email } = req.body;
    try {
        let haveUsername = await User.findOne({ username });
        if (haveUsername) {
            console.log('username already exists');
            return res.redirect('/register');
        }
        const passwordHash = bcrypt.hashSync(password, 10);
        user = new User({
            username,
            password: passwordHash
        });

        await user.save();
        console.log(user);
        console.log('save to db');
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        })
    } catch (error) {
        console.log('have error');
        res.redirect('/');
    }
});
router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/addtopic',
    })
    // async(req, res) => {
    //     const { username, password } = req.body;
    //     console.log('login2');
    //     return res.redirect('/');
    // }
);


module.exports = router;