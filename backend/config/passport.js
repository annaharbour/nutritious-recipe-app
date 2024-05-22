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
					done(null, user);
				} else {
					user = new User({
						oAuthProvider: "google",
						oAuthId: id,
						name: displayName,
						email: emails[0].value,
					});
					await user.save();
					done(null, user);
				}
			} catch (err) {
				console.error(err.message);
				done(err, false);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		User.findById(id, (err, user) => done(null, user));
	} catch (err) {
		console.error(err.message);
		done(err, false);
	}
});
