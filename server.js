// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const axios = require('axios');
// const FormData = require('form-data');
// require('dotenv').config();
// const cloudinary = require('./cloudinary');


// const app = express();
// app.use(express.json());

// // CORS
// const allowedOrigins = [
//   'https://ce03510-wordpress-og5g7.tw1.ru',
//   'http://127.0.0.1:5500',
//   'https://testserver-eight-olive.vercel.app',
//   'https://testserverrender.onrender.com',
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   'https://zhenua82.github.io'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

// // MySQL config
// const DATA = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// };

// // ==============================
// // 📌 GET /bd/:id —  получать одного человека по id
// // ==============================
// app.get('/bd/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const person = await HomeworkHuman.findOne({
//       where: { id: id, is_published: true },
//       attributes: ['id', 'Name', 'photo', 'telephone', 'portfolio'],
//       include: [{
//         model: HomeworkProfession,
//         as: 'profession',
//         attributes: ['title']
//       }]
//     });
//     if (!person) {
//       return res.status(404).json({ message: 'Не найдено' });
//     }
//     const formatted = {
//       id: person.id,
//       Name: person.Name,
//       photo: person.photo,
//       telephone: person.telephone,
//       portfolio: person.portfolio,
//       profession_title: person.profession?.title || ''
//     };
//     res.json({ result: formatted });
//   } catch (error) {
//     console.error('Ошибка ORM:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Работа с ОРМ:
// const { HomeworkHuman, HomeworkProfession } = require('./bd');
// // задаем связь между таблицами:
// HomeworkHuman.belongsTo(HomeworkProfession, {
//   foreignKey: 'profession_id',
//   as: 'profession' // соответствует `as` в `include`
// });

// app.post('/bd', async (req, res) => {
//   try {
//     // Получаем записи, у которых is_published = true
//     const result = await HomeworkHuman.findAll({
//       where: { is_published: true },
//       attributes: ['id', 'Name', 'photo', 'telephone', 'portfolio'],
//       include: [{
//         model: HomeworkProfession,
//         as: 'profession', // или другое имя, если в связи в модели задано `as`
//         attributes: ['title']
//       }]
//     });

//     // Формируем результат с переименованием profession -> profession_title
//     const formatted = result.map(item => ({
//       id: item.id,
//       Name: item.Name,
//       photo: item.photo,
//       telephone: item.telephone,
//       portfolio: item.portfolio,
//       profession_title: item.profession?.title || ''
//     }));

//     res.json({ message: 'Взаимодействие с БД через ORM состоялось', result: formatted });
//   } catch (error) {
//     console.error('Ошибка ORM:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // ==============================
// // 📌 POST /bdPost — приём формы
// // ==============================

// // Настройка multer для загрузки файлов
// const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//     fieldSize: 50 * 1024 * 1024
//   }
// });


// // Модифицируем существующий upload, чтобы обрабатывать и одиночное, и множественные файлы
// const uploadFields = upload.fields([
//   { name: 'photo', maxCount: 1 },
//   { name: 'portfolio', maxCount: 10 }
// ]);

// app.post('/bdPost', uploadFields, async (req, res) => {
//   console.log('req.files:', req.files);
//   console.log('req.body:', req.body);

//   const photoFile = req.files['photo']?.[0];       // Визитка
//   const portfolioFiles = req.files['portfolio'] || []; // Портфолио

//   console.log('📎 photoFile:', req.files['photo']?.[0]);


//   if (!photoFile) {
//     return res.status(400).json({ error: 'Поле photo обязательно' });
//   }

//   try {
//     // 🔻 Загружаем визитку
//     // const photoForm = new FormData();
//     // photoForm.append('file', photoFile.buffer, photoFile.originalname);

//     // const photoUploadResponse = await axios.post(
//     //   'https://ce03510-wordpress-og5g7.tw1.ru/api/upload.php',
//     //   photoForm,
//     //   { headers: photoForm.getHeaders() }
//     // );

//     // const photoFullUrl = photoUploadResponse.data?.fileUrl;
//     // const photoUrl = photoFullUrl?.split('/').slice(-1).join('/'); // '/файл'
//     // if (!photoUrl) {
//     //   return res.status(500).json({ error: 'Ошибка загрузки визитки (photo)' });
//     // }

//     // 🔻 загрузка визитки в Cloudinary
//     const uploadFromBuffer = (buffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: 'servExpress',
//             resource_type: 'image'
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         stream.end(buffer);
//       });
//     };
//     const photoUploadResp = await uploadFromBuffer(photoFile.buffer);
//     const photoPublicId = photoUploadResp.public_id;
//     const photoUrl = photoUploadResp.secure_url;

//     // 🔻 Загружаем все портфолио
//     // const uploadedPortfolioUrls = [];

//     // for (const file of portfolioFiles) {
//     //   const form = new FormData();
//     //   form.append('file', file.buffer, file.originalname);

//     //   const response = await axios.post(
//     //     'https://ce03510-wordpress-og5g7.tw1.ru/api/upload.php',
//     //     form,
//     //     { headers: form.getHeaders() }
//     //   );

