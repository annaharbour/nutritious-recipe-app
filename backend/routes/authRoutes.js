const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { register, login, sendPasswordResetEmail, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/lostpassword", sendPasswordResetEmail);
router.post("/reset", resetPassword);

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
			expiresIn: "5 days",
		});
		const redirectUrl = `${process.env.CLIENT_URI}/auth?token=${token}&user=${JSON.stringify(
			req.user
		)}`;
		res.redirect(redirectUrl);
	}
);

router.get('/reset/:resetToken', (req, res) => {
	res.redirect(`${process.env.CLIENT_URI}/reset/${req.params.resetToken}`);
});

router.post('/reset/:resetToken', resetPassword);

module.exports = router;
