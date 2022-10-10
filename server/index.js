const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_game", (game, username) => {
        socket.join(game);
        console.log(`User with username: ${username} joined game with ID ${game}`);
    });

    socket.on("leave_game", (game, username) => {
        socket.leave(game);
        console.log(`User with username: ${username} left game`);
    })

    socket.on("update_users_list", (user) => {
        io.sockets.emit('add_user', user);
    });

    socket.on("get_removed_user", (user) => {
        io.sockets.emit('remove_user', user);
    });

    socket.on('accept_canvas_data', (data, itemToReplace, gameID) => {
        socket.to(gameID).emit('receive_canvas_data', data, itemToReplace);
    });

    socket.on('accept_data', (data) => {
        socket.to(data.gameID).emit('receive_data', data);
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    })
})


server.listen(3001, () => {
    console.log('SERVER RUNNING');
})