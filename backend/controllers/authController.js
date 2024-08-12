const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const User = require("../models/UserModel");
const nodemailer = require("nodemailer");
let aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");

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

		const isMatch = await bcrypt.compare(password, user.password);

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

const sendPasswordResetEmail = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		const resetToken = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		console.log(process.env.AWS_ACCESS_KEY_ID);
		console.log(process.env.AWS_SECRET_ACCESS_KEY);
		const ses = new aws.SES({
			apiVersion: "2010-12-01",
			region: "us-east-1",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},
		  });	  


		const transporter = nodemailer.createTransport({
			SES: { ses, aws },
			sendingRate: 1,
			maxConnections: 1,
		});

		const mailOptions = {
			from: process.env.EMAIL_ADDRESS,
			to: user.email,
			subject: 'Password Reset Request',
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/auth/reset/${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
		};

		transporter.sendMail(mailOptions, async (err, response) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: 'Error sending email:', error: err});
			}

			user.resetPasswordToken = resetToken;
			user.resetPasswordExpires = Date.now() + 3600000;
			await user.save();
			res.status(200).json({ msg: 'Password reset email sent' });
			
		});
	} catch (error) {
		res.status(500).json({ msg: 'Server Error', error: error.message });
	}
};

const resetPassword = async (req, res) => {
	const { resetToken } = req.params;
	const { password } = req.body;

	try {
		const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

		const user = await User.findOne({
			_id: decoded.user.id,
		});

		if (!user) {
			return res.status(400).json({ msg: "User not found" });
		}

		if (
			user.oAuthProvider &&
			user.oAuthProvider === "google" &&
			user.resetPasswordToken === undefined &&
			user.resetPasswordExpires === undefined
		) {
			// Handle the case where Google OAuth user wants to set a password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();
			return res.status(200).json({ msg: "Password has been set" });
		}

		if (
			user.resetPasswordToken !== resetToken ||
			user.resetPasswordExpires <= Date.now()
		) {
			return res
				.status(400)
				.json({ msg: "Password reset token is invalid or has expired" });
		}

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		res.status(200).json({ msg: "Password has been reset" });
	} catch (error) {
		res.status(500).json({ msg: "Server Error", error: error.message });
	}
};

module.exports = { register, login, sendPasswordResetEmail, resetPassword };
