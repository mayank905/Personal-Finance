const e = require('express');
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

async function updateLoginStatus(email, status){
    try{
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('email',sql.NVarChar,email)
        .input('loggedin',sql.Bit,status)
        .execute('InsertProfile');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function getProfileById(id){
    try{
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('Id',sql.Int,id)
        .execute('GetProfileById');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function addAndDeleteExpense(reqbody){
    try{
        let expense=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        const expenseToAddTable = new sql.Table('ExpenseToAddTable');
        expenseToAddTable.create = true;
        expenseToAddTable.columns.add('Amount', sql.Int, {nullable: false});
        expenseToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        expenseToAddTable.columns.add('Description', sql.NVarChar(50));
        expenseToAddTable.columns.add('Date', sql.Date, {nullable: false});
        const expenseIdsToDeleteTable = new sql.Table('ExpenseIdsToDeleteTable');
        expenseIdsToDeleteTable.create = true;
        expenseIdsToDeleteTable.columns.add('Expense_id', sql.Int);
        for (const row of expense) {
            const amount = parseInt(row[0]);
            const category = row[1];
            const description = row[2];
            const date = new Date(row[3]);
            let expenseId = row[4];
            console.log(amount, category, description, date, expenseId);
            console.log(typeof amount, typeof category, typeof description, typeof date, typeof expenseId);
            if (expenseId.length>0) {
                expenseId=parseInt(expenseId);
                expenseIdsToDeleteTable.rows.add(expenseId);
            }
            else {
                expenseToAddTable.rows.add(amount, category, description, date);
            }
        }
        console.log(expenseToAddTable);
        console.log(expenseIdsToDeleteTable);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .input('expenseToAddTable', expenseToAddTable)
        .input('expenseIdsToDeleteTable', expenseIdsToDeleteTable)
        .execute('AddAndDeleteExpense');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    } finally {
        sql.close();
    }

}
async function getExpense(reqbody){
    try{
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .execute('GetExpense');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function addAndDeleteIncome(reqbody){
    try{
        let income=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        const incomeToAddTable = new sql.Table('IncomeToAddTable');
        incomeToAddTable.create = true;
        incomeToAddTable.columns.add('Amount', sql.Int, {nullable: false});
        incomeToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        incomeToAddTable.columns.add('Description', sql.NVarChar(50));
        incomeToAddTable.columns.add('Date', sql.Date, {nullable: false});
        const incomeIdsToDeleteTable = new sql.Table('IncomeIdsToDeleteTable');
        incomeIdsToDeleteTable.create = true;
        incomeIdsToDeleteTable.columns.add('Income_id', sql.Int);
        for (const row of income) {
            const amount = parseInt(row[0]);
            const category = row[1];
            const description = row[2];
            const date = new Date(row[3]);
            let incomeId = row[4];
            console.log(amount, category, description, date, incomeId);
            console.log(typeof amount, typeof category, typeof description, typeof date, typeof incomeId);
            if (incomeId.length>0) {
                incomeId=parseInt(incomeId);
                incomeIdsToDeleteTable.rows.add(incomeId);
            }
            else {
                incomeToAddTable.rows.add(amount, category, description, date);
            }
        }
        console.log(incomeToAddTable);
        console.log(incomeIdsToDeleteTable);
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .input('incomeToAddTable', incomeToAddTable)
        .input('incomeIdsToDeleteTable', incomeIdsToDeleteTable)
        .execute('AddAndDeleteIncome');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    } finally {
        sql.close();
    }

}
async function getIncome(reqbody){
    try{
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .execute('GetIncome');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function getInformation(reqbody){
    try{
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .execute('GetInformation');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function getGoal(reqbody){
    try{
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');

        }
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .execute('GetGoal');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function addAndDeleteGoal(reqbody){
    try{
        let goal=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        const goalToUpdateTable = new sql.Table('GoalToUpdateTable');
        goalToUpdateTable.create = true;
        const goalToAddTable = new sql.Table('GoalToAddTable');
        goalToAddTable.create = true;
        const goalIdsToDeleteTable = new sql.Table('GoalIdsToDeleteTable');
        goalIdsToDeleteTable.create = true;
        goalToAddTable.columns.add('Lock-priority', sql.Bit, {nullable: false});
        goalToUpdateTable.columns.add('Lock-priority', sql.Bit, {nullable: false});
        goalToAddTable.columns.add('Priority', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Priority', sql.Int, {nullable: false});
        goalToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        goalToUpdateTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        goalToAddTable.columns.add('Target Amount', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Target Amount', sql.Int, {nullable: false});
        goalToAddTable.columns.add('Target Date', sql.Date, {nullable: false});
        goalToUpdateTable.columns.add('Target Date', sql.Date, {nullable: false});
        goalToAddTable.columns.add('Current Saving', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Current Saving', sql.Int, {nullable: false});
        goalToAddTable.columns.add('Status', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Status', sql.Int, {nullable: false});       
        goalIdsToDeleteTable.columns.add('Goal_id', sql.Int);
        goalToUpdateTable.columns.add('Goal_id', sql.Int);
        for (const row of goal) {
            const lock = row[0]=='true'?1:0;
            const priority = parseInt(row[1]);
            const category = row[2];
            const target_amount = parseInt(row[3]);
            const date = new Date(row[4]);
            const current_saving = parseInt(row[5]);
            const status = parseInt(row[6]);
            let goalId = row[7];
            let del = row[8]=='true'?1:0;
            console.log(lock, priority, category, target_amount, date, current_saving, status, goalId);
            if (goalId.length>0 && del==1) {
                goalId=parseInt(goalId);
                goalIdsToDeleteTable.rows.add(goalId);
            }
            else if (goalId.length>0 && del==0) {
                goalId=parseInt(goalId);
                goalToUpdateTable.rows.add(lock, priority, category, target_amount, date, current_saving, status, goalId);
            }
            else {
                goalToAddTable.rows.add(lock, priority, category, target_amount, date, current_saving, status);
            }
        }
        console.log(goalToAddTable);
        console.log(goalIdsToDeleteTable);
        console.log(goalToUpdateTable);
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .input('goalToAddTable', goalToAddTable)
        .input('goalIdsToDeleteTable', goalIdsToDeleteTable)
        .input('goalToUpdateTable', goalToUpdateTable)
        .execute('AddAndDeleteGoal');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    } finally {
        sql.close();
    }

}









module.exports={getOrders:getOrders
    ,getOrder:getOrder
    ,addOrder:addOrder
    ,getUserByEmail:getUserByEmail
    ,addUser:addUser
    ,updateLoginStatus:updateLoginStatus
    ,getProfileById:getProfileById
    ,addAndDeleteExpense:addAndDeleteExpense
    ,getExpense:getExpense
    ,addAndDeleteIncome:addAndDeleteIncome
    ,getIncome:getIncome
    ,getInformation:getInformation
    ,getGoal:getGoal
    ,addAndDeleteGoal:addAndDeleteGoal};