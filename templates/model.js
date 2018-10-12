const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let {schemaName} = new Schema({fields});

module.exports = mongoose.model('{modelName}', {schemaName});
