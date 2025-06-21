const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

// Configuração EXTENDIDA do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Length'],
  maxAge: 86400
}));

// Middleware para pré-flight requests
app.options('*', cors());

// Sua rota /rifa-data
app.get('/rifa-data', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Página1!A2:C',
    });

    // Headers manuais para garantir CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('X-Content-Type-Options', 'nosniff');
    
    res.json(response.data.values);

  } catch (error) {
    console.error('Erro no backend:', error);
    res.status(500)
       .header('Access-Control-Allow-Origin', '*')
       .json({ 
         error: 'Erro interno',
         details: process.env.NODE_ENV === 'development' ? error.message : null
       });
  }
});