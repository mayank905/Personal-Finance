const express=require('express');
const router=express.Router();
const register=require('../controller/register');
const login=require('../controller/login');
const loggedin=require('../controller/loggedin');

router.use((request,response,next)=>{
    console.log('middleware started');
    loggedin.loggedin(request,response,next);
});

router.route('/login').post(login);
router.route('/register').post(register);

module.exports=router;