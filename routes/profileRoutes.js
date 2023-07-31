const express = require('express');
const router = express.Router();

//Get /profile
//@desc
//@access Public
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;