const mongoose = require('mongoose');
const fs = require('fs');
const insertIntoSchema = (projectBaseDir, projectName, modelName, data, mongoURI) => {
    mongoose.connect(mongoURI);
    const model = require(`${projectBaseDir}/${projectName}/models/${modelName}Schema.js`);
    let toCreate = new model({...data});
    return toCreate.save(function (err, createdEnity) {
        if (err) {
            return {
                message: `Error when creating ${modelName}`,
                data,
                error: err
            };
        }
        return {success: true, createdEnity};
    });
}