const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

let team = []

app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname });
});

const data = {
    integrantes: [
        { nome: 'Zac Milioli' },
        { nome: 'Eduardo Kipper' },
        { nome: 'Pedro Esmeraldino' },
        { nome: 'Gabriel Antonio Maida' }
    ]
};

app.get('/integrantes', (req, res) => {
    res.json(data);
});

app.post('/api/:keyword', async (req, res) => {
    const { keyword } = req.params;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`);
        const pokemonData = response.data;

        const pokemonNome = pokemonData.name;
        const pokemonTipo = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');
        const pokemonImg = pokemonData.sprites.front_default;

        let pokemon = {
            nome: pokemonNome,
            tipo: pokemonTipo,
            img: pokemonImg
        };
        team.push(pokemon);
        res.json({ message: 'Pokémon adicionado ao time com sucesso', team });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar Pokémon ao time', error: error.message });
    }
});

app.get('/team', (req, res) => {
    res.json(team);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});