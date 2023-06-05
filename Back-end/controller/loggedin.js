const jwt=require('jsonwebtoken');
const dboperations=require('../dboperations');

const loggedin=async (request,response,next)=>{
    try {
        if(!request.cookies && !request.cookies.jwt){
            console.log('no cookie');
            next() ;
        }     
        const decoded=await jwt.verify(request.cookies.jwt,process.env.SECRET_KEY);
        console.log(decoded);
        dboperations.getUserByEmail(decoded.Email).then(result=>{
            if(result[0].length===0){
                return response.status(401).json({
                    message: 'Unauthorized'
                });
            }
            return response.status(201).json({
                message: 'Authorized',
                result:result[0]
            });
        });
    } catch (error) {
        console.log(error);
        next() ;
    }
}

const apiloggedin=async (request,response)=>{
    try {
        if(!request.cookies.jwt){
            return response.status(401).json({
                message: 'Unauthorized'
                });
        }     
        const decoded=await jwt.verify(request.cookies.jwt,process.env.SECRET_KEY);
        dboperations.getUserByEmail(decoded.Email).then(result=>{
            if(result[0].length===0){
                return response.status(401).json({
                    message: 'Unauthorized'
                });
            }
            next()
        });
    } catch (error) {
        console.log(error);
        return response.status(401).json({
            error: error.code,
            message: 'Unauthorized'
            });
    }
}

module.exports={loggedin:loggedin,
                apiloggedin:apiloggedin};