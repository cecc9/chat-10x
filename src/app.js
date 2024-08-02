import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
// import {
//     callSendAPI,
//     handleMessage,
//     handlePostback,
// } from './utils/handleMessage.js';
import { PAGE_ACCESS_TOKEN, VERIFY_TOKEN } from './utils/credentials.js';

const app = express();
// app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello Test!',
    });
});

// Endpoint para la verificación del webhook
app.get('/webhook/facebook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('mode', mode);
    console.log('token', token);
    console.log('challenge', challenge);

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Endpoint para recibir mensajes
// Manejo de mensajes
app.post('/webhook/facebook', (req, res) => {
    let body = req.body;

    console.log('antes de la condicional');

    if (body.object === 'page') {
        console.log('entrando a la condicional');

        body.entry.forEach(function (entry) {
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);

            let senderPsid = webhookEvent.sender.id;
            if (webhookEvent.message) {
                console.log('esta entrando aca ??');
                console.log('Mensaje recibido:', webhookEvent.message);

                handleMessage(senderPsid, webhookEvent.message);
            }
        });
        res.status(200).send('EVENTO RECIBIDO');
    } else {
        res.sendStatus(404);
    }
});

function handleMessage(senderPsid, receivedMessage) {
    let response;

    if (receivedMessage.text) {
        response = {
            text: `Has enviado el mensaje: "${receivedMessage.text}"`,
        };
    }

    callSendAPI(senderPsid, response);
}

function callSendAPI(senderPsid, response) {
    let requestBody = {
        recipient: {
            id: senderPsid,
        },
        message: response,
    };

    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: requestBody,
        },
        (err, res, body) => {
            if (!err) {
                console.log('Mensaje enviado!');
            } else {
                console.error('No se pudo enviar el mensaje:' + err);
            }
        }
    );
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
