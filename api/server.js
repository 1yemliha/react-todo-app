// api/server.js
// ... (jsonServer require ve server.create() kısmı)

// CORS middleware'i EKLEDİĞİNİZDEN EMİN OLUN
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // OPTIONS isteği (preflight) için 200 yanıtı
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

server.use(middlewares);
server.use(router);

// ... (module.exports kısmı)