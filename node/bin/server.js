// const { Socket } = require('dgram');
const fs = require('fs');
const cors = require('cors');

const socketOptions = { cors: {  origin: '*' } };

const server = require('http').createServer( (req, res) => {
    res.writeHead(200);
    res.end(`{\n   server: 'localhost',\n   port: ${PORT} \n}`);
});

const io = require('socket.io')(server, socketOptions);

const PORT = process.env.PORT || 8001;

io.on( 'connection', (socket) => {
    console.log( 'Socket connected: ' + socket.id );

    socket.on( 'join-call', (data, id) => {
        socket.join(data.roomId);
        
        socket.to(data.roomId).emit("user-joined", id);
        // socket.to(data.roomId).emit("user-joined", data.userId);
        console.log("joined: ", data);

        socket.on('disconnect', () => {
            console.log('disconnected socket: ' + socket.id);
            socket.to(data.roomId).emit("user-unjoined", id);
        })
    })

    socket.join("chat");

    socket.on('send-message', (data) => {
        console.log(data);
        socket.to("chat").emit("receive-data", data)
    });
    
});

server.listen(PORT, ()=> {
    console.log(`listening on http://localhost:${PORT}`);
});