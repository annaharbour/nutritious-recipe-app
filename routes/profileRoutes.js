const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');

//Get /profile/me
//@desc Get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        // const plants = await Plant.find({ user: req.user.id } ??? Get plants for this user so we can display to the dashboard

        res.json(profile);
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route POST /profile/me
//@desc Create or update user profile
//@access Private
router.post('/',
    auth,
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
        }
     const {
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;
    //build a profile object
    const profileFields = {
        user: req.user.id,
        ...rest
    };
    try {
        //Using upsert option (creates new doc if no match is found)
        let profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true, upsert: true, setDefaultsOnInsert: true}
        );
        console.log(profile)
        return res.json(profile);
    } catch(err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

//@route GET api/profile/user/:user_id
//@desc Get profile by user id
//@access Public
router.get('/user/:user_id', async ( {params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({user: user_id}).populate('user', ['name']);
      if(!profile){
        return res.status(400).json({ msg: 'Profile not found'});
      }
    //   const assignments = await Assignment.find({assignedTo: {$in: [req.params.user_id]}});
    //   res.json({profile, assignments});
         return res.json(profile);
    } catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        return res.status(500).send('Server error');
    }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
      // Remove user posts
      // Remove profile
      // Remove user
      await Promise.all([
        Post.deleteMany({ user: req.user.id }),
        Profile.findOneAndRemove({ user: req.user.id }),
        User.findOneAndRemove({ _id: req.user.id })
      ]);
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;