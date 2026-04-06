const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Локальный JSON Server запущен`);
  console.log(`📍 http://localhost:${PORT}/inspections`);
});
