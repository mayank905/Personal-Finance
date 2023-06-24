const dboperations = require('../dboperations');

const setBudget = async (request, response) => {
    console.log('budget started');
    try {
        if (!request.body.finalData) {
            return response.status(400).json({
                message: 'Budget is required'
            });
        }
        let data=request.body;
        dboperations.updateBudget(data).then(result => {
            if (!result) {
                console.log('Budget not saved');
                return response.status(400).json({
                    message: 'Budget not saved'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during budget process');
        return response.status(400).json({
            message: 'Something went wrong during budget process' + error
        });
    }
}

const getBudget = async (request, response) => {
    console.log('get budget started');
    try {
        dboperations.getBudget(request.body).then(result => {
            if (!result) {
                console.log('Budget not fetched');
                return response.status(400).json({
                    message: 'Budget not fetched'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during get budget process');
        return response.status(400).json({
            message: 'Something went wrong during get budget process' + error
        });
    }
}

module.exports = {setBudget: setBudget
                , getBudget: getBudget};
                