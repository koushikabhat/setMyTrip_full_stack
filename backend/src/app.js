const express = require('express');
const cors = require('cors')


const app = express();


app.use(express.json());


app.use(cors({
    origin : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5000"
    ]
})); 


// app.use(cors());

module.exports = app;
