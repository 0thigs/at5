const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Servico = require('../models/Servico');
const Consumo = require('../models/Consumo');
const sequelize = require('../config/database');

router.post('/api/consumos', async (req, res) => {
  try {
    const { clienteId, servicoId } = req.body;
    
    if (!clienteId || !servicoId) {
      return res.status(400).json({ message: 'ClienteId e ServicoId são obrigatórios' });
    }

    const cliente = await Cliente.findByPk(clienteId);
    const servico = await Servico.findByPk(servicoId);

    if (!cliente || !servico) {
      return res.status(404).json({ message: 'Cliente ou Serviço não encontrado' });
    }

    const consumo = await Consumo.create({
      ClienteId: clienteId,
      ServicoId: servicoId,
      data: new Date()
    });

    res.status(201).json(consumo);
  } catch (err) {
    console.error('Erro ao criar consumo:', err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/clientes/top-10-consumo', async (req, res) => {
  try {
    const topClientes = await Consumo.findAll({
      attributes: [
        'ClienteId',
        [sequelize.fn('COUNT', sequelize.col('ClienteId')), 'totalConsumo']
      ],
      include: [{ model: Cliente, attributes: ['id', 'nome'] }],
      group: ['ClienteId'],
      order: [[sequelize.literal('totalConsumo'), 'DESC']],
      limit: 10
    });
    res.json(topClientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.get('/clientes/por-genero/:genero', async (req, res) => {
  try {
    const { genero } = req.params;

    // Validação básica do gênero
    const generosPermitidos = ['Masculino', 'masculino','Feminino', 'feminino', 'Outro'];
    if (!generosPermitidos.includes(genero)) {
      return res.status(400).json({ error: 'Gênero inválido' });
    }

    const clientes = await Cliente.findAll({
      where: { genero: genero }
    });

    if (clientes.length === 0) {
      return res.status(404).json({ message: 'Nenhum cliente encontrado para o gênero informado.' });
    }

    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes por gênero' });
  }
});

router.get('/servicos/mais-consumidos', async (req, res) => {
  try {
    const servicosMaisConsumidos = await Consumo.findAll({
      attributes: [
        'ServicoId',
        [sequelize.fn('COUNT', sequelize.col('ServicoId')), 'totalConsumo']
      ],
      include: [{ model: Servico, attributes: ['id', 'nome'] }],
      group: ['ServicoId'],
      order: [[sequelize.literal('totalConsumo'), 'DESC']]
    });
    res.json(servicosMaisConsumidos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços mais consumidos' });
  }
});

router.get('/servicos/mais-consumidos-por-genero/:genero', async (req, res) => {
  try {
    console.log("Gênero recebido:", req.params.genero);  // Log do gênero

    const servicosPorGenero = await Consumo.findAll({
      attributes: [
        'ServicoId',
        [sequelize.fn('COUNT', sequelize.col('ServicoId')), 'totalConsumo']
      ],
      include: [
        { model: Servico, attributes: ['nome'] },  // Inclui apenas o nome do serviço
        { model: Cliente, where: { genero: req.params.genero }, attributes: [] }
      ],
      group: ['ServicoId', 'Servico.id'],
      order: [[sequelize.literal('totalConsumo'), 'DESC']]
    });

    console.log("Serviços por gênero:", servicosPorGenero);  // Log da resposta

    // Verifica se há serviços encontrados e responde
   

    // Mapeia para obter uma estrutura simplificada com apenas nomeServico e totalConsumo
    const respostaSimplificada = servicosPorGenero.map(item => ({
      nomeServico: item.Servico.nome,
      totalConsumo: parseInt(item.get('totalConsumo'), 10)  // Converte o totalConsumo para número inteiro
    }));

    res.json(respostaSimplificada);
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: 'Erro ao buscar serviços por gênero' });
  }
});

router.get('/clientes/menos-consumo', async (req, res) => {
  try {
    const menosClientes = await Consumo.findAll({
      attributes: [
        'ClienteId',
        [sequelize.fn('COUNT', sequelize.col('ClienteId')), 'totalConsumo']
      ],
      include: [{ model: Cliente, attributes: ['id', 'nome'] }],
      group: ['ClienteId'],
      order: [[sequelize.literal('totalConsumo'), 'ASC']],
      limit: 10
    });
    res.json(menosClientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.get('/clientes/top5-consumo-valor', async (req, res) => {
  try {
    const topClientes = await Cliente.findAll({
      attributes: [
        'id',
        'nome',
        [
          sequelize.literal(`(
            SELECT COALESCE(SUM(Servico.valor), 0)
            FROM Consumo
            LEFT JOIN Servico ON Consumo.ServicoId = Servico.id
            WHERE Consumo.ClienteId = Cliente.id
          )`),
          'totalGasto'
        ]
      ],
      include: [{
        model: Consumo,
        attributes: [],
        required: false
      }],
      group: ['Cliente.id'],
      order: [[sequelize.literal('totalGasto'), 'DESC']],
      limit: 5,
      subQuery: false
    });

    const formattedResponse = topClientes.map(cliente => ({
      id: cliente.id,
      nome: cliente.nome,
      totalGasto: parseFloat(cliente.getDataValue('totalGasto')) || 0
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error in top5-consumo-valor:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

router.get('/servicos/menos-consumidos', async (req, res) => {
  try {
    const servicosMenosConsumidos = await Consumo.findAll({
      attributes: [
        'ServicoId',
        [sequelize.fn('COUNT', sequelize.col('ServicoId')), 'totalConsumo']
      ],
      include: [{ 
        model: Servico,
        attributes: ['id', 'nome'] 
      }],
      group: ['ServicoId', 'Servico.id', 'Servico.nome'],
      order: [[sequelize.literal('totalConsumo'), 'ASC']],
      limit: 10
    });

    res.json(servicosMenosConsumidos);
  } catch (err) {
    console.error('Error in menos-consumidos:', err);
    res.status(500).json({ error: 'Erro ao buscar serviços menos consumidos' });
  }
});

// Criação de serviço/produto
router.post('/servicos', async (req, res) => {
  try {
    const servico = await Servico.create(req.body);
    res.status(201).json(servico);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
});

// Leitura de todos os serviços
router.get('/servicos', async (req, res) => {
  try {
    const servicos = await Servico.findAll();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

// Atualização de serviço
router.put('/servicos/:id', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) {
      await servico.update(req.body);
      res.json(servico);
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
});

// Exclusão de serviço
router.delete('/servicos/:id', async (req, res) => {
  try {
    const servico = await Servico.findByPk(req.params.id);
    if (servico) {
      await servico.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir serviço' });
  }
});


router.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nome', 'genero', 'nomeSocial', 'rg', 'rgIssueDate', 'cpf', 'cpfIssueDate', 'telefone'],
      order: [['nome', 'ASC']]
    });
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Create (Criar um novo cliente)
router.post('/clientes', async (req, res) => {
  try {
    // Cria o cliente com os dados fornecidos no corpo da requisição
    const novoCliente = await Cliente.create(req.body);
    res.status(201).json(novoCliente); // Retorna o cliente recém-criado com status 201 (Created)
  } catch (error) {
    // Caso ocorra um erro, retorna status 400 com o erro
    console.error('Error adding client:', error);
    res.status(400).json({ 
      error: 'Erro ao adicionar cliente',
      details: error.message 
    });
  }
});



// Read (Listar um cliente específico por ID)
router.get('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update (Atualizar um cliente por ID)
router.put('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.update(req.body);
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete (Excluir um cliente por ID)
router.delete('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.destroy();
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


