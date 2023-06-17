const dboperations = require('../dboperations');

const setExpense = async (request, response) => {
    console.log('expense started');
    try {
        if (!request.body.finalData) {
            return response.status(400).json({
                message: 'Expense is required'
            });
        }
        let data=request.body;
        dboperations.addAndDeleteExpense(data).then(result => {
            if (!result) {
                console.log('Expense not saved');
                return response.status(400).json({
                    message: 'Expense not saved'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during expense process');
        return response.status(400).json({
            message: 'Something went wrong during expense process' + error
        });
    }
}
const getExpense = async (request, response) => {
    console.log('get expense started');
    try {
        dboperations.getExpense(request.body).then(result => {
            if (!result) {
                console.log('Expense not fetched');
                return response.status(400).json({
                    message: 'Expense not fetched'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during get expense process');
        return response.status(400).json({
            message: 'Something went wrong during get expense process' + error
        });
    }
}


module.exports = {setExpense: setExpense
                , getExpense: getExpense};