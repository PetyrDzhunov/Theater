const playService = require('../services/playService');

module.exports = (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
        ...playService
    };

};