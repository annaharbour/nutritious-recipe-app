require('dotenv');
const express = require('express');
const connectDB = require('./db');

const app = express();

app.use(express.json());
connectDB();

app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/profile', require('./routes/profileRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/recipes', require('./routes/recipeRoutes'));
app.use('/ingredients', require('./routes/ingredientRoutes'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`, PORT)});
