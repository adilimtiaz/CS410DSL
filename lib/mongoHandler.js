const mongoose = require('mongoose');
const fs = require('fs');
const insertIntoSchema = (projectBaseDir, projectName, schemaName, schemaFields, mongoURI) => {
    mongoose.connect(mongoURI);
    const model = require(`${projectBaseDir}/${projectName}/models/${schemaName}Schema.js`)[schemaName];
    let toCreate = new model({...schemaFields});
    return toCreate.save()
        .then((createdEntity) => {
            console.log(JSON.stringify(createdEntity));
            return {success: true, createdEntity};
        })
        .catch((err) => {
            console.error(JSON.stringify(err));
            return {
                message: `Error when creating ${schemaName}`,
                data: schemaFields,
                error: err
            };
        });
};

module.exports={
    insertIntoSchema
};
