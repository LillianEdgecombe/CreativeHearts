const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/src', express.static('src'));
// Allow access to node_modules for local phaser if needed
app.use('/node_modules', express.static('node_modules'));

const SAVE_PATH = path.join(__dirname, 'data', 'save.json');

app.get('/api/load', async (req, res) => {
    try {
        const data = await fs.readFile(SAVE_PATH, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'No save data found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post('/api/save', async (req, res) => {
    try {
        await fs.mkdir(path.dirname(SAVE_PATH), { recursive: true });
        await fs.writeFile(SAVE_PATH, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
