//by Github Copilot

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import morgan from 'morgan';

const app = express();
const dataFile = path.resolve('noten.json');

// middleware
app.use(express.json({ limit: '100kb' }));
app.use(morgan('tiny'));
app.use(express.static(path.resolve('./')));

// helper to read current array (returns [] if file missing/empty)
async function readGrades() {
  try {
    const contents = await fs.readFile(dataFile, 'utf8');
    if (!contents.trim()) return [];
    return JSON.parse(contents);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

app.post('/save', async (req, res) => {
  const data = req.body;
  // basic validation: object with string values
  if (typeof data !== 'object' || Array.isArray(data) || data === null) {
    return res.status(400).send({ error: 'invalid payload' });
  }
  try {
    const arr = await readGrades();
    arr.push(data);
    await fs.writeFile(dataFile, JSON.stringify(arr, null, 2), 'utf8');
    res.status(200).send({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'could not save' });
  }
});

app.get('/grades', async (req, res) => {
  try {
    const arr = await readGrades();
    res.json(arr);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'could not read data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
