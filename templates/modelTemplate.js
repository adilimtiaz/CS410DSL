module.exports = (schemaName, schemaFields) => {
    return `
    const mongoose = require('mongoose');
    const Schema   = mongoose.Schema;

    let schemaDefs = ${schemaFields};
    let ${schemaName} = new Schema(schemaDefs);

    module.exports = mongoose.model('${schemaName}', ${schemaName});
    `;
}