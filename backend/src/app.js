const express = require('express');
const cors = require('cors')


const app = express();


app.use(express.json());


app.use(cors({
    origin : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5000",
        "https://set-my-trip.vercel.app/",
        "https://set-my-trip.vercel.app",
    ]
})); 


// app.use(cors());

module.exports = app;
