const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

// Создаём сервер
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Указываем путь к db.json
const dbPath = path.join(__dirname, 'db.json');

// Проверяем, существует ли db.json
if (!fs.existsSync(dbPath)) {
  console.error('❌ db.json not found! Creating default db.json...');
  const defaultDb = {
    inspections: [
      {
        id: 1,
        buildingName: "Школа №7",
        address: "ул. Строителей, 15",
        safetyScore: 92,
        status: "Пройдена",
        date: "2025-03-20"
      },
      {
        id: 2,
        buildingName: "Бизнес-центр «Высота»",
        address: "пр. Мира, 10",
        safetyScore: 67,
        status: "Требует доработок",
        date: "2025-03-10"
      },
      {
        id: 3,
        buildingName: "Жилой комплекс «Безопасный дом»",
        address: "ул. Ленина, 5",
        safetyScore: 88,
        status: "Пройдена",
        date: "2025-03-25"
      }
    ]
  };
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  console.log('✅ Created default db.json');
}

const router = jsonServer.router(dbPath);

// CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Логирование запросов
server.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

server.use(middlewares);
server.use(router);

// Обработка ошибок
server.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ JSON Server is running on port ${PORT}`);
  console.log(`📦 API Endpoint: https://safety-buildings-api.onrender.com/inspections`);
  console.log(`🌍 Local: http://localhost:${PORT}/inspections`);
});
