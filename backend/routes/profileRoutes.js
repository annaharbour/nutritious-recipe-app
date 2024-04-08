const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, createOrUpdateProfile } = require("../controllers/profileController");

//@route GET /profile/:id
//@desc Get User Profile By Id
router.route("/:userId").get(auth, getProfile);

//@route POST /profile
//@desc Create or update user profile
//@access Private
router.route('/').post(auth, createOrUpdateProfile).put(auth, createOrUpdateProfile);

module.exports = router;
