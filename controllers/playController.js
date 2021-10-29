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

router.get('/details/:id', async(req, res) => {
    try {
        const id = req.params.id;

        const play = await req.storage.getPlayById(id);
        play.hasUser = Boolean(req.user);
        play.isAuthor = req.user && req.user._id == play.author;
        play.liked = req.user && play.usersLiked.includes(req.user._id);
        console.log(play);
        res.render('play/details', { play });
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    };
});

router.get('/delete/:id', async(req, res) => {
    let id = req.params.id;
    try {
        await req.storage.deletePlay(id);
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        res.redirect(`/play/details/${id}`);
    };
});

module.exports = router;