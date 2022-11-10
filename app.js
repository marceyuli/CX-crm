// Importar las dependencias para configurar el servidor
var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors')
var app = express();
var initWebRoutes = require("./routes")
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
initWebRoutes(app)
// configurar el puerto y el mensaje en caso de exito
app.listen((process.env.PORT || 8080), () => console.log('El servidor webhook esta escchando!'));

mongoose.connect('mongodb+srv://dialogflowuser:dialogflowpass@dialogflowcluster.32aujzd.mongodb.net/chatbotDB?retryWrites=true&w=majority', (err, res) => {
  if (err) {
    return console.log("Hubo un error en la base de datos", err);
  }
  try {
    console.log(res);
    res.isMaster();
    res.hostname();
    res.hostInfo();
  } catch (error) {
    console.log(error);
  }
  console.log("BASE DE DATOS ONLINE");
});