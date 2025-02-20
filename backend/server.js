const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Inicializar Firebase Admin SDK con las credenciales
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Ruta para enviar una notificación
app.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ success: false, message: 'Faltan datos en la petición' });
    }

    const message = {
        notification: {
            title,
            body,
        },
        token,
    };

    try {
        await admin.messaging().send(message);
        res.status(200).json({ success: true, message: 'Notificación enviada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de notificaciones funcionando 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
