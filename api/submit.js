import axios from 'axios';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas aceitar POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    // URL do backend
    const backendUrl = 'http://45.178.181.60:5000/submit';
    
    console.log(`Proxy: ${req.method} ${backendUrl}`);
    console.log('Body:', req.body);
    
    // Fazer a requisição para o backend
    const response = await axios({
      method: 'POST',
      url: backendUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log('Resposta do backend:', response.data);

    // Retornar a resposta do backend
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Erro no proxy:', error.message);
    
    // Retornar erro mais amigável
    if (error.response) {
      // Erro do backend
      res.status(error.response.status).json({
        error: 'Erro no servidor',
        message: error.response.data?.message || 'Erro interno do servidor'
      });
    } else if (error.code === 'ECONNREFUSED') {
      // Backend não está disponível
      res.status(503).json({
        error: 'Serviço indisponível',
        message: 'O servidor de votação está temporariamente indisponível'
      });
    } else if (error.code === 'ETIMEDOUT') {
      // Timeout
      res.status(504).json({
        error: 'Timeout',
        message: 'A requisição demorou muito para responder'
      });
    } else {
      // Erro genérico
      res.status(500).json({
        error: 'Erro interno',
        message: 'Ocorreu um erro inesperado'
      });
    }
  }
} 