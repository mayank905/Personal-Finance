const dboperations = require('../dboperations');

const setIncome = async (request, response) => {
    console.log('Income started');
    console.log(request.body);
    try {
        if (!request.body.finalData) {
            return response.status(400).json({
                message: 'Income is required'
            });
        }
        let data=request.body;
        dboperations.addAndDeleteIncome(data).then(result => {
            if (!result) {
                console.log('Income not saved');
                return response.status(400).json({
                    message: 'Income not saved'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during Income process');
        return response.status(400).json({
            message: 'Something went wrong during Income process' + error
        });
    }
}
const getIncome = async (request, response) => {
    console.log('get Income started');
    try {
        dboperations.getIncome(request.body).then(result => {
            if (!result) {
                console.log('Income not fetched');
                return response.status(400).json({
                    message: 'Income not fetched'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during get Income process');
        return response.status(400).json({
            message: 'Something went wrong during get Income process' + error
        });
    }
}


module.exports = {setIncome: setIncome
                , getIncome: getIncome};