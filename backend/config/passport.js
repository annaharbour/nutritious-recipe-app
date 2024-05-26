const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserModel");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.serverURI}/auth/google/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			const { id, displayName, emails } = profile;
			try {
				let user = await User.findOne({ oAuthProvider: "google", oAuthId: id });
				if (user) {
					return done(null, user);
				}

				user = await User.findOne({ email: emails[0].value });
				if (user) {
					user.oAuthProvider = "google";
					user.oAuthId = id;
					await user.save();
					return done(null, user);
				}

				user = new User({
					oAuthProvider: "google",
					oAuthId: id,
					name: displayName,
					email: emails[0].value,
				});
				await user.save();
				return done(null, user);
			} catch (err) {
				console.error(err.message);
				return done(err, false);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});
