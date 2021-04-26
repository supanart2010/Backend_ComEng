const express = require('express');
const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://Tarm:Tarm123@cluster0.0a1dx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true}) //async function
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));
