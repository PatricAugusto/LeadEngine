import express from 'express';
import { demoDashboard } from './data/demoDashboard.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/dashboard', (_request, response) => {
  response.set('Cache-Control', 'no-store');
  response.json({ ...demoDashboard, dataMode: 'demo' });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`LeadEngine API disponível em http://127.0.0.1:${port}`);
});
