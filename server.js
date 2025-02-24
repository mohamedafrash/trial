const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();
    const fileName = `responses/${timestamp.replace(/[:.]/g, '-')}.json`;

    // Create responses directory if it doesn't exist
    if (!fs.existsSync('responses')) {
        fs.mkdirSync('responses');
    }

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Form data saved!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
