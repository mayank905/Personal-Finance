const dboperations = require('../dboperations');

const getInformation = async (request, response) => {
    console.log('get Information started');
    try {
        dboperations.getInformation(request.body).then(result => {
            if (!result) {
                console.log('Information not fetched');
                return response.status(400).json({
                    message: 'Information not fetched'
                });
            }
            response.status(201).json(result);
        })
    } catch (error) {
        console.log('Something went wrong during get Information process');
        return response.status(400).json({
            message: 'Something went wrong during get Information process' + error
        });
    }
}

module.exports = {getInformation: getInformation};