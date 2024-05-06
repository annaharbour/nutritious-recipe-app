const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, createProfile } = require("../controllers/profileController");

router.route("/:userId").get(auth, getProfile).post(auth, createProfile).put(auth, updateProfile);

module.exports = router;
