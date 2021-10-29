const Play = require('../models/Play');

async function getAllPlays() {
    return Play.find({ public: true }).sort({ createdAt: -1 }).lean();
};

async function getPlayById(id) {

};


async function createPlay(playData) {
    const pattern = new Regexp(`^${playData.title}$`, 'i')
    const existing = await Play.find({ title: { $regex: pattern } });
    if (existing) {
        throw new Error('A play with this name already exists');
    };

    const play = new Play(playData);
    await play.save();
    return play;
};

async function editPlay(id, playData) {

};

async function deletePlay(id) {

};

module.exports = {
    getAllPlays,
    getPlayById,
    createPlay,
    editPlay,
    deletePlay
};