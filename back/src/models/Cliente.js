const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  nomeSocial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true
  },
  rgIssueDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true
  },
  cpfIssueDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Cliente;