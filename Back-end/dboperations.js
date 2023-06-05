const config=require('./dbconfig');
const sql=require('mssql');

async function getOrders(){
    try{
        let pool=await sql.connect(config);
        console.log('connected to database');
        let products=await pool.request().query("SELECT * FROM [Order]");
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function getOrder(orderId){
    try{
        let pool=await sql.connect(config);
        let product=await pool.request()
        .input('input_parameter',sql.Int,orderId)
        .query("SELECT * FROM [Order] where Id=@input_parameter");
        return product.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function addOrder(order){
    try{
        let pool=await sql.connect(config);
        let insertProduct=await pool.request()
        .input('Id',sql.Int,order.Id)
        .input('Title',sql.NChar,order.Title)
        .input('Quantity',sql.Int,order.Quantity)
        .input('Message',sql.NText,order.Message)
        .input('City',sql.NChar,order.City)
        .execute('usp_InsertOrderData');

        // .query("INSERT INTO [Order] (Id,Title,Quantity,Message,City) VALUES (@Id,@Title,@Quantity,@Message,@City)");
        return insertProduct.recordsets;

    }
    catch(error){ console.log(error);    }
}

async function getUserByEmail(email){
    try{
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('email',sql.NVarChar,email)
        .execute('GetUserByEmail');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}
async function addUser(user){
    try{

        let pool=await sql.connect(config);
        console.log(user);
        let data=await pool.request()
        .input('username',sql.NVarChar,user.Username)
        .input('email',sql.NVarChar,user.Email)
        .input('password',sql.NVarChar,user.Password)
        .execute('CreateUser');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}





module.exports={getOrders:getOrders
    ,getOrder:getOrder
    ,addOrder:addOrder
    ,getUserByEmail:getUserByEmail
    ,addUser:addUser};