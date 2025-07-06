const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HomeworkProfession', {
    id: {
      type: DataTypes.TINYINT,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    price: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'homework_profession',
    timestamps: false,
  });
};


