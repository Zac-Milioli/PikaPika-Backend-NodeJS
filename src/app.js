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

const PORT = process.env.PORT;

//connect mongodb
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

//retorna pagina inicial
app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname });
});

//integrantes do grupo
const data = {
    integrantes: [
        { nome: 'Zac Milioli' },
        { nome: 'Eduardo Kipper' },
        { nome: 'Pedro Esmeraldino' },
        { nome: 'Gabriel Antônio' },
        { nome: 'Guilherme Gomes' }
    ]
};

console.log("teste1")

//metodo chamar integrantes
app.get('/integrantes', (req, res) => {
    res.json(data);
});

//metodo buscar pokemons
app.get('/api/:idPokemon', async (req, res) => {
    const idPokemon = req.params.idPokemon; 
    try {
        const pokeApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`);
        const pokemonData = pokeApi.data;

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

// Endpoint para salvar o time do usuário
app.post('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const team = req.body.team;

    try {
        // Faz a busca pelo usuário
        let time = await Teams.findOne({ userId});

        if (time) {  
            time.team = team; 
            await time.save();
            return res.status(200).json({ message: 'Time atualizado com sucesso', time }); 
        } else { 
            // Cria um novo time
            console.log({userId, team}); 
            time = await Teams.create({ userId, team }); 

            return res.status(201).json({ message: 'Time criado com sucesso', time });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar time', error: error.message });
    }
});

// Endpoint para retornar o time de um usuário específico
app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Busca o time do usuário
        const userTeam = await Teams.findOne({ userId });

        const team = [
            { id: 0, nome: "", img: "" },
            { id: 1, nome: "", img: "" },
            { id: 2, nome: "", img: "" },
            { id: 3, nome: "", img: "" },
            { id: 4, nome: "", img: "" },
            { id: 5, nome: "", img: "" },
        ];

        if (!userTeam) {
            await Users.create({userId});
            var newTeam = await Teams.create({userId, team});
            return res.json(newTeam);
        }

        return res.json(userTeam);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar time', error: error.message });
    }
});

// Endpoint para deletar o time de um usuário
app.delete('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Deleta o time do usuário
        const deletedTeam = await Teams.findOneAndDelete({ userId });

        if (!deletedTeam) {
            return res.status(404).json({ message: 'Time não encontrado' });
        }

        const deletedUser = await Users.findOneAndDelete({ userId });

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Retorna a estrutura padrão do time
        const defaultTeam = [
            { id: 0, nome: "", img: "" },
            { id: 1, nome: "", img: "" },
            { id: 2, nome: "", img: "" },
            { id: 3, nome: "", img: "" },
            { id: 4, nome: "", img: "" },
            { id: 5, nome: "", img: "" },
        ];

        res.json({ message: 'Time deletado com sucesso', team: defaultTeam });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar time', error: error.message });
    }
});

// Inicia o servidor na porta especificada
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app; // Exporta o aplicativo