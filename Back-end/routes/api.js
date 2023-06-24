const express=require('express');
const router=express.Router();
const dboperations=require('../dboperations');
const loggedin=require('../controller/loggedin');
const logout=require('../api/logout');
const expense=require('../api/expense');
const income=require('../api/income');
const information=require('../api/information');
const goal=require('../api/goal');
const budget=require('../api/budget');

router.use((request,response,next)=>{
    console.log('api middleware');
    loggedin.apiloggedin(request,response,next);
});

// router.route('/logout').post(logout);
 router.route('/expense').post(expense.setExpense)
 .get(expense.getExpense);

 router.route('/income').post(income.setIncome)
 .get(income.getIncome);

 router.route('/goal').post(goal.setGoal)
 .get(goal.getGoal);

 router.route('/budget').post(budget.setBudget)
 .get(budget.getBudget);

 router.route('/information').get(information.getInformation);

router.route('/orders').get((request,response)=>{
    dboperations.getOrders().then(result => {
        if(!result){
            return response.status(400).json({
                message: 'no order fetched'
            });
        }
        return response.json(result[0]);
    })
}
).post((request,response)=>{

    let order={...request.body}

    dboperations.addOrder(order).then(result => {
        if(!result){
            return response.status(400).json({
                message: 'order not saved'
            });
        }
        response.status(201).json(result[0]);
    })
}
);

router.route('/orders/:id').get((request,response)=>{
    dboperations.getOrder(request.params.id).then(result => {
        if(!result){
            return response.status(400).json({
                message: 'order not found'
            });
        }
        response.json(result[0]);
    })
}
);

module.exports=router;