// Importar las dependencias para configurar el servidor
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
//libraries
const axios = require("axios");
const uuid = require("uuid");
//files
const dialogflow = require("./dialogflow");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// configurar el puerto y el mensaje en caso de exito
app.listen((process.env.PORT || 8080), () => console.log('El servidor webhook esta escchando!'));

// Ruta de la pagina index
app.get("/", function (req, res) {
    res.send("Se ha desplegado de manera exitosa el CMaquera ChatBot :D!!!");
});

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
// Facebook Webhook

// Usados para la verificacion
// app.get("/webhook", function (req, res) {
//     // Verificar la coincidendia del token
//     if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
//         // Mensaje de exito y envio del token requerido
//         console.log("webhook verificado!");
//         res.status(200).send(req.query["hub.challenge"]);
//     } else {
//         // Mensaje de fallo
//         console.error("La verificacion ha fallado, porque los tokens no coinciden");
//         res.sendStatus(403);
//     }
// });

// // Todos eventos de mesenger sera apturados por esta ruta
// app.post("/webhook", function (req, res) {
//     // Verificar si el vento proviene del pagina asociada
//     if (req.body.object == "page") {
//         // Si existe multiples entradas entraas
//         req.body.entry.forEach(function(entry) {
//             // Iterara todos lo eventos capturados
//             entry.messaging.forEach(function(event) {
//                 if (event.message) {
//                     process_event(event);
//                 }
//             });
//         });
//         res.sendStatus(200);
//     }
// });


// Funcion donde se procesara el evento
// function process_event(event){
//     // Capturamos los datos del que genera el evento y el mensaje 
//     var senderID = event.sender.id;
//     var message = event.message;
    
//     // Si en el evento existe un mensaje de tipo texto
//     if(message.text){
//         // Crear un payload para un simple mensaje de texto
//         switch(message.text){
//             case "Hola" : 
//                 message.text = "Hola, buenas tardes"
//                 break;
//             case "Informacion":
//                 message.text = "Materia: Topicos avanzados, docente: Peinado"
//                 break;
//             case "Gracias" :
//                 message.text = "Gracias a usted, que tenga un buen dia"
//                 break;
//             default :
//                 message.text = "Introduzca: 'Hola' , 'Informacion' o 'Gracias'"
//         }
//         var response = {
//             "text": message.text 
//         }
//     }
    
//     // Enviamos el mensaje mediante SendAPI
//     enviar_texto(senderID, response);
// }

// // Funcion donde el chat respondera usando SendAPI
// function enviar_texto(senderID, response){
//     // Construcicon del cuerpo del mensaje
//     let request_body = {
//         "recipient": {
//           "id": senderID
//         },
//         "message": response
//     }
    
//     // Enviar el requisito HTTP a la plataforma de messenger
//     request({
//         "uri": "https://graph.facebook.com/v2.6/me/messages",
//         "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//         "method": "POST",
//         "json": request_body
//     }, (err, res, body) => {
//         if (!err) {
//           console.log('Mensaje enviado!')
//         } else {
//           console.error("No se puedo enviar el mensaje:" + err);
//         }
//     }); 
// }

const sessionIds = new Map();

// for Facebook verification
app.get("/webhook/", function (req, res) {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN
  ) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

//for webhook facebook
app.post("/webhook/", function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object == "page") {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log(
            "Webhook received unknown messagingEvent: ",
            messagingEvent
          );
        }
      });
    });

    // Assume all went well.
    // You must send back a 200, within 20 seconds
    res.sendStatus(200);
  }
});

async function receivedMessage(event) {
  var senderId = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log(
    "Received message for user %d and page %d at %d with message:",
    senderId,
    recipientID,
    timeOfMessage
  );

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    handleEcho(messageId, appId, metadata);
    return;
  } else if (quickReply) {
    handleQuickReply(senderId, quickReply, messageId);
    return;
  }
  if (messageText) {
    //send message to dialogflow
    console.log("MENSAJE DEL USUARIO: ", messageText);
    await sendToDialogFlow(senderId, messageText);
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderId);
  }
}

// function handleMessageAttachments(messageAttachments, senderId) {
//   //for now just reply
//   sendTextMessage(senderId, "Archivo adjunto recibido... gracias! .");
// }

async function setSessionAndUser(senderId) {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, uuid.v1());
    }
  } catch (error) {
    throw error;
  }
}

