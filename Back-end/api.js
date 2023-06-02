
var Order = require('./order');
const dboperations=require('./dboperations');
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const router=express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router);

var port=process.env.PORT || 8090;
app.listen(port);
console.log('Order API is running at ' + port);


router.use((request,response,next)=>{
    console.log('middleware');
    next();
}
);

router.route('/orders').get((request,response)=>{
    dboperations.getOrders().then(result => {
        response.json(result[0]);
    })
}
);

router.route('/orders/:id').get((request,response)=>{
    dboperations.getOrder(request.params.id).then(result => {
        response.json(result[0]);
    })
}
);

router.route('/orders').post((request,response)=>{

    let order={...request.body}

    dboperations.addOrder(order).then(result => {
        response.status(201).json(result[0]);
    })
}
);

