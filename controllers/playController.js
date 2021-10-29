const router = require('express').Router();

const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');



router.get('/create', isUser(), (req, res) => {
    res.render('play/create')
});

router.post('/create', isUser(), async(req, res) => {
    try {
        console.log(req.body);
        const playData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),
            author: req.user._id
        }
        await req.storage.createPlay(playData)
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        const ctx = {
            errors: parseError(err),
            playData: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public),
            },
        };
        res.render('play/create', ctx);
    }
});

module.exports = router;