// Importar las dependencias para configurar el servidor
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var initWebRoutes = require("./routes")
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// configurar el puerto y el mensaje en caso de exito
initWebRoutes(app)
app.listen((process.env.PORT || 8080), () => console.log('El servidor webhook esta escchando!'));

// Ruta de la pagina index
// app.get("/", function (req, res) {
//   res.send("Se ha desplegado de manera exitosa el CMaquera ChatBot :D!!!");
// });

// Messenger API parameters
if (!process.env.PAGE_ACCESS_TOKEN) {
  throw new Error("missing PAGE_ACCESS_TOKEN");
}
if (!process.env.VERIFICATION_TOKEN) {
  throw new Error("missing VERIFICATION_TOKEN");
}
if (!process.env.GOOGLE_PROJECT_ID) {
  throw new Error("missing GOOGLE_PROJECT_ID");
}
if (!process.env.DF_LANGUAGE_CODE) {
  throw new Error("missing DF_LANGUAGE_CODE");
}
if (!process.env.GOOGLE_CLIENT_EMAIL) {
  throw new Error("missing GOOGLE_CLIENT_EMAIL");
}
if (!process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error("missing GOOGLE_PRIVATE_KEY");
}
if (!process.env.FB_APP_SECRET) {
  throw new Error("missing FB_APP_SECRET");
}

mongoose.connect('mongodb+srv://dialogflowuser:dialogflowpass@dialogflowcluster.32aujzd.mongodb.net/chatbotDB?retryWrites=true&w=majority', (err, res) => {
  if (err) {
    return console.log("Hubo un error en la base de datos", err);
  }
  console.log("BASE DE DATOS ONLINE");
});


// app.get("/webhook/", function (req, res) {
//   if (
//     req.query["hub.mode"] === "subscribe" &&
//     req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN
//   ) {
//     res.status(200).send(req.query["hub.challenge"]);
//   } else {
//     console.error("Failed validation. Make sure the validation tokens match.");
//     res.sendStatus(403);
//   }
// });

// //for webhook facebook
// app.post("/webhook/", function (req, res) {
//   var data = req.body;
//   // Make sure this is a page subscription
//   if (data.object == "page") {
//     // Iterate over each entry
//     // There may be multiple if batched
//     data.entry.forEach(function (pageEntry) {
//       var pageID = pageEntry.id;
//       var timeOfEvent = pageEntry.time;

//       // Iterate over each messaging event
//       pageEntry.messaging.forEach(function (messagingEvent) {
//         if (messagingEvent.message) {
//           receivedMessage(messagingEvent);
//         } else {
//           console.log(
//             "Webhook received unknown messagingEvent: ",
//             messagingEvent
//           );
//         }
//       });
//     });

//     // Assume all went well.
//     // You must send back a 200, within 20 seconds
//     res.sendStatus(200);
//   }
// });



