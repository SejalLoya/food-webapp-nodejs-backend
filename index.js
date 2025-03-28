const express = require('express');
const app = express();
const port = 5003;
const cors = require("cors");   //to handle errors
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDb = require("./connection");
const routes = require("./routes");

connectDb();
app.use(cors({
    origin: ["http://localhost:5173","swiggato-react-redux-frontend.vercel.app"], // Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));
app.use(express.json());

app.options("*", cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use("/api", routes);

app.listen(port, ()=> console.log(`Server running at port ${port}`))