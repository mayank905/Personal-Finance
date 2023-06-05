require('dotenv').config();
const config={
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    server:process.env.DATABASE_SERVER,
    database:process.env.DATABASE,
    options:{
        trustedconnection:true,
        enableArithAbort:true,
        instancename:process.env.DATABASE_INSTANCE,
        encrypt:false
    },
    port:parseInt(process.env.DATABASE_PORT)
}
module.exports=config;



