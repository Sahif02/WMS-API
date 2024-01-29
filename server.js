const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based version
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'srv1207.hstgr.io',
    user: 'u418262249_wms_api',
    password: 'Wmsapi2024',
    database: 'u418262249_API',
    connectionLimit: 10,
});

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
};

// GET all users
app.get('/api/users', async (req, res, next) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No users found' });
        }
    } catch (err) {
        next(err); 
    }
});

// GET a specific user by username
app.get('/api/users/:username', async (req, res, next) => {
    const username = req.params.username;
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        next(err); 
    }
});

// POST create a new user
app.post('/api/users', async (req, res, next) => {
    const newUser = req.body;
    try {
        const [result] = await pool.query('INSERT INTO users SET ?', [newUser]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
        next(err); 
    }
});

// PUT update a user by username
app.put('/api/users/:username', async (req, res, next) => {
    const username = req.params.username;
    const updatedUser = req.body;
    try {
        const [result] = await pool.query('UPDATE users SET ? WHERE username = ?', [updatedUser, username]);
        if (result.affectedRows > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        next(err); 
    }
});

// DELETE a user by username
app.delete('/api/users/:username', async (req, res, next) => {
    const username = req.params.username;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE username = ?', [username]);
        if (result.affectedRows > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        next(err); 
    }
});

// GET all lists
app.get('/api/lists', async (req, res, next) => {
    try {
        const [lists] = await pool.query('SELECT * FROM lists');
        res.json(lists);
    } catch (err) {
        next(err);
    }
});

// GET a specific list by listID
app.get('/api/lists/:listID', async (req, res, next) => {
    const listID = req.params.listID;
    try {
        const [list] = await pool.query('SELECT * FROM lists WHERE listsID = ?', [listID]);
        res.json(list[0]);
    } catch (err) {
        next(err);
    }
});

// POST create a new list
app.post('/api/lists', async (req, res, next) => {
    const newList = req.body;
    try {
        const [result] = await pool.query('INSERT INTO lists SET ?', [newList]);
        res.status(201).json({ message: 'List created successfully', listID: result.insertId });
    } catch (err) {
        next(err);
    }
});

// PUT update a list by listID
app.put('/api/lists/:listID', async (req, res, next) => {
    const listID = req.params.listID;
    const updatedList = req.body;
    try {
        await pool.query('UPDATE lists SET ? WHERE listsID = ?', [updatedList, listID]);
        res.json({ message: 'List updated successfully' });
    } catch (err) {
        next(err);
    }
});

// DELETE a list by listID
app.delete('/api/lists/:listID', async (req, res, next) => {
    const listID = req.params.listID;
    try {
        await pool.query('DELETE FROM lists WHERE listsID = ?', [listID]);
        res.json({ message: 'List deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// GET all items for a specific list
app.get('/api/lists/:listID/items', async (req, res, next) => {
    const listID = req.params.listID;
    try {
        const [items] = await pool.query('SELECT * FROM items WHERE listID = ?', [listID]);
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// GET a specific item by itemID and listID
app.get('/api/lists/:listID/items/:itemID', async (req, res, next) => {
    const listID = req.params.listID;
    const itemID = req.params.itemID;
    try {
        const [item] = await pool.query('SELECT * FROM items WHERE listID = ? AND ItemID = ?', [listID, itemID]);
        res.json(item[0]);
    } catch (err) {
        next(err);
    }
});

// POST create a new item for a specific list
app.post('/api/lists/:listID/items', async (req, res, next) => {
    const listID = req.params.listID;
    const newItem = req.body;
    newItem.listID = listID; // Set the listID for the new item
    try {
        const [result] = await pool.query('INSERT INTO items SET ?', [newItem]);
        res.status(201).json({ message: 'Item created successfully', itemID: result.insertId });
    } catch (err) {
        next(err);
    }
});

// PUT update an item by itemID and listID
app.put('/api/lists/:listID/items/:itemID', async (req, res, next) => {
    const listID = req.params.listID;
    const itemID = req.params.itemID;
    const updatedItem = req.body;
    try {
        await pool.query('UPDATE items SET ? WHERE listID = ? AND ItemID = ?', [updatedItem, listID, itemID]);
        res.json({ message: 'Item updated successfully' });
    } catch (err) {
        next(err);
    }
});

// DELETE an item by itemID and listID
app.delete('/api/lists/:listID/items/:itemID', async (req, res, next) => {
    const listID = req.params.listID;
    const itemID = req.params.itemID;
    try {
        await pool.query('DELETE FROM items WHERE listID = ? AND ItemID = ?', [listID, itemID]);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        next(err);
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});