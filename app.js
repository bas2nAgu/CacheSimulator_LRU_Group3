const express = require('express');
const server = express();
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const handlebars = require('express-handlebars');  
const Handlebars = require('handlebars');



server.use(express.static('public'));


const port = 3000;
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
