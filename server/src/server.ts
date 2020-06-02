import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({ ok: 1 });
})

app.listen('3000');