// async function handleQuickReply(senderId, quickReply, messageId) {
//   let quickReplyPayload = quickReply.payload;
//   console.log(
//     "Quick reply for message %s with payload %s",
//     messageId,
//     quickReplyPayload
//   );
//   this.elements = a;
//   // send payload to api.ai
//   sendToDialogFlow(senderId, quickReplyPayload);
// }

async function handleDialogFlowAction(
  sender,
  action,
  messages,
  contexts,
  parameters
) {
  switch (action) {
    default:
      //unhandled action, just send back the text
      handleMessages(messages, sender);
  }
}

async function handleMessage(message, sender) {
  switch (message.message) {
    case "text": // text
      for (const text of message.text.text) {
        if (text !== "") {
          await sendTextMessage(sender, text);
        }
      }
      break;
    default:
      break;
  }
}


async function handleMessages(messages, sender) {
  try {
    let i = 0;
    let cards = [];
    while (i < messages.length) {
      switch (messages[i].message) {
        case "text":
          await handleMessage(messages[i], sender);
          break;
        default:
          break;
      }
      i += 1;
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendToDialogFlow(senderId, messageText) {
  sendTypingOn(senderId);
  try {
    let result;
    setSessionAndUser(senderId);
    let session = sessionIds.get(senderId);
    result = await dialogflow.sendToDialogFlow(
      messageText,
      session,
      "FACEBOOK"
    );
    handleDialogFlowResponse(senderId, result);
  } catch (error) {
    console.log("salio mal en sendToDialogflow...", error);
  }
}

function handleDialogFlowResponse(sender, response) {
  let responseText = response.fulfillmentMessages.fulfillmentText;
  let messages = response.fulfillmentMessages;
  let action = response.action;
  let contexts = response.outputContexts;
  let parameters = response.parameters;

  sendTypingOff(sender);

  if (isDefined(action)) {
    handleDialogFlowAction(sender, action, messages, contexts, parameters);
  } else if (isDefined(messages)) {
    handleMessages(messages, sender);
  } else if (responseText == "" && !isDefined(action)) {
    //dialogflow could not evaluate input.
    sendTextMessage(sender, "No entiendo lo que trataste de decir ...");
  } else if (isDefined(responseText)) {
    sendTextMessage(sender, responseText);
  }
}
// async function getUserData(senderId) {
//   console.log("consiguiendo datos del usuario...");
//   let access_token = process.env.PAGE_ACCESS_TOKEN;
//   try {
//     let userData = await axios.get(
//       "https://graph.facebook.com/v6.0/" + senderId,
//       {
//         params: {
//           access_token,
//         },
//       }
//     );
//     return userData.data;
//   } catch (err) {
//     console.log("algo salio mal en axios getUserData: ", err);
//     return {
//       first_name: "",
//       last_name: "",
//       profile_pic: "",
//     };
//   }
// }

async function sendTextMessage(recipientId, text) {
//   if (text.includes("{first_name}") || text.includes("{last_name}")) {
//     let userData = await getUserData(recipientId);
//     text = text
//       .replace("{first_name}", userData.first_name)
//       .replace("{last_name}", userData.last_name);
//   }
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: text,
    },
  };
  await callSendAPI(messageData);
}


async function sendGenericMessage(recipientId, elements) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements,
        },
      },
    },
  };

  await callSendAPI(messageData);
}


/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_on",
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_off",
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://graph.facebook.com/v6.0/me/messages",
        qs: {
          access_token: process.env.PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: messageData,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;

          if (messageId) {
            console.log(
              "Successfully sent message with id %s to recipient %s",
              messageId,
              recipientId
            );
          } else {
            console.log(
              "Successfully called Send API for recipient %s",
              recipientId
            );
          }
          resolve();
        } else {
          reject();
          console.error(
            "Failed calling Send API",
            response.statusCode,
            response.statusMessage,
            body.error
          );
        }
      }
    );
  });
}

async function receivedPostback(event) {
  var senderId = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  var payload = event.postback.payload;
  switch (payload) {
    default:
      //unindentified payload
      sendToDialogFlow(senderId, payload);
      break;
  }

  console.log(
    "Received postback for user %d and page %d with payload '%s' " + "at %d",
    senderId,
    recipientID,
    payload,
    timeOfPostback
  );
}

function isDefined(obj) {
  if (typeof obj == "undefined") {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
}

