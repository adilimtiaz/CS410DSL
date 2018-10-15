module.exports = (mongoURI, routeNames) => {
    if (routeNames && Array.isArray(routeNames) && routeNames.length == 0){
        throw new Error('Error, no routes provided');
    }

    let requireString = ``;
    for(let i = 0; Array.isArray(routeNames) && i < routeNames.length; i++){
        requireString += `app.use('/',require('./routes/${routeNames[i]}.js'));\n\t`;
    }

    return `
    const express = require('express');
    const mongoose = require('mongoose');

    // Connect to MongoDB instance
    mongoose.connect("${mongoURI}");

    const app = express();

    // Import Server Routes Here
    ${requireString}
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,() => {
        console.log("Server listening on port: " + PORT);
    });
    `;
};

