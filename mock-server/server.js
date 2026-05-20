const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static assets if there are any
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/authen-vinmec', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'authen-vinmec.html'));
});

app.get('/select-hospital', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'select-hospital.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Vaccination routes (SPA catch-all)
app.get(/^\/vaccination(\/.*)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'vaccination.html'));
});

// Default route to redirect to /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Mock server listening at http://localhost:${port}`);
});
