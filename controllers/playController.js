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

router.get('/details/:id', isUser(), async(req, res) => {
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

router.get('/edit/:id', isUser(), async(req, res) => {
    const id = req.params.id;
    try {
        const play = await req.storage.getPlayById(id);

        if (play.author != req.user._id) {
            throw new Error('Cannot edit play you havn\'t created');
        };

        res.render('play/edit', { play });
    } catch (error) {
        console.log(error.message);
        res.redirect(`/play/details/${id}`);
    };
});

router.post('/edit/:id', isUser(), async(req, res) => {
    const id = req.params.id;
    try {
        const play = await req.storage.getPlayById(id);
        if (play.author != req.user._id) {
            throw new Error('Cannot edit play you havn\'t created');
        };

        await req.storage.editPlay(id, req.body);
        res.redirect('/');
    } catch (error) {
        const ctx = {
            errors: parseError(error),
            play: {
                _id: id,
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public)
            }
        };
        res.render('play/edit/', ctx);
    }
});

router.get('/delete/:id', async(req, res) => {
    let id = req.params.id;
    try {
        const play = await req.storage.getPlayById(id);

        if (play.author != req.user._id) {
            throw new Error('Cannot delete play you havn\'t created');
        };
        await req.storage.deletePlay(id);
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        res.redirect(`/play/details/${id}`);
    };
});



module.exports = router;