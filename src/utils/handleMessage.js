export function handleMessage(senderPsid, receivedMessage) {
    let response;

    // Comprobar si el mensaje tiene texto
    if (receivedMessage.text) {
        // Crear la respuesta basada en el texto recibido
        response = {
            text: `Recibí tu mensaje: "${receivedMessage.text}"`,
        };
    } else if (receivedMessage.attachments) {
        // Obtener la URL de la imagen
        const attachmentUrl = receivedMessage.attachments[0].payload.url;
        response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: '¿Es esta la imagen que enviaste?',
                            subtitle: 'Haz clic en un botón para responder.',
                            image_url: attachmentUrl,
                            buttons: [
                                {
                                    type: 'postback',
                                    title: 'Sí',
                                    payload: 'YES',
                                },
                                {
                                    type: 'postback',
                                    title: 'No',
                                    payload: 'NO',
                                },
                            ],
                        },
                    ],
                },
            },
        };
    }

    // Enviar la respuesta
    callSendAPI(senderPsid, response);
}

export function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Obtener el payload del postback para determinar la respuesta
    const payload = receivedPostback.payload;

    if (payload === 'YES') {
        response = { text: 'Gracias por confirmar!' };
    } else if (payload === 'NO') {
        response = { text: 'Oh, lo siento. Intenta enviar otra imagen.' };
    }
    // Enviar la respuesta
    callSendAPI(senderPsid, response);
}

export function callSendAPI(senderPsid, response) {
    // Construir el cuerpo del mensaje para la solicitud
    const requestBody = {
        recipient: {
            id: senderPsid,
        },
        message: response,
    };

    // Enviar la solicitud a la API de Send API de Messenger
    request(
        {
            uri: 'https://graph.facebook.com/v17.0/me/messages',
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
