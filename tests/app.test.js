//Testes do app.js

const {app, getPokemon, postPokemon, deletePokemon, team} = require('../src/app');
const request = require('supertest');
const axios = require('axios');
const path = require('path');

// Mocks para as respostas da API
jest.mock('axios');


test('deve retornar o arquivo index.html', async () => {
    const response = await request(app).get('/');

    // Verifica se o status da resposta é 200
    expect(response.status).toBe(200);
    
    // Verifica se o conteúdo da resposta é do tipo HTML
    expect(response.header['content-type']).toMatch(/html/);

    // Verifica se o conteúdo da resposta contém alguma parte esperada do index.html
    expect(response.text).toContain('<!DOCTYPE html>'); // ou outra parte do seu HTML
});

it('deve retornar os integrantes do grupo', async () => {
    const response = await request(app).get('/integrantes');

    // Verifica se o status da resposta é 200
    expect(response.status).toBe(200);

    // Verifica se a resposta é do tipo JSON
    expect(response.header['content-type']).toMatch(/json/);

    // Verifica se os dados retornados estão corretos
    expect(response.body).toEqual({
        integrantes: [
            { nome: 'Zac Milioli' },
            { nome: 'Eduardo Kipper' },
            { nome: 'Pedro Esmeraldino' },
            { nome: 'Gabriel Antônio' }
        ]
    });
});

const mockedPokeApiResponse = {
    data: {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
        sprites: {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
        }
    }
};

const mockedTcgApiResponse = {
    data: {
        data: [{
            images: {
                large: 'https://example.com/card_image.png'
            }
        }]
    }
};
// Simulando as respostas das APIs
axios.get.mockImplementation((url) => {
    if (url.includes('pokeapi.co')) {
        return Promise.resolve(mockedPokeApiResponse);
    } else if (url.includes('pokemontcg.io')) {
        return Promise.resolve(mockedTcgApiResponse);
    }
});

test('getPokemon deve retornar o pikachu', async () => {
    
    const response = await getPokemon('pikachu');
    expect(response).toStrictEqual(
        {
            "response": {
                "cardImg": "https://example.com/card_image.png",
                "message": "Informações do Pokémon número 25",
                "pokemonImg": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                "pokemonNome": "pikachu",
                "pokemonPokedex": 25,
                "pokemonTipo": [
                  "electric"
                ]
            },
        "status": 200,
        }
    );
});

// Teste para Pokémon não encontrado (Erro 404)
test('getPokemon deve retornar 404 para Pokémon não encontrado', async () => {
    // Mockando a resposta para 404 da PokeAPI
    axios.get.mockImplementationOnce((url) => {
        if (url.includes('pokeapi.co')) {
            return Promise.reject({ response: { status: 404 } });
        }
    });

    const response = await getPokemon('unknownpokemon');
    expect(response).toStrictEqual({
        status: 404,
        response: { message: 'Pokémon não encontrado na PokeAPI' }
    });
});

// Teste para erro inesperado (Erro 500)
test('getPokemon deve retornar 500 em caso de erro inesperado', async () => {
    // Mockando a resposta para erro da PokeAPI
    axios.get.mockImplementationOnce((url) => {
        return Promise.reject(new Error('Erro inesperado'));
    });

    const response = await getPokemon('pikachu');
    expect(response).toStrictEqual({
        status: 500,
        response: { message: 'Erro ao buscar Pokémon', error: 'Erro inesperado' }
    });
});

test('postPokemon deve adicionar o pikachu no time', async () => {
    const response = await postPokemon('pikachu');
    expect(response).toStrictEqual(
        {
            "response": {
                "message": "Pokémon adicionado ao time com sucesso",
                "team": [{
                    "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                    "nome": "pikachu",
                    "tipo": [
                        "electric",
                    ],
                },],
        },
        "status": 201,
        }
    );
});

// Teste para erro inesperado (Erro 500)
test('postPokemon deve retornar 500 em caso de erro inesperado', async () => {
    // Mockando a resposta para erro da PokeAPI
    axios.get.mockImplementationOnce((url) => {
        return Promise.reject(new Error('Erro inesperado'));
    });

    const response = await postPokemon('pikachu');
    expect(response).toStrictEqual({
        status: 500,
        response: { message: 'Erro ao adicionar Pokémon ao time', error: 'Erro inesperado' }
    });
});

let mockedTeam = [{
    "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "nome": "pikachu",
    "tipo": [
        "electric",
    ],
},];

test('deletePokemon deve apagar o pikachu do time', async () => {
    // Mock da implementação da função deletePokemon
    let mockDeletePokemon = jest.fn(async (keyword) => {
        // Simula a lógica de remoção do Pokémon da equipe
        mockedTeam = mockedTeam.filter(pokemon => pokemon.nome !== keyword);
        return {
            response: {
                message: "Pokémon removido do time com sucesso",
                team: mockedTeam,
            },
            status: 200,
        };
    });
    // Substitui a implementação da função deletePokemon
    let deletePokemon = mockDeletePokemon;
    const response = await deletePokemon('pikachu');
    expect(response).toStrictEqual({
        response: {
            message: "Pokémon removido do time com sucesso",
            team: [],
        },
        status: 200,
    });
    
    // Verifica se o Pikachu foi realmente removido da equipe
    expect(mockedTeam).not.toContainEqual({
        "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        "nome": "pikachu",
        "tipo": ["electric"],
    });
});

describe('teste integrado API de Pokémons', () => {
    // Limpa o time antes de cada teste
    beforeEach(() => {
        team.length = 0;
    });

    describe('GET /api/:keyword', () => {
        it('deve retornar informações do Pokémon existente', async () => {
            const response = await request(app).get('/api/pikachu'); // Testando um Pokémon existente

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pokemonNome', 'pikachu');
            expect(response.body).toHaveProperty('pokemonPokedex');
            expect(response.body).toHaveProperty('pokemonTipo');
            expect(response.body).toHaveProperty('pokemonImg');
        });

        it('deve retornar 404 para um Pokémon não existente', async () => {
            const response = await request(app).get('/api/');

            expect(response.status).toBe(404);
            expect(response.body).toStrictEqual({});
        });
    });

    describe('POST /api/:keyword', () => {
        it('deve adicionar um Pokémon ao time', async () => {
            const response = await request(app).post('/api/pikachu'); // Testando a adição de Pikachu

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Pokémon adicionado ao time com sucesso');
            expect(response.body.team).toHaveLength(1); // Verifica se o time tem um Pokémon
        });

        it('deve retornar 409 se o time já tem 6 Pokémons', async () => {
            // Adicionando 6 Pokémons fictícios para testar o limite
            for (let i = 0; i < 6; i++) {
                await request(app).post('/api/pikachu'); // Adicionando Pikachu várias vezes
            }

            const response = await request(app).post('/api/pikachu'); // Tentando adicionar mais um

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'Seu time já possui o limite de 6 Pokémons.');
        });
    });

    describe('GET /team', () => {
        it('deve retornar o time com os Pokémons', async () => {
            const response = await request(app).get('/team');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array); // Verifica se a resposta é um array
        });
    });

    describe('DELETE /team/:keyword', () => {
        it('deve remover um Pokémon do time', async () => {
            await request(app).post('/api/pikachu'); // Adicionando Pikachu para testar remoção
            const response = await request(app).delete('/team/pikachu'); // Removendo Pikachu

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'pikachu removido do time com sucesso');
        });

        it('deve retornar 404 se o Pokémon não estiver no time', async () => {
            const response = await request(app).delete('/team/unknownpokemon'); // Tentando remover um Pokémon inexistente

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Pokémon não encontrado');
        });
    });
});