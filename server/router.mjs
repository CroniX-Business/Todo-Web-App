import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const rootDir = dirname(__dirname);

app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(join(rootDir, '/home.html'));
});

app.get('/signUp', (req, res) => {
  res.sendFile(join(rootDir, 'src/html/signUp.html'));
});

app.get('/todo', (req, res) => {
  res.sendFile(join(rootDir, 'src/html/todo.html'));
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`),
);

export {};