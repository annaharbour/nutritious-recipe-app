const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // You can add other fields relevant to scraps, such as images, characteristics, etc.
});

const Scrap = mongoose.model('scrap', scrapSchema);

module.exports = Scrap;
