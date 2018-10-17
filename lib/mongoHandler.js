const mongoose = require('mongoose');
const fs = require('fs');
const insertIntoSchema = (projectBaseDir, projectName, schemaName, schemaFields, mongoURI) => {
    mongoose.connect(mongoURI);
    const model = require(`${projectBaseDir}/${projectName}/models/${schemaName}Schema.js`)[schemaName];
    let toCreate = new model({...schemaFields});
    return toCreate.save(function (err, createdEnity) {
        if (err) {
            return {
                message: `Error when creating ${schemaName}`,
                data: schemaFields,
                error: err
            };
        }
        console.log(JSON.stringify(createdEnity));
        return {success: true, createdEnity};
    });
};

module.exports={
    insertIntoSchema
};
