const authController = require('../controllers/authController');
const playController = require('../controllers/playController');
module.exports = (app) => {
    app.use('/auth', authController);
    app.use('/play', playController);
};