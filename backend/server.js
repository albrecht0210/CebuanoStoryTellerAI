const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// Built-in body parser
app.use(cors());
app.use(express.json());

// If your Node.js version is 18+, it has native fetch
const OLLAMA_URL = 'https://ce24-203-82-35-154.ngrok-free.app/api/generate';

app.post('/api/ollama/story', async (req, res) => {
    const { topic } = req.body;

    let prompt = 'Pagsulat og usa ka istorya';

    if (topic) {
        prompt = `${prompt} ${topic}`
    }

    try {
        const ollamaResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "albrecht0210/cebuano_model", // or any model you have
                prompt: prompt,
                stream: false
            }),
        });

        const data = await ollamaResponse.json();
        res.json(data);

    } catch (error) {
        console.error('Ollama API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Ollama API' });
    }
});

app.post('/api/ollama/translate', async (req, res) => {
    const { translate } = req.body;

    if (!translate) {
        return res.status(400).json({ error: 'Translate is required' });
    }

    let prompt = `Translate to English: ${translate}`;
    try {
        const ollamaResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "albrecht0210/cebuano_model", // or any model you have
                prompt: prompt,
                stream: false
            }),
        });

        const data = await ollamaResponse.json();
        res.json(data);

    } catch (error) {
        console.error('Ollama API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Ollama API' });
    }
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});
