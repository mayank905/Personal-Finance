const express=require('express');
const router=express.Router();
const dboperations=require('../dboperations');
const loggedin=require('../controller/loggedin');

router.use((request,response,next)=>{
    console.log('api middleware');
    loggedin.apiloggedin(request,response);
    next();
});

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