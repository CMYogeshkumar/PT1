const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your_secret_key', // Change this to a random secret key
    resave: false,
    saveUninitialized: true
}));

let users = []; // Temporary storage for user data

// Serve the login page
app.get('/', (req, res) => {
    // Check if user is already logged in
    if (req.session.username) {
        return res.redirect('/index'); // Redirect to main page if logged in
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Serve the main page after successful login
app.get('/index', (req, res) => {
    // Check if user is logged in
    if (!req.session.username) {
        return res.redirect('/'); // Redirect to login if not logged in
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }

    users.push({ username, password });
    console.log('Users:', users); // Log current users
    res.redirect('/'); // Redirect to login after signup
});

// Handle login
app.post('/login', (req, res) => {
    console.log('Login Data:', req.body); // Log login data
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        req.session.username = username; // Store username in session
        res.redirect('/index'); // Redirect to main page on successful login
    } else {
        console.log('Invalid login attempt'); // Log invalid attempts
        res.status(401).send('Invalid username or password'); // Send error on failure
    }
});

// Set the port to 3000 or the environment's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
