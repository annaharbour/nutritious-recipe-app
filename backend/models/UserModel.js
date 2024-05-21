const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
    }],
    favoriteRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);
