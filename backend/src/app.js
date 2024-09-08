// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Cria uma instância do express
const app = express();

// Configura o CORS para permitir requisições apenas da porta 4000
app.use(cors());

let team = [] // Cria uma lista vazia para armazenar os Pokémons do time

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

    // Verifica se o time já possui 6 Pokémons
    if (team.length == 6) {
        return res.status(400).json({ message: 'Seu time já possui o limite de 6 Pokémons.', team });
    }

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`);
        const pokemonData = response.data;

        const pokemonNome = pokemonData.name;
        const pokemonTipo = pokemonData.types.map(typeInfo => typeInfo.type.name);
        const pokemonImg = pokemonData.sprites.front_default;

        // Variável onde são armazenados os dados (nome, tipo e img) do Pokémon
        let pokemon = {
            nome: pokemonNome,
            tipo: pokemonTipo,
            img: pokemonImg
        };
        team.push(pokemon); // Adiciona o Pokémon na lista team

        res.json({ message: 'Pokémon adicionado ao time com sucesso', team });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar Pokémon ao time', error: error.message });
    }
});

// Método para retornar o time com os Pokémons
app.get('/team', (req, res) => {
    res.json(team);
});

// Método para remover um Pokémon do time
app.delete('/team/:nomePokemon', (req, res) => {
    const { nomePokemon } = req.params;

    // Procura o Pokémon no time e armazena seu índice
    // O índice -1 indica que o Pokémon não foi encontrado
    const index = team.findIndex(pokemon => pokemon.nome === nomePokemon);

    // Verifica se o Pokémon foi encontrado
    if (index !== -1) {
        // Remove o Pokémon do array
        team.splice(index, 1);

        res.json({ message: nomePokemon+' removido do time com sucesso', team });
    } else {
        res.status(404).json({ message: 'Pokémon não encontrado' });
    }
});

// Constante que armazena a porta do servidor
const PORT = 3000;

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
