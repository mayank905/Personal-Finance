const brcypt = require('bcryptjs');

const dboperations = require('../dboperations');

const register = async (request, response) => {
    try {
        if(!request.body.Email || !request.body.Password){
            return response.status(400).json({
                message: 'Email and Password are required'
            });}
        let user = { ...request.body};
        dboperations.getUserByEmail(user.Email).then(async result => {
            if(!result){
                return response.status(400).json({
                    message: 'not able to access database'
                });
            }
            if(result[0].length > 0){
                return response.status(400).json({
                    message: 'Email already exists'
                });
            }
            let hash = await brcypt.hash(user.Password, 10);
            user.Password = hash;
            dboperations.addUser(user).then(result => {
                if(!result){
                    return response.status(400).json({
                        message: 'no able to register user'
                    });
                }
                response.status(201).json({
                    status: 'success',
                    message: 'Successfully registered'
                });
            });
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            error: error.code
        });
    }
}

module.exports = register;