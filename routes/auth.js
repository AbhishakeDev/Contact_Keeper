const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { findById } = require('../models/User');


// @route   GET api/auth
//  @desc   get logged in user
// @access  private
router.get('/', auth, async (req, res) => {
    // res.send('Get logged in user');
    try {
        //we are removing the password from the get object of user so that it is not returned
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "server error" });
    }
});


// @route   POST api/auth
//  @desc   Auth user and get token
// @access  public
//again while logging in we post email and password so again validation for email and password
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const { email, password } = req.body;
    //User is schema and the user is the one logging in 
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return status(400).json({ msg: "Invalid Credentials" });
        }
        //if user exists then we will check the password
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) {
                    throw err;
                } else {
                    res.json({ token });
                }
            })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;