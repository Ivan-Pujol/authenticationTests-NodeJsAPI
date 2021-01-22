const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json())
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.get('/', (req, res) => {
  res.send({ message: "Welcome to auth test app with JWT" });
});

const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});