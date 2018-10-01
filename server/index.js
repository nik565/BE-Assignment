const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./api/v1');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use('/api/v1', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist'));
});

module.exports = app;