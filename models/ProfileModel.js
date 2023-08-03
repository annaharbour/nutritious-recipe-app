const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bio: {
        type: String
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plant'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('profile', ProfileSchema);