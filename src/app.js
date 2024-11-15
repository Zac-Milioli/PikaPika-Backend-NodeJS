// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const Users = require('./models/users');
const Teams = require('./models/teams');


const app = express();
app.use(cors());
app.use(express.json());


//connect mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));
  

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
        const pokeApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`); // Faz a requisição para a API do Pokémon
        const pokemonData = pokeApi.data; // Armazena os dados do Pokémon

        // const tcgApi = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonData.name}`)
        // const tcgData = tcgApi.data



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
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Pokémon não encontrado na PokeAPI' });
        }
        res.status(500).json({ message: 'Erro ao buscar Pokémon', error: error.message });
    }
});

// Método para adicionar um Pokémon ao time
app.post('/api/:keyword', async (req, res) => {
    const { keyword } = req.params;

    // Verifica se o time já possui 6 Pokémons
    if (team.length >= 6) {
        return res.status(409).json({ message: 'Seu time já possui o limite de 6 Pokémons.', team });
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

        res.status(201).json({ message: 'Pokémon adicionado ao time com sucesso', team });
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

var teste_test = 0

function teste () {
    console.log(teste_test)
}

teste()

// Constante que armazena a porta do servidor
const PORT = 3300;

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const user = await Users.findById(userId); // Busca o usuário pelo ID na coleção 'users'
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(user); // Retorna os dados do usuário
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
  });


  app.post('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { pokemons } = req.body;

    // Verifica se o array de Pokémon é válido e contém até 6 nomes
    if (!pokemons || !Array.isArray(pokemons) || pokemons.length > 6) {
        return res.status(400).json({ message: 'Por favor, envie uma lista de até 6 Pokémons' });
    }

    try {
        // Verifica se o usuário já existe pelo userId
        const updatedUser = await Users.findOneAndUpdate(
            { userId },
            { new: true, upsert: true } // Cria um userid se não existir
        );
        
        // Se o usuário não existir, cria um novo documento de usuário
        // if (!user) {
        //     user = new Users({ userId });
        //     await user.save();
        // }

        
        // Atualiza ou cria o time associado ao userId
        const updatedTeam = await Teams.findOneAndUpdate(
            { userId },
            { userId, pokemons },
            { new: true, upsert: true } // Cria um novo time se não existir
        );
        
        res.status(201).json({ message: 'Time de Pokémon e usuário atualizados com sucesso', team: updatedTeam, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao inserir ou atualizar time de Pokémon', error: error.message });
    }
});


app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params.userId;

    try {
        // Busca o usuário pelo campo `userId`
        const user = await Users.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Busca o time de Pokémons associado ao userId
        const team = await Teams.findOne({ userId });

        // Retorna o usuário e o time (ou uma mensagem caso o time não exista)
        res.status(200).json({
            pokemons: team ? team.pokemons : []
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário e time de Pokémon', error: error.message });
    }
});