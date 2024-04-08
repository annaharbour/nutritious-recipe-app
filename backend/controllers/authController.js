const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;
const User = require("../models/UserModel");


const register = async (req, res) => {
	const { name, email, phone, password } = req.body;
	const validateInputs = [
		check("name", "Name is required").notEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("phone", "Please enter a valid phone number").matches(/^\d{9,}$/),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	];
	validateInputs.forEach((validation) => validation.run(req));

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let user = await User.findOne({
			email,
		});
		if (user) {
			return res.status(400).json({
				errors: [
					{
						msg: "User already exists",
					},
				],
			});
		} else {
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
				res.json({ token });
			});
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const validateInputs = [
		check("email", "Please include a valid email").isEmail().notEmpty(),
		check("password", "Password is required").exists(),
	];
	validateInputs.forEach((validation) => validation.run(req));
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = { register, login };
