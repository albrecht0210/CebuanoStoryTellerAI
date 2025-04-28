const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// Built-in body parser
app.use(cors());
app.use(express.json());

// If your Node.js version is 18+, it has native fetch
const OLLAMA_URL = 'http://localhost:11434/api/generate';

app.post('/api/ollama', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    res.json({ "key": "hiiiiiiiiii" });
    // try {
    //     const ollamaResponse = await fetch(OLLAMA_URL, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             model: "llama3", // or any model you have
    //             prompt: prompt,
    //             stream: false
    //         }),
    //     });

    //     const data = await ollamaResponse.json();
    //     res.json(data);

    // } catch (error) {
    //     console.error('Ollama API error:', error);
    //     res.status(500).json({ error: 'Failed to fetch from Ollama API' });
    // }
});

app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});
