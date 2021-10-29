const router = require('express').Router();

router.get('/create', (req, res) => {
    res.render('play/create')
});


module.exports = router;