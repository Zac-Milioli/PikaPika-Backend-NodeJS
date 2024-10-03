// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Cria uma instância do express
const app = express();

// Configura o CORS para permitir requisições apenas da porta 4000
app.use(cors());

let team = [] // Cria uma lista vazia para armazenar os Pokémons do time



// Rota que utiliza a função
app.get('/', getIndexPage);

// Função para enviar o arquivo index.html
function getIndexPage(req, res) {
    res.sendFile('views/index.html', { root: __dirname });
}


// Define um objeto com os integrantes do grupo
const data = {
    integrantes: [
        { nome: 'Zac Milioli' },
        { nome: 'Eduardo Kipper' },
        { nome: 'Pedro Esmeraldino' },
        { nome: 'Gabriel Antônio' }
    ]
};

// Método para definir a rota dos integrantes
app.get('/integrantes', getIntegrantes);

// Função para retornar os integrantes do grupo
function getIntegrantes(req, res) {
    res.json(data);
}

// Método para buscar informações de um Pokémon
app.get('/api/:keyword', async (req, res) => {
    const { keyword } = req.params; // Armazena o parâmetro da URL em uma variável
    const { status, response } = await getPokemon(keyword);
    res.status(status).json(response);
});

async function getPokemon(keyword) {
    try {
        const pokeApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${keyword}`); // Faz a requisição para a API do Pokémon
        const pokemonData = pokeApi.data; // Armazena os dados do Pokémon
    
        const tcgApi = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonData.name}`)
        const tcgData = tcgApi.data
    
        // Extrai as informações necessárias do Pokémon
        const pokemonNome = pokemonData.name;
        const pokemonPokedex = pokemonData.id;
        const pokemonTipo = pokemonData.types.map(typeInfo => typeInfo.type.name);
        const pokemonImg = pokemonData.sprites.front_default;
        const cardImg = tcgData.data.length > 0 ? tcgData.data[0].images.large : null;
    
        // Retorna as informações do Pokémon em formato JSON
        return { 
            status: 200,
            response: { 
                message: 'Informações do Pokémon número ' + pokemonPokedex, 
                pokemonNome, 
                pokemonPokedex, 
                pokemonTipo, 
                pokemonImg,
                cardImg 
            }
        };

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { status: 404, response: { message: 'Pokémon não encontrado na PokeAPI' } };
        }
        return { status: 500, response: { message: 'Erro ao buscar Pokémon', error: error.message } };
    }
}

// Método para adicionar um Pokémon ao time
app.post('/api/:keyword', async (req, res) => {
    const { keyword } = req.params;
    const {status, response} = await postPokemon(keyword)
    res.status(status).json(response)
    // Verifica se o time já possui 6 Pokémons
});

async function postPokemon (keyword){
    if (team.length >= 6) {
        return {
            status: 409, 
            response: { message: 'Seu time já possui o limite de 6 Pokémons.', team }
        };
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

        return {
            status: 201, 
            response: { message: 'Pokémon adicionado ao time com sucesso', team }
        };
    } catch (error) {
        return {
            status: 500, 
            response: { message: 'Erro ao adicionar Pokémon ao time', error: error.message }
        };
    }
}

// Método para retornar o time com os Pokémons
app.get('/team', (req, res) => {
    res.json(team);
});

// Método para remover um Pokémon do time
app.delete('/team/:keyword', (req, res) => {
    const { keyword } = req.params;
    const { status, response } = deletePokemon (keyword);
    res.status(status).json(response);
});

function deletePokemon (keyword) {
// Procura o Pokémon no time e armazena seu índice
 // O índice -1 indica que o Pokémon não foi encontrado
 const index = team.findIndex(pokemon => pokemon.nome === keyword);

 // Verifica se o Pokémon foi encontrado
 if (index !== -1) {
    // Remove o Pokémon do array
    team.splice(index, 1);
    return {
       status: 200,
       response: { message: keyword+' removido do time com sucesso', team }
    };
 } else {
    return {
        status: 404,
        response: { message: 'Pokémon não encontrado' }
     };
 }
}

// Constante que armazena a porta do servidor
const PORT = 3300;

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = {app, getPokemon, postPokemon, deletePokemon, team}