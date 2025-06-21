require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware para evitar erro do favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Rota principal da API
app.get('/rifa-data', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Página1!A2:C',
    });

    res.json(response.data.values);
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro ao acessar a planilha' });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('API da Rifa Funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});