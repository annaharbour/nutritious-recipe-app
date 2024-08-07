// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// require("./config/passport");
// const connectDB = require("./config/db");
// const passport = require("passport");
// const session = require("express-session");
// const app = express();

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '100mb', extended: true }));
// app.use(cors());
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: { secure: false },
// 	})
// );

// app.use(passport.initialize());
// app.use(passport.session());

// connectDB();

// app.use("/auth", require("./routes/authRoutes"));
// app.use("/users", require("./routes/userRoutes"));
// app.use("/comments", require("./routes/commentRoutes"));
// app.use("/recipes", require("./routes/recipeRoutes"));
// app.use("/ingredients", require("./routes/ingredientRoutes"));
// app.use("/nutrients", require("./routes/nutrientRoutes"));

// const PORT = process.env.PORT;

// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// });
require("dotenv").config();
const cors = require("cors");
const express = require("express");
require("./config/passport");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
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

// Use /api prefix for all routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/ingredients", require("./routes/ingredientRoutes"));
app.use("/api/nutrients", require("./routes/nutrientRoutes"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
