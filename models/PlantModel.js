const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    scrapsType: {type: String, required: true}, //Type of plant scraps (e.g. veg, fruit, herb)
    scrapsImage: {type: String, required: true}, //URL or path to image of scraps
    scrapsType: {type: mongoose.Schema.Types.ObjectId, ref: 'Scrap', required: true}, //Type of plant
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('plant', PlantSchema);