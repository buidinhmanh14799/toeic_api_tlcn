const { Schema, Mongoose } = require("mongoose");
const mongoose = require('mongoose')


let voca = new mongoose.Schema({
    voca: {type: String, required: true},
    mean: {type: String, required: true},
})

const VocaModel = mongoose.model('vocabulary', voca);

module.exports = VocaModel;