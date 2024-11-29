const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/database');
const routes = require('./src/routes/index');

const app = express();

app.use(cors({
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
}));

app.use(bodyParser.json());

app.use(routes);

(async () => {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
  }
})();
