const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User')

// @route   POST api/users
//  @desc   register a user
// @access  public
//express validation takes place
router.post('/', [
    check('name', 'Please add name')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with six or more characters').isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    // res.send('passed');
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists.' })
        }
        //below you can also write name,email,password instead of name:name... only here as schema variables and destructered names are same
        user = new User({
            name: name,
            email: email,
            password: password
        });
        //using brcrypt to hash password before saving to database
        const salt = await bcrypt.genSalt(10);
        //hasing the current password
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // res.send('User Saved');
        //initialising jwt for the user to access routes and calling the restapi to access his stored data from the client side
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

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;