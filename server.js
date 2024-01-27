const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sample in-memory database
let users = [];
let lists = [];

// Endpoint to create a new user
app.post('/api/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.json(user);
});

// Endpoint to get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/users/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.json(user);
    }
});

// Endpoint to update a user
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    // Update user logic here (for simplicity, updating in-memory)
    users = users.map(user => (user.id === userId ? updatedUser : user));
    res.json(updatedUser);
});

// Endpoint to create a new user
app.post('/api/lists', (req, res) => {
    const list = req.body;
    lists.push(list);
    res.json(list);
});

// Endpoint to get all users
app.get('/api/lists', (req, res) => {
    res.json(lists);
});

// app.get('/api/lists/:username', (req, res) => {
//     const username = req.params.username;
//     const user = users.find(user => user.username === username);

//     if (!user) {
//         res.status(404).json({ error: 'User not found' });
//     } else {
//         res.json(user);
//     }
// });

// Endpoint to update a user
app.put('/api/lists/:id', (req, res) => {
    const listId = req.params.id;
    const updatedlist = req.body;
    // Update user logic here (for simplicity, updating in-memory)
    lists = lists.map(list => (list.id === listId ? updatedlist : list));
    res.json(updatedlist);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
