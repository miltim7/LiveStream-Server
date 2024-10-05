// server.js
const io = require('socket.io')(5001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

let broadcaster;

io.on('connection', (socket) => {
    console.log('Клиент подключился:', socket.id);

    socket.on('broadcaster', () => {
        broadcaster = socket.id;
        socket.broadcast.emit('broadcaster');
        console.log('Стример подключился:', broadcaster);
    });

    socket.on('watcher', () => {
        console.log('Новый зритель:', socket.id);
        socket.to(broadcaster).emit('watcher', socket.id);
    });

    socket.on('offer', (id, message) => {
        socket.to(id).emit('offer', socket.id, message);
    });

    socket.on('answer', (id, message) => {
        socket.to(id).emit('answer', socket.id, message);
    });

    socket.on('candidate', (id, message) => {
        socket.to(id).emit('candidate', socket.id, message);
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
        socket.to(broadcaster).emit('disconnectPeer', socket.id);
    });
});
