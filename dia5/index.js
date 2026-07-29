require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');
const connectDB = require('./db');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

