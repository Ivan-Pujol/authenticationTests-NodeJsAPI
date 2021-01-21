const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());


const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Servidor iniciado na porta ${APP_PORT}`);
});