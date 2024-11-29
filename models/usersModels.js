const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
    },
    authToken: {
        type: String,
    },
})

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;