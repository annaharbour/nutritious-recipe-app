const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// @route    POST auth
// @desc     Create user and get token
// @access   Public
router.post("/register", register);

// @route    POST auth
// @desc     Authenticate user and get token
// @access   Public
router.post('/login', login);

module.exports = router;