//     //   if (response.data && response.data.fileUrl) {   
//     //     const relativeUrl = response.data.fileUrl.split('/').slice(-2).join('/');// 'media/файл'
//     //     const imgTag = `<img alt="" src="https://ce03510-wordpress-og5g7.tw1.ru/api/${relativeUrl}" style="height:380px; width:285px">`;
//     //     uploadedPortfolioUrls.push(imgTag);
//     //   } else {
//     //     console.log('Ошибка при создании записи в БД:', err.message);

//     //     return res.status(500).json({ error: 'Ошибка загрузки файла портфолио' });
//     //   }
//     // }

//     const uploadedPortfolioUrls = [];

//     for (const file of portfolioFiles) {
//       const uploadResp = await uploadFromBuffer(file.buffer);
//       const imgTag = `<img alt="" src="${uploadResp.secure_url}" style="height:380px; width:285px">`;
//       uploadedPortfolioUrls.push(imgTag);
//     }

//     // 🔻 Сохранение в БД через ORM
//     const name = req.body.Name || 'Без имени';
//     const telephoneRaw = req.body.telephone;
//     const telephone = telephoneRaw
//       ? `<a href="tel:${telephoneRaw}" style="color: blue;"><h5>${telephoneRaw}</h5></a>`
//       : '';
//     const professionId = req.body.profession_id || 9;
//     const speciality = req.body.speciality || '';
//     const portfolioString = uploadedPortfolioUrls.join(' ');

//     // const created = await HomeworkHuman.create({
//     //   Name: name,
//     //   photo: photoUrl,
//     //   telephone: telephone,
//     //   profession_id: professionId,
//     //   speciality: speciality,
//     //   portfolio: portfolioString,
//     //   is_published: true
//     // });

//     const created = await HomeworkHuman.create({
//       Name: name,
//       photo: photoPublicId, // ⚠️ теперь public_id
//       telephone: telephone,
//       profession_id: professionId,
//       speciality: speciality,
//       portfolio: portfolioString,
//       is_published: true
//     });

//     return res.json({
//       success: true,
//       insertedId: created.id,
//       photo: photoUrl,
//       portfolio: uploadedPortfolioUrls
//     });

//   } catch (err) {
//     console.error('Ошибка:', err);
//     return res.status(500).json({ error: 'Ошибка при загрузке изображений или записи в БД' });
//   }
// });
// // ==============================
// // 📌 POST /deletePerson — удаление человека и изображений
// // ==============================
// app.post('/deletePerson', async (req, res) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }

//   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   const { photo, portfolio } = req.body;

//   if (!photo) {
//     return res.status(400).json({ error: 'Не указано обязательное поле photo' });
//   }

//   // Удаление записи из БД через ORM:
//     try {
//     // 🔍 Найдём запись по `photo`
//     const human = await HomeworkHuman.findOne({ where: { photo } });
//     if (!human) {
//       return res.status(404).json({ error: 'Запись с таким photo не найдена' });
//     }
//     // Удаляем запись из БД
//     await human.destroy();


//     try {
//       // Удаление визитки
//       await axios.post('https://ce03510-wordpress-og5g7.tw1.ru/api/delete.php', {
//         file: `media/${photo}`
//       });

//       // Удаление изображений портфолио
//       if (portfolio) {
//         const imgUrls = [...portfolio.matchAll(/src="([^"]+)"/g)].map(match => match[1]);

//         for (const fullUrl of imgUrls) {
//           const relPath = fullUrl.split('/api/')[1]; // 'media/файл'
//           if (relPath) {
//             await axios.post('https://ce03510-wordpress-og5g7.tw1.ru/api/delete.php', {
//               file: relPath
//             });
//           }
//         }
//       }

//       res.status(200).json({ success: true, message: 'Удалено успешно' });

//     } catch (deleteError) {
//       console.error('Ошибка удаления файлов:', deleteError.message);
//       res.status(500).json({ error: 'Удаление из БД прошло, но ошибка при удалении файлов' });
//     }
//   } catch (error) {
//     console.error('Ошибка удаления:', error);
//     res.status(500).json({ error: 'Ошибка при удалении' });
//   }
// });

// // Пинг-понг для Timeweb
// app.get('/api/ping', (req, res) => {
//   console.log('Пинг от Timeweb: ' + new Date().toISOString());
//   res.send('pong!!!');
// });


// // ==============================
// // 📌 Заглушка корневой страницы
// // ==============================
// app.get('/', (req, res) => {
//   res.end('<h1>Answer from server on port 5000!!!!!!!!!!!!</h1> <a href="#">Link</a>');
// });

// // ==============================
// // 📌 Обработка всех прочих маршрутов
// // ==============================
// app.use((req, res) => {
//   res.status(404).send('<h1>404!!!</h1>');
// });

// // ==============================
// // 📌 Запуск сервера
// // ==============================
// const { sequelize } = require('./bd');

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Sequelize подключён');
//     await sequelize.sync(); // опционально
//     app.listen(5000, () => console.log('🚀 Сервер слушает порт 5000'));
//   } catch (err) {
//     console.error('❌ Ошибка при подключении к БД:', err);
//   }
// })();



