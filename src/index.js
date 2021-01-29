const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
//dotenv.config();

const app = express();

app.use(express.json())
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.get('/', (req, res) => {
  res.send({ message: "Welcome to auth test app with JWT" });
});
require('./app/Controller/index')(app);


const APP_PORT = process.env.APPPORT || 5000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});