const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('templates/index.html', { root: __dirname });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});