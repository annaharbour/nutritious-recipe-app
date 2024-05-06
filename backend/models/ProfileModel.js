const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    bio: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('profile', ProfileSchema);