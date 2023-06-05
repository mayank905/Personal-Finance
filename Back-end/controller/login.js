// This file contains the logic for the login route
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dboperations = require('../dboperations');

const login = async (request, response) => {
    console.log('login started');
    try {
        if(!request.body.Email || !request.body.Password){
            return response.status(400).json({
                message: 'Email and Password are required'
            });}
        let user = { ...request.body};

        dboperations.getUserByEmail(user.Email).then(async result => {
            if(result[0].length === 0){
                return response.status(400).json({
                    message: 'Email or Password is incorrect'
                });
            }
            let dbresult = result[0][0];
            let hash = result[0][0].password;
            await brcypt.compare(user.Password, hash).then((result) => {
                if(!result){
                    return response.status(400).json({
                        message: 'Password or Email is incorrect'
                    });
                }
                let token = jwt.sign({Email: user.Email}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXPIRATION});
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                    sameSite: 'None', secure: true 
                };
                response.cookie('jwt', token, cookieOptions);

                return response.status(201).json({
                    status: 'success',
                    result: dbresult,
                    message: 'Login successful'
                });
            });
        });
    } catch (error) {
        return response.status(400).json({
            message: 'Something went wrong during login process'+error
        });
    }
};

module.exports = login;