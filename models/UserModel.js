const mongosse = require('mongoose');

const UserSchema = new mongosse.Schema({
    name: {
        String,
        isRequired: true
    },
    email: {
        String,
        isRequired: true
    },
    phone: String,
    password: {
        String,
        isRequired: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongosse.model('User', UserSchema);
