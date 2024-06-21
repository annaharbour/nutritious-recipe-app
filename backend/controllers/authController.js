const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

const User = require("../models/UserModel");

const register = async (req, res) => {
	const { name, email, phone, password } = req.body;
	let errors = [];

	try {
		let user = await User.findOne({ email });
		if (user) {
			errors.push(
				"Email already in use. Please use a different email to register."
			);
			return res.status(400).json({ message: errors });
		}

		user = new User({
			name,
			email,
			phone,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
			if (err) throw err;
			res.json({ token, user });
		});
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	let errors = [];
	if (!email) {
		errors.push({
			msg: "Please enter the email associated with your account.",
		});
	}
	if (!password) {
		errors.push({
			msg: "Please enter the password associated with your account.",
		});
	}

	if (errors.length > 0) {
		const errorMessages = errors.map((error) => error.msg);
		return res.status(400).json({ message: errorMessages });
	}

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				errors: [
					{
						msg: "Please validate the email and password associated with your account.",
					},
				],
			});
		}

		const isMatch = bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				errors: [
					{
						msg: "Please validate the email and password associated with your account.",
					},
				],
			});
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
			if (err) throw err;
			res.json({ user, token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = { register, login };
