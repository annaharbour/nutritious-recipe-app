// require('dotenv').config();
require('dotenv');
const express = require('express');
const connectDB = require('./db');

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/userRoutes'));
app.use('/profile', require('./routes/profileRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/recipes', require('./routes/recipeRoutes'));
app.use('/ingredients', require('./routes/ingredientRoutes'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`, PORT)});
