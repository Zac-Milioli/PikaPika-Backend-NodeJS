const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
}, { _id: false });

module.exports = mongoose.model('Users', userSchema);