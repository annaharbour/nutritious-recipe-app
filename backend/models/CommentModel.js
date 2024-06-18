const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const CommentModel = new mongoose.Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'recipes',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    userName: {
        type: String,
    },
    text: {
        type: String,
        required: true
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    responses: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model('comment', CommentModel);

