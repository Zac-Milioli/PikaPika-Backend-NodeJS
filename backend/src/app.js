// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Cria uma instância do express
const app = express();

// Configura o CORS para permitir requisições apenas da porta 4000
app.use(cors());

let team = [] // Cria uma lista vazia para armazenar os pokemons do time

// Método para retornar a página inicial
app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname });
});

// Define um objeto com os integrantes do grupo
const data = {
    integrantes: [
        { nome: 'Zac Milioli' },
        { nome: 'Eduardo Kipper' },
        { nome: 'Pedro Esmeraldino' },
        { nome: 'Gabriel Antônio' }
    ]
};

// Método para retornar os integrantes do grupo
app.get('/integrantes', (req, res) => {
    res.json(data);
});

// Método para buscar informações de um Pokémon
app.get('/api/:keyword', async (req, res) => {
    const { keyword } = req.params; // Armazena o parâmetro da URL em uma variável
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`); // Faz a requisição para a API do Pokémon
        const pokemonData = response.data; // Armazena os dados do Pokémon

        // Extrai as informações necessárias do Pokémon
        const pokemonNome = pokemonData.name;
        const pokemonPokedex = pokemonData.id;
        const pokemonTipo = pokemonData.types.map(typeInfo => typeInfo.type.name);
        const pokemonImg = pokemonData.sprites.front_default;

        // Retorna as informações do Pokémon em formato JSON
        res.json({ message: 'Informações do Pokemon número ' + pokemonPokedex, 
            pokemonNome, 
            pokemonPokedex, 
            pokemonTipo, 
            pokemonImg });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar Pokémon', error: error.message });
    }
});

// Método para adicionar um Pokémon ao time
app.post('/api/:keyword', async (req, res) => {
    const { keyword } = req.params;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`);
        const pokemonData = response.data;

        const pokemonNome = pokemonData.name;
        const pokemonTipo = pokemonData.types.map(typeInfo => typeInfo.type.name);
        const pokemonImg = pokemonData.sprites.front_default;

        // Variavel onde são armazenados os dados (nome, tipo e img) do pokemon
        let pokemon = {
            nome: pokemonNome,
            tipo: pokemonTipo,
            img: pokemonImg
        };
        team.push(pokemon); // Adiciona o pokemon na lista team

        res.json({ message: 'Pokémon adicionado ao time com sucesso', team });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar Pokémon ao time', error: error.message });
    }
});

// Método para retornar o time com os pokemons
app.get('/team', (req, res) => {
    res.json(team);
});

// Constante que armazena a porta do servidor
const PORT = 3000;

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});