const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const { sequelize, HomeworkHuman, HomeworkProfession } = require('./bd');
const cloudinary = require('./cloudinary');

const app = express();
app.use(express.json());

/* ==============================
   🔒 CORS
============================== */
const allowedOrigins = [
  'https://ce03510-wordpress-og5g7.tw1.ru',
  'http://127.0.0.1:5500',
  'https://testserver-eight-olive.vercel.app',
  'https://testserverrender.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://zhenua82.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

/* ==============================
   🔗 Связь таблиц
============================== */
HomeworkHuman.belongsTo(HomeworkProfession, {
  foreignKey: 'profession_id',
  as: 'profession'
});

/* ==============================
   📦 Multer
============================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024
  }
});

const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'portfolio', maxCount: 10 }
]);

/* ==============================
   ☁️ Cloudinary helper
============================== */
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'servExpress',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/* ==============================
   📌 GET /bd/:id
============================== */
app.get('/bd/:id', async (req, res) => {
  try {
    const person = await HomeworkHuman.findOne({
      where: { id: req.params.id, is_published: true },
      attributes: ['id', 'Name', 'photo', 'telephone', 'portfolio'],
      include: [{
        model: HomeworkProfession,
        as: 'profession',
        attributes: ['title']
      }]
    });

    if (!person) {
      return res.status(404).json({ message: 'Не найдено' });
    }

    res.json({
      result: {
        id: person.id,
        Name: person.Name,
        photo: person.photo,
        telephone: person.telephone,
        portfolio: person.portfolio,
        profession_title: person.profession?.title || ''
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   📌 POST /bd
============================== */
app.post('/bd', async (req, res) => {
  try {
    const result = await HomeworkHuman.findAll({
      where: { is_published: true },
      attributes: ['id', 'Name', 'photo', 'telephone', 'portfolio'],
      include: [{
        model: HomeworkProfession,
        as: 'profession',
        attributes: ['title']
      }]
    });

    const formatted = result.map(item => ({
      id: item.id,
      Name: item.Name,
      photo: item.photo,
      telephone: item.telephone,
      portfolio: item.portfolio,
      profession_title: item.profession?.title || ''
    }));

    res.json({ result: formatted });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   📌 POST /bdPost (Cloudinary)
============================== */
app.post('/bdPost', uploadFields, async (req, res) => {
  try {
    const photoFile = req.files['photo']?.[0];
    const portfolioFiles = req.files['portfolio'] || [];

    if (!photoFile) {
      return res.status(400).json({ error: 'photo обязателен' });
    }

    // 🔻 визитка
    const photoUpload = await uploadFromBuffer(photoFile.buffer);
    const photoPublicId = photoUpload.public_id;
    const photoUrl = photoUpload.secure_url;

    // 🔻 портфолио
    const portfolioImgs = [];

    for (const file of portfolioFiles) {
      const uploadResp = await uploadFromBuffer(file.buffer);

      const imgTag = `<img alt="" src="${uploadResp.secure_url}" style="height:380px; width:285px">`;
      portfolioImgs.push(imgTag);
    }

    const portfolioHTML = portfolioImgs.join(' ');

    // 🔻 данные
    const name = req.body.Name || 'Без имени';
    const telephone = req.body.telephone
      ? `<a href="tel:${req.body.telephone}"><h5>${req.body.telephone}</h5></a>`
      : '';

    const created = await HomeworkHuman.create({
      Name: name,
      photo: photoPublicId, // ⚠️ важно
      telephone,
      profession_id: req.body.profession_id || 9,
      speciality: req.body.speciality || '',
      portfolio: portfolioHTML,
      is_published: true
    });

    res.json({
      success: true,
      insertedId: created.id,
      photo: photoUrl,
      portfolio: portfolioImgs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

/* ==============================
   📌 POST /deletePerson
============================== */
app.post('/deletePerson', async (req, res) => {
  try {
    const { photo, portfolio } = req.body;

    if (!photo) {
      return res.status(400).json({ error: 'photo обязателен' });
    }

    const human = await HomeworkHuman.findOne({ where: { photo } });

    if (!human) {
      return res.status(404).json({ error: 'Не найдено' });
    }

    await human.destroy();

    // 🔻 удаляем визитку
    await cloudinary.uploader.destroy(photo);

    // 🔻 удаляем портфолио
    if (portfolio) {
      const urls = [...portfolio.matchAll(/src="([^"]+)"/g)].map(m => m[1]);

      for (const url of urls) {
        const file = url.split('/').pop();
        const publicId = `servExpress/${file.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

/* ==============================
   📌 ping
============================== */
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

/* ==============================
   📌 root
============================== */
app.get('/', (req, res) => {
  res.send('Server OK');
});

/* ==============================
   🚀 START
============================== */
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(5000, () => console.log('🚀 Server started'));
  } catch (err) {
    console.error(err);
  }
})();