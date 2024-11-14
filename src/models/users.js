const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('users', userSchema);