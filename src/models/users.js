const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Users', userSchema);