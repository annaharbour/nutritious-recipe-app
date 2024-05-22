const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		const token = jwt.sign({ user: req.user }, process.env.jwtSecret, {
			expiresIn: "5 days",
		});
		const redirectUrl = `${process.env.clientURI}/auth?token=${token}&user=${JSON.stringify(
			req.user
		)}`;
		res.redirect(redirectUrl);
	}
);

module.exports = router;
