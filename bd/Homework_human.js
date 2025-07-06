const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('Homework_human', {
    id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(9),
      allowNull: true
    },
    portfolio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(91),
      allowNull: true
    },
    is_published: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    speciality: {
      type: DataTypes.STRING(27),
      allowNull: true
    },
    profession_id: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING(81),
      allowNull: true
    }
  }, {
    tableName: 'homework_human',
    timestamps: false
  });
};
