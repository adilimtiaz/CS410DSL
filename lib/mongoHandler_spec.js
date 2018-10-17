const mongoose = require('mongoose');
const fs = require('fs');
const BASE_PATH = "C:/Users/Kushal K/Documents/cpsc 410";
const projectName = "MyAnimals";
const modelName = "Dog";
const data = { name: "Steve", age: 7, breed: "Lab" };

// const Schema = mongoose.Schema;

// let schemaDefs = {
//     name: String,
//     age: Number,
//     breed: String
// };
// let Dog = new Schema(schemaDefs);

// const model = mongoose.model('Dog', Dog);

function createMongoURI(mongoURI, dbUsername, dbPassword) {
    return "mongodb://" + dbUsername + ":" + dbPassword + "@" + mongoURI;
}
let mongoURI = createMongoURI("ds111963.mlab.com:11963/emaily-dev", "adilimtiaz", "password123");
const insertIntoSchema = (projectBaseDir, projectName, modelName, data, mongoURI, callback) => {
    mongoose.connect(mongoURI);
    let model = require(`${projectBaseDir}/${projectName}/models/${modelName}Schema.js`);
    // console.log(model);
    let toCreate = new model({ ...data });
    toCreate.save(function (err, createdEnity) {
        if (err) {
            return callback({
                message: `Error when creating ${modelName}`,
                data,
                error: err
            });
        }
        return callback({ success: true, createdEnity });
    });
};

console.log(insertIntoSchema(BASE_PATH, projectName, modelName, data, mongoURI,(result) => {console.log(result)}))
