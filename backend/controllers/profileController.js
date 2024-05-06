const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel");

const getProfile = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findById(userId);
		const profile = await Profile.findById(user.profile);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!profile) {
			return res.status(404).json({ message: "Profile not found" });
		}

		return res.json(profile);
	} catch (err) {
		res.status(500).json({ message: "Server Error" });
	}
};

const createProfile = async (req, res) => {
	const { bio } = req.body;
	const userId = req.user.id;

	try {
		let profile = await Profile.findOne({ user: userId });

		if (!profile) {
			profile = new Profile({ user: userId, bio });
			await profile.save();
			await User.findByIdAndUpdate(userId, { profile: profile._id });
		} else {
			res.send("Profile already exists");
		}

		let user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.populate("profile").then((user) => {
            user.save()
        })

		return res.json(profile);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const updateProfile = async (req, res) => {
    const { bio } = req.body;
    const userId = req.user.id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let profile = await Profile.findById(user.profile);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile.bio = bio;
        await profile.save();

        return res.json(profile);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { getProfile, createProfile, updateProfile};
