const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec((err, user) => {
        if(err) {
            return res.status(400).json({
                error: "This user doesn't exists."
            })
        }
        if(user.password !== password) {
            return res.status(400).json({
                error: "Email or Password incorrect"
            })
        }

        const token = jwt.sign(
            {_id: user._id}, 
            process.env.JWT_SIGNIN_KEY, 
            {expiresIn: '1h'}
        );
        const {_id, name, email} = user;

        res.json({
            token,
            user: {_id, name, email}
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;