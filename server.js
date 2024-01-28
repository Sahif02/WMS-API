const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'srv1207.hstgr.io',
    user: 'u418262249_wms_api',
    password: 'Wmsapi2024',
    database: 'u418262249_API'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// GET all users
app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).json({ error: 'No users found' });
            }
        }
    });
});

// GET a specific user by username
app.get('/api/users/:username', (req, res) => {
    const username = req.params.username;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
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

// POST create a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    connection.query('INSERT INTO users SET ?', [newUser], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'User created successfully', userId: result.insertId });
        }
    });
});

// PUT update a user by username
app.put('/api/users/:username', (req, res) => {
    const username = req.params.username;
    const updatedUser = req.body;
    connection.query('UPDATE users SET ? WHERE username = ?', [updatedUser, username], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    });
});

// DELETE a user by username
app.delete('/api/users/:username', (req, res) => {
    const username = req.params.username;
    connection.query('DELETE FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
