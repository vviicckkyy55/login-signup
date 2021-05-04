const User = require('../models/User');

const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const _ = require('lodash');

const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox38376fb93df04d909d0c951ae11047ad.mailgun.org';
const MAILGUN_APIKEY = '1ddc68d151f6aba47238ff99b87882d5-4b1aa784-24b52c01';
const mg = mailgun({
    apiKey: MAILGUN_APIKEY, 
    domain: DOMAIN
});

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client("328323452877-89c22rms5122d9keh95lifr1ori2efuh.apps.googleusercontent.com");


 //signup without activation
 exports.signup = (req, res) => {
    console.log(req.body);
    const {_id, name, email, password} = req.body;
    User.findOne({email})
        .exec((err, user) => {
            if(user) {
                return res.status(400).json({
                    error: "User with this email already exists."
                });
            } else {
                // Generate new User
                const token = jwt.sign({_id, name, email, password},
                    process.env.JWT_SIGNIN_KEY,
                    {expiresIn: '1h'});
                let newUser = new User({
                    _id: new mongoose.Types.ObjectId(), 
                    name: req.body.name, 
                    email: req.body.email, 
                    password: req.body.password
                });
                newUser.save((err, success) => {
                    if(err) {
                        console.log("Error in signup: ", err);
                        return res.status(400).json({error: err})
                    }
                    res.status(201).json({
                        message: "Signup success!",
                        token
                    });
                });        
            }
        })
}



exports.signin = (req, res) => {
    const {_id, email, password} = req.body;
    User.findOne({email})
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
}


exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if( err || !user) {
            return res.status(400).json({error: "User with this email dosen't exists"})
        }
        const token = jwt.sign({_id: user._id},
            process.env.RESET_PASSWORD_KEY,
             {expiresIn: '1h'});

        const data = {
            from: 'noreply@hello.com',
            to: email,
            subject: 'Account Activation Link',
            html: `
                <h2>Please click on the link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset/password/${token}</p>
            `
        };

        return user.updateOne(
            {resetLink: token}, function(err, success) {
                if (err) {
                    return req.status(400).json({error: "reset password link error"});
                } else {
                    mg.messages().send(data, function (error, body) {
                        if(error) {
                            return res.json({
                                error: err.message
                            })
                        }
                        console.log(body);
                        return res.json({
                            message: 'Email has been sent, kindly follow the instruction',
                            token
                        });
                        
                    });
                }
            })
    })
}

exports.resetPassword = (req, res) => {
    const {resetLink, newPass} = req.body;
    if(resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function(error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired."
                })
            }
            User.findOne({resetLink}, (err, user) => {
                if(err || !user) {
                    return res.status(400).json({error: "User with this token doesn't exist..."});
                }
                const obj = {
                    password: newPass
                }

                user = _.extend(user, obj);
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({error: "reset password error"});
                    } else {
                        return res.json({message: "Your Password has been changed"});
                    }
                })


            })
        })  
    } else {
        return res.status(401).json({error: "Authentication error!!!"});
    }
}




// //signup with activation
// exports.signup = (req, res) => {
//     console.log(req.body);
//     const {_id, name, email, password} = req.body;
//     User.findOne({email})
//         .exec((err, user) => {
//             if(user) {
//                 return res.status(400).json({
//                     error: "User with this email already exists."
//                 });   

//             } else {

//                 const token = jwt.sign({_id, name, email, password},
//                             process.env.JWT_ACC_ACTIVATE,
//                             {expiresIn: '1h'});

//                 const data = {
//                     from: 'noreply@hello.com',
//                     to: email,
//                     subject: 'Account Activation Link',
//                     html: `
//                         <h2>Please click on the link to activate your account</h2>
//                         <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
//                     `
//                 };
//                 mg.messages().send(data, function (error, body) {
//                     if(error) {
//                         return res.json({
//                             error: err.message
//                         })
//                     }
//                     console.log(body);
//                     return res.json({
//                         message: 'Email has been sent, kindly activate your account',
//                         token
//                     });
                    
//                 });

//         }
//     })
// }


// exports.activateAccount = (req, res) => {
//     const {token} = req.body;
//     if(token) {
//         jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err, decodedToken) {
//             if(err) {
//                 return res.status(400).json({error: 'Incorrect or Expired link.'})
//             }
//             const {_id, name, email, password} = decodedToken;
//             User.findOne({email})
//                 .exec((err, user) => {
//                     if(user) {
//                         return res.status(400).json({error: "User with this email already exists."});
//                     }
//                         // Generate new User
//                     let newUser = new User({
//                         _id: new mongoose.Types.ObjectId(),
//                         name, email, 
//                         password
//                     });
//                     newUser.save((err, success) => {
//                         if(err) {
//                             console.log("Error in signup while account activation: ", err);
//                             return res.status(400).json({error: 'Error in activating account'})
//                         }
//                     res.status(201).json({message: "Signup success!"});     
//                     });
//                 })
//             });
        
//     } else {
//         return res.json({
//             error: "Something went wrong"
//         })
//     }
// }



