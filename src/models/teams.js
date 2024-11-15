const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    pokemons: [
        {
            nome: { type: String, required: true },
            tipo: [String],
            img: String
        }
    ]
});

module.exports = mongoose.model('Teams', teamSchema);
