app.post('/webhook/facebook', (req, res) => {
    const body = req.body;

    console.log('esta entrando aqui ??');

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhookEvent = entry.messaging[0];
            console.log('Evento de webhook recibido:', webhookEvent); // Imprime el evento completo

            // Aquí puedes inspeccionar el objeto webhookEvent
            console.log('ID del remitente:', webhookEvent.sender.id);
            console.log('Mensaje recibido:', webhookEvent.message);

            // Lógica para manejar el mensaje
            if (webhookEvent.message) {
                handleMessage(webhookEvent.sender.id, webhookEvent.message);
            } else if (webhookEvent.postback) {
                handlePostback(webhookEvent.sender.id, webhookEvent.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});
