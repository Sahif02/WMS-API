// Import required modules
const express = require('express');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'auth-db1207.hstgr.io',
    user: 'u418262249_ewbs',
    password: '#EwbSports2024',
    database: 'u418262249_ewb'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Define a route to get all users
app.get('/api/users', (req, res) => {
    // Fetch users from the database
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Define a route to get a specific user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    // Fetch a user by ID from the database
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
