// api/server.js

const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const path = require('path'); // Node.js 'path' modülünü ekliyoruz

// db.json dosyasının yolunu, mevcut dizine göre ayarla
const router = jsonServer.router(path.join(__dirname, 'db.json')); 

// ... (Geri kalan CORS ayarları ve server.use(middlewares) kısmı aynı kalmalı)

// CORS ayarları (Daha önce eklediğimiz)
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

server.use(middlewares);
server.use(router);

module.exports = server;