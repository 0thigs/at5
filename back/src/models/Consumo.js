const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Servico = require('./Servico');

const Consumo = sequelize.define('Consumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Cliente.hasMany(Consumo);
Consumo.belongsTo(Cliente);
Servico.hasMany(Consumo);
Consumo.belongsTo(Servico);

module.exports = Consumo;