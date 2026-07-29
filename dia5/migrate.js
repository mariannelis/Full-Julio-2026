require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const connectDB = require('./db');
const User = require('./models/Users');
const results = [];

connectDB();

fs.createReadStream('users.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach(async (userData) => {
            const { name, email, age } = userData;
            const newUser = new User({ name, email, age });
            try {
                await newUser.save();
                console.log(`User ${name} saved successfully.`);
            } catch (error) {
                console.error(`Error saving user ${name}:`, error.message);
            }
        });
    });      