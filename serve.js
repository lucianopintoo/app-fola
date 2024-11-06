// server.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());

let fila = [];
let consulentes = [];

// Rota para cadastro do consulente
app.post('/cadastro', (req, res) => {
    const { nome, idade, genero, motivo } = req.body;
    const novoConsulente = { id: uuidv4(), nome, idade, genero, motivo, senha: null };
    consulentes.push(novoConsulente);
    res.json({ mensagem: 'Cadastro realizado com sucesso', consulente: novoConsulente });
});

// Rota para gerar uma senha
app.post('/gerar-senha', (req, res) => {
    const { id } = req.body; // ID do consulente
    const consulente = consulentes.find(c => c.id === id);
    if (!consulente) return res.status(404).json({ erro: 'Consulente não encontrado' });

    const senha = Math.floor(1000 + Math.random() * 9000); // Geração de senha numérica
    consulente.senha = senha;
    fila.push({ ...consulente, senha });
    res.json({ mensagem: 'Senha gerada com sucesso', senha });
});

// Rota para listar a fila de atendimento
app.get('/fila', (req, res) => {
    res.json(fila);
});

// Rota para chamar próximo consulente
app.get('/proximo', (req, res) => {
    if (fila.length === 0) return res.json({ mensagem: 'Fila vazia' });
    const proximo = fila.shift();
    res.json({ mensagem: `Próximo na fila: ${proximo.nome}`, proximo });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
