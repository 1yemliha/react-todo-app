const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // db.json'ı kullan
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// Vercel'in sunucusuz fonksiyon olarak dışa aktarımı
module.exports = server;