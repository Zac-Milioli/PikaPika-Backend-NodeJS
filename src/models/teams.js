const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    pokemons: [
        {
            id: { type: Number, required: true },
            nome: {type: String},
            img: {type: String}
        }
    ]
});

module.exports = mongoose.model('Teams', teamSchema);
