const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); 
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.render('index', { endereco: null, erro: null });
});

app.post('/consultar', async (req, res) => {
  const cep = req.body.cep.replace(/\D/g, '');

  try {
    const response = await fetch(`https://buscadorcep-api.up.railway.app/consultar?cep=${cep}`); 
    const data = await response.json();

    res.setHeader('Cache-Control', 'public, max-age=3600'); 
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    if (response.ok) {
      res.render('index', { endereco: data, erro: null });
    } else {
      res.render('index', { endereco: null, erro: 'CEP não encontrado' });
    }

  } catch (error) {
    console.error(error);
    res.setHeader('Cache-Control', 'public, max-age=3600'); 
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.render('index', { endereco: null, erro: 'Erro ao consultar CEP' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});