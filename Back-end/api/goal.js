const dboperations = require('../dboperations');

const setGoal = async (request, response) => {
    console.log('Goal started');
    console.log(request.body);
    try {
        if (!request.body.finalData) {
            return response.status(400).json({
                message: 'Goal is required'
            });
        }
        let data=request.body;
        dboperations.addAndDeleteGoal(data).then(result => {
            if (!result) {
                console.log('Goal not saved');
                return response.status(400).json({
                    message: 'Goal not saved'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during Goal process');
        return response.status(400).json({
            message: 'Something went wrong during Goal process' + error
        });
    }
}

const getGoal = async (request, response) => {
    console.log('Goal started');
    console.log(request.body);
    try {
        if (!request.body.profile_id) {
            return response.status(400).json({
                message: 'profile_id is required'
            });
        }
        let data=request.body;
        dboperations.getGoal(data).then(result => {
            if (!result) {
                console.log('Goal not fetched');
                return response.status(400).json({
                    message: 'Goal not fetched'
                });
            }
            response.status(201).json(result[0]);
        })
    } catch (error) {
        console.log('Something went wrong during Goal process');
        return response.status(400).json({
            message: 'Something went wrong during Goal process' + error
        });
    }
}

module.exports = {
    setGoal: setGoal,
    getGoal: getGoal    
}