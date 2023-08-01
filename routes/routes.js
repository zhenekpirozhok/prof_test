const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello world!');
});

router.get('/result', (req, res) => {
    res.send('Your result');
});

module.exports = router;