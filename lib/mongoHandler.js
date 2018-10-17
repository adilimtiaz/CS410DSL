const mongoose = require('mongoose');
// const insertIntoSchema = (projectBaseDir, projectName, modelName, data, mongoURI,model,) => {
    
//     // console.log(`${projectBaseDir}/${projectName}/models/${modelName}Schema.js`);
//     // const model = require(`${projectBaseDir}/${projectName}/models/${modelName}Schema`);
//     // const model = require(`${projectBaseDir}/${projectName}/models/BTableSchema.js`);
//     // console.dir(model);
//     mongoose.connect(mongoURI,{useNewUrlParser:true});
//     let toCreate = new model({...data});
//     console.log(model);
//     return toCreate.save(function (err, createdEnity) {
//         if (err) {
//             return {
//                 message: `Error when creating ${modelName}`,
//                 data,
//                 error: err
//             };
//         }
//         return {success: true, createdEnity};
//     });
// }
const insertIntoSchema = (model, data, mongoURI, callback) => {
    mongoose.connect(mongoURI);
    //const model = require(`${projectBaseDir}/${projectName}/models/${modelName}Schema.js`);
    console.log(model);
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
}
module.exports.insertIntoSchema = insertIntoSchema;