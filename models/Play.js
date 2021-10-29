const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, maxlength: 50 },
    imageUrl: { type: String, required: true },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, required: true },
    usersLiked: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

module.exports = model('Play', schema);