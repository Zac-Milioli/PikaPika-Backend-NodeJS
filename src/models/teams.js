const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    pokemons: [
        {
            nome: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('teams', teamSchema);
