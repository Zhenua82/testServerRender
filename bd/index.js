const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
// console.log(dotenv.config())
// console.log(process.env)
const sequelize = new Sequelize(
  process.env.DB_DATABASE,  // имя базы данных
  process.env.DB_USER,      // пользователь
  process.env.DB_PASSWORD,  // пароль
  {
    host: process.env.DB_HOST,   // хост (например, localhost)
    port: process.env.DB_PORT,   // порт (обычно 3306 для MySQL)
    dialect: 'mysql',            // указываем тип СУБД
    logging: false               // отключает вывод SQL-запросов в консоль
  }
);

const HomeworkHuman = require('./Homework_human')(sequelize);
const HomeworkProfession = require('./Homework_profession')(sequelize);

console.log('HomeworkHuman loaded:', !!HomeworkHuman);
console.log('HomeworkProfession loaded:', !!HomeworkProfession);

module.exports = {sequelize, HomeworkHuman, HomeworkProfession};
