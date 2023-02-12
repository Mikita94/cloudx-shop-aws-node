const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.all('/*', (req, res) => {
    const { originalUrl, method, body } = req;
    const apiName = originalUrl.split('/')[1];
    const recipientUrl = process.env[apiName];
    if (!recipientUrl) {
        res.status(502).json({ error: 'Cannot process request' });
        return;
    }
    const requestConfig = {
        method,
        url: `${recipientUrl}${originalUrl}`,
        ...(Object.keys(body || {}).length > 0 && { data: body }),
    };
    axios(requestConfig)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            const { message, response } = error;
            if (!response) {
                res.status(500).json({ error: message });
                return;
            }
            const { data, status } = response;
            res.status(status).json(data);
        });
});

app.listen(port, () => {
    console.log(`BFF service listening on port ${port}`);
});
