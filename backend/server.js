require("dotenv").config();
const cors = require("cors");
const express = require("express");
require("./config/passport");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const app = express();

app.use(express.json());
app.use(cors());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	})
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/search', require('./routes/searchRoutes'));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/comments", require("./routes/commentRoutes"));
app.use("/recipes", require("./routes/recipeRoutes"));
app.use("/ingredients", require("./routes/ingredientRoutes"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`, PORT);
});
