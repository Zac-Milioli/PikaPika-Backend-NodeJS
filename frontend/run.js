const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});