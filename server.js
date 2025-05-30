
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('set username', username => {
        socket.username = username || `User_${socket.id.slice(0, 5)}`;
    });

    socket.on('chat message', msg => {
        io.emit('chat message', {
            user: socket.username || `User_${socket.id.slice(0, 5)}`,
            message: msg,
            socketId: socket.id
        });
    });

    socket.on('file upload', file => {
        io.emit('file upload', {
            user: socket.username || `User_${socket.id.slice(0, 5)}`,
            ...file
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
