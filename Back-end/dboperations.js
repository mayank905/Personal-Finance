// Purpose: To handle all the database operations
const config=require('./dbconfig');
const sql=require('mssql');


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

async function addUpdateAndDeleteExpense(reqbody){
    try{
        let expense=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        const expenseToAddTable = new sql.Table('ExpenseToAddTable');
        expenseToAddTable.create = true;
        const expenseIdsToDeleteTable = new sql.Table('ExpenseIdsToDeleteTable');
        expenseIdsToDeleteTable.create = true;
        const expenseToUpdateTable = new sql.Table('ExpenseToUpdateTable');
        expenseToUpdateTable.create = true;
        expenseToAddTable.columns.add('Amount', sql.Int, {nullable: false});
        expenseToUpdateTable.columns.add('Amount', sql.Int, {nullable: false});
        expenseToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        expenseToUpdateTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        expenseToAddTable.columns.add('Description', sql.NVarChar(50));
        expenseToUpdateTable.columns.add('Description', sql.NVarChar(50));
        expenseToAddTable.columns.add('Date', sql.Date, {nullable: false});
        expenseToUpdateTable.columns.add('Date', sql.Date, {nullable: false});
        expenseIdsToDeleteTable.columns.add('Expense_id', sql.Int);
        expenseToUpdateTable.columns.add('Expense_id', sql.Int);
        for (const row of expense) {
            const amount = parseInt(row[0]);
            const category = row[1];
            const description = row[2];
            const date = new Date(row[3]);
            let expenseId = row[4];
            let del = row[5]=='true'?1:0;
            let edit=row[6]=='true'?1:0;
            console.log(amount, category, description, date, expenseId);
            console.log(typeof amount, typeof category, typeof description, typeof date, typeof expenseId);
            if (expenseId.length>0 && del==1) {
                expenseId=parseInt(expenseId);
                expenseIdsToDeleteTable.rows.add(expenseId);
            }
            else if (expenseId.length>0 && edit==1) {
                expenseId=parseInt(expenseId);
                expenseToUpdateTable.rows.add(amount, category, description, date, expenseId);
            }
            else {
                expenseToAddTable.rows.add(amount, category, description, date);
            }
        }
        console.log(expenseToAddTable);
        console.log(expenseIdsToDeleteTable);
        console.log(expenseToUpdateTable);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .input('expenseToAddTable', expenseToAddTable)
        .input('expenseIdsToDeleteTable', expenseIdsToDeleteTable)
        .input('expenseToUpdateTable', expenseToUpdateTable)
        .execute('AddUpdateAndDeleteExpense');
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

async function addUpdateAndDeleteIncome(reqbody){
    try{
        let income=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        const incomeToAddTable = new sql.Table('IncomeToAddTable');
        incomeToAddTable.create = true;
        const incomeToUpdateTable = new sql.Table('IncomeToUpdateTable');
        incomeToUpdateTable.create = true;
        const incomeIdsToDeleteTable = new sql.Table('IncomeIdsToDeleteTable');
        incomeIdsToDeleteTable.create = true;
        incomeToAddTable.columns.add('Amount', sql.Int, {nullable: false});
        incomeToUpdateTable.columns.add('Amount', sql.Int, {nullable: false});
        incomeToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        incomeToUpdateTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        incomeToAddTable.columns.add('Description', sql.NVarChar(50));
        incomeToUpdateTable.columns.add('Description', sql.NVarChar(50));
        incomeToAddTable.columns.add('Date', sql.Date, {nullable: false});
        incomeToUpdateTable.columns.add('Date', sql.Date, {nullable: false});
        incomeIdsToDeleteTable.columns.add('Income_id', sql.Int);
        incomeToUpdateTable.columns.add('Income_id', sql.Int);
        for (const row of income) {
            const amount = parseInt(row[0]);
            const category = row[1];
            const description = row[2];
            const date = new Date(row[3]);
            let incomeId = row[4];
            let del = row[5]=='true'?1:0;
            let edit=row[6]=='true'?1:0;
            console.log(amount, category, description, date, incomeId);
            console.log(typeof amount, typeof category, typeof description, typeof date, typeof incomeId);
            if (incomeId.length>0 && del==1) {
                incomeId=parseInt(incomeId);
                incomeIdsToDeleteTable.rows.add(incomeId);
            }
            else if (incomeId.length>0 && edit==1) {
                incomeId=parseInt(incomeId);
                incomeToUpdateTable.rows.add(amount, category, description, date, incomeId);
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
        .input('incomeToUpdateTable', incomeToUpdateTable)
        .execute('AddUpdateAndDeleteIncome');
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

async function addUpdateAndDeleteGoal(reqbody){
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
        goalToAddTable.columns.add('Lock_priority', sql.Bit, {nullable: false});
        goalToUpdateTable.columns.add('Lock_priority', sql.Bit, {nullable: false});
        goalToAddTable.columns.add('Priority', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Priority', sql.Int, {nullable: false});
        goalToAddTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        goalToUpdateTable.columns.add('Category', sql.NVarChar(50), {nullable: false});
        goalToAddTable.columns.add('Target_Amount', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Target_Amount', sql.Int, {nullable: false});
        goalToAddTable.columns.add('Target_Date', sql.Date, {nullable: false});
        goalToUpdateTable.columns.add('Target_Date', sql.Date, {nullable: false});
        goalToAddTable.columns.add('Current_Saving', sql.Int, {nullable: false});
        goalToUpdateTable.columns.add('Current_Saving', sql.Int, {nullable: false});
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
            let edit=row[9]=='true'?1:0;
            console.log(lock, priority, category, target_amount, date, current_saving, status, goalId);
            if (goalId.length>0 && del==1) {
                goalId=parseInt(goalId);
                goalIdsToDeleteTable.rows.add(goalId);
            }
            else if (goalId.length>0 && edit==1) {
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
        .execute('AddUpdateAndDeleteGoal');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    } finally {
        sql.close();
    }

}

async function getBudget(reqbody){
    try{
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .execute('GetBudget');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

async function updateBudget(reqbody){
    try{
        let budget=reqbody.finalData;
        let profile_id=reqbody.profile_id;
        if (profile_id==undefined) {
            throw new Error('profile_id is undefined');
        }
        const budgetToUpdateTable = new sql.Table('BudgetToUpdateTable');
        budgetToUpdateTable.create = true;

        budgetToUpdateTable.columns.add('Lock_priority', sql.Bit, {nullable: false});
        budgetToUpdateTable.columns.add('Priority', sql.Int, {nullable: false});
        budgetToUpdateTable.columns.add('Budget_id', sql.Int, {nullable: false});
        for (const row of budget) {
            console.log('budget row '+row);
            const lock = row[0]=='true'?1:0;
            const priority = parseInt(row[1]);
            let budgetId = row[5];
            let edit=row[6]=='true'?1:0;
            console.log( priority, lock, budgetId);
            if (budgetId.length>0 && edit==1) {
                budgetId=parseInt(budgetId);
                budgetToUpdateTable.rows.add(lock,priority,budgetId);
            }
        }
        console.log(budgetToUpdateTable);
        let pool=await sql.connect(config);
        let data=await pool.request()
        .input('profileId',sql.INT,profile_id)
        .input('budgetToUpdateTable', budgetToUpdateTable)
        .execute('UpdateBudget');
        return data.recordsets;
    }
    catch(error){
        console.log(error);
    } finally {
        sql.close();
    }

}










module.exports={
     getUserByEmail:getUserByEmail
    ,addUser:addUser
    ,updateLoginStatus:updateLoginStatus
    ,getProfileById:getProfileById
    ,addUpdateAndDeleteExpense:addUpdateAndDeleteExpense
    ,getExpense:getExpense
    ,addUpdateAndDeleteIncome:addUpdateAndDeleteIncome
    ,getIncome:getIncome
    ,getInformation:getInformation
    ,getGoal:getGoal
    ,addUpdateAndDeleteGoal:addUpdateAndDeleteGoal
    ,getBudget:getBudget
    ,updateBudget:updateBudget};