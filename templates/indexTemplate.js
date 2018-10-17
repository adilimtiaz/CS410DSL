const express = require('express');
const mongoose = require('mongoose');
//require('./models/Users');
//require('./services/passport');


mongoose.connect({mongoURI});

const app = express();

app.get('/', (req, res) => {
   res.send("This is the best sample base project ever");
});

//require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
