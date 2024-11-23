const request = require('supertest');
const app = require('../src/app'); // Ajuste o caminho conforme necessário
const mongoose = require('mongoose');
const Teams = require('../src/models/teams');
const Users = require('../src/models/users');

// beforeAll(async () => {
//     await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// });

// afterAll(async () => {
//     await mongoose.connection.close();
// });

describe('Testes do app.js', () => {
    // afterEach(async () => {
    //     await Teams.deleteMany({});
    //     await Users.deleteMany({});
    // });

    // test('GET / deve retornar a página inicial', async () => {
    //     const response = await request(app).get('/');
    //     expect(response.statusCode).toBe(200);
    // });

    test('GET /integrantes deve retornar os integrantes do grupo', async () => {
        const response = await request(app).get('/integrantes');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('integrantes');
        expect(response.body.integrantes.length).toBe(5);
    });

    test('GET /api/:idPokemon deve retornar informações do Pokémon', async () => {
        const response = await request(app).get('/api/1'); // Testando com o Pokémon Bulbasaur
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('pokemonNome');
        expect(response.body).toHaveProperty('pokemonPokedex');
    });

    test('GET /api/:idPokemon deve retornar 404 se Pokémon não encontrado', async () => {
        const response = await request(app).get('/api/9999'); // Pokémon que não existe
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Pokémon não encontrado na PokeAPI');
    });

    // test('POST /user/:userId deve criar um novo time', async () => {
    //     const response = await request(app)
    //         .post('/user/123')
    //         .send({ team: [{ id: 1, nome: 'Pikachu', img: 'pikachu.png' }] });
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body).toHaveProperty('message', 'Time criado com sucesso');
    // });

    // test('POST /user/:userId deve atualizar um time existente', async () => {
    //     await request(app)
    //         .post('/user/123')
    //         .send({ team: [{ id: 1, nome: 'Pikachu', img: 'pikachu.png' }] });

    //     const response = await request(app)
    //         .post('/user/123')
    //         .send({ team: [{ id: 2, nome: 'Charmander', img: 'charmander.png' }] });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Time atualizado com sucesso');
    // });

    // test('GET /user/:userId deve retornar o time do usuário', async () => {
    //     await request(app)
    //         .post('/user/123')
    //         .send({ team: [{ id: 1, nome: 'Pikachu', img: 'pikachu.png' }] });

    //     const response = await request(app).get('/user/123');
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty('userId', '123');
    // });

    // test('DELETE /user/:userId deve deletar o time do usuário', async () => {
    //     await request(app)
    //         .post('/user/123')
    //         .send({ team: [{ id: 1, nome: 'Pikachu', img: 'pikachu.png' }] });

    //     const response = await request(app).delete('/user/123');
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Time deletado com sucesso');
    // });

    // test('DELETE /user/:userId deve retornar 404 se o time não for encontrado', async () => {
    //     const response = await request(app).delete('/user/999');
    //     expect(response.statusCode).toBe(404);
    //     expect(response.body).toHaveProperty('message', 'Time não encontrado');
    // });
});