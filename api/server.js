// api/server.js

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// YENİ: CORS middleware'ini ekliyoruz
// Bu, tüm kaynaklardan (Netlify adresi dahil) gelen isteklere izin verir.
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Tüm domainlerden gelen isteklere izin ver
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // İzin verilen metodlar
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Tarayıcılar PUT/PATCH/DELETE isteklerinden önce OPTIONS isteği gönderir (preflight).
    // Bu isteklere 200 OK ile yanıt vermemiz gerekiyor.
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

server.use(middlewares);
server.use(router);

module.exports = server;