const mongoose = require('mongoose');

// connect to db
mongoose.connect('mongodb://127.0.0.1/blindsbeta', {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("DB connection established"))
    .catch(err => console.log("DB connection error", err));