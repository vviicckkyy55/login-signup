const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

router.post('/', (req, res, next) => {
    console.log(req.body);

    User.find({ email: req.body.email })
        .exec((err, user) => {
            if(user) {
                return res.status(400).json({
                    error: "User with this email already exists."
                });   

            } else {

                const token = jwt.sign({_id, name, email, password},
                            process.env.JWT_SIGNIN_KEY,
                            {expiresIn: '1h'});

                let newUser = new User({
                    _id: new mongoose.Types.ObjectId(), 
                    name, 
                    email, 
                    password,
                });
                newUser.save((err, success) => {
                    if(err) {
                        console.log("Error in signup: ", err);
                        return res.status(400).json({error: err})
                    }
                    res.status(201).json({
                        newUser, token,
                        message: "Signup success!"
                    });
                });

            }
    })
    .catch(err => {
        console.log(err);
        res.status(422).json({
            error: err
        });
    });
});

module.exports =  router;