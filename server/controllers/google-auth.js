const User = require('../models/User');

const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const _ = require('lodash');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client("328323452877-89c22rms5122d9keh95lifr1ori2efuh.apps.googleusercontent.com");


exports.googleLogin = (req, res, ) => {
    const {tokenId, time} = req.body;

    client.verifyIdToken({
        idToken: tokenId, 
        audience: "328323452877-89c22rms5122d9keh95lifr1ori2efuh.apps.googleusercontent.com"
    })
        .then(response => {
            const {email_verified, name, email} = response.payload;
            console.log(response.payload);
            if (email_verified) {
                User.findOne({email})
                    .exec((err, user) => {
                    if(err) {
                        return res.status(400).json({
                            error: "something went wrong..."
                        })
                    } else {
                        if(user) {
                            const token = jwt.sign(
                                {_id: user._id}, 
                                process.env.JWT_SIGNIN_KEY, 
                                {expiresIn: '1h'}
                            );
                            const {_id, name, email} = user;
                            res.json({
                                token,
                                user: {_id, name, email}
                            });
                        } else {
                            let password = email+process.env.JWT_SIGNIN_KEY;
                            let newUser = new User({name, email, password});
                            newUser.save((err, data) => {
                                if(err) {
                                    return res.status(400).json({
                                        error: "Something went wrong..."
                                    })
                                }
                                const token = jwt.sign({_id: data._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '1h'});
                                const {_id, name, email} = newUser;
                                res.json({
                                    token,
                                    user: {id, name, email}
                                })
                            })
                        }
                    }
                })
            }
        })
    console.log()
}

