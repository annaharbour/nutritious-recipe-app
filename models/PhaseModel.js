const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  regrowthImage: {type: String, required: true}, //URL or path to image of regrowth process
  durationInDays: { type: Number, required: true }, // Duration of the phase in days
  isCompleted: { type: Boolean, default: false }, // Whether the phase is completed by the user
  isExtended: { type: Boolean, default: false }, // Whether the user has extended this phase
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true }, // Reference to the plant associated with this phase
  createdAt: { type: Date, default: Date.now },
});

const Phase = mongoose.model('phase', phaseSchema);

module.exports = Phase;
