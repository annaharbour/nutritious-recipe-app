const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const checkObjectId = require('../middleware/checkObjectId');

const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');
const Plant = require('../models/PlantModel');

router.get('/', (req, res) => {
    res.send('Plant routes');
});

//Get all plants
router.get('/plants', async (req, res) => {
    try {
        const allPlants = await Plant.find({}).populate('user', ['name']).sort({ date: -1 });
        res.json({plants: allPlants})
    } catch(err) {
        console.error(err.message);
    }
})

//Create cloned plant
router.post('/plant', async (req, res) => {
    try {

    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
