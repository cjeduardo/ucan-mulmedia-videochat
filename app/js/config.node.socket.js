// alert("CJ-Here");

const HOST = "localhost";
const HOST_PROD = "www.production.com";
const PORT = 8001;
const SCHEME = "http";
const prod = false;

const URL = !prod ? `${SCHEME}://${HOST}:${PORT}` : `${SCHEME}://${HOST_PROD}`;

const socket = io(URL);

socket.on("connect", () => {
  console.log("Connected to server..!");
});

// const peerJS = new Peer(undefined, {
//     host: HOST,
//     port: '8002',
//     // path: '/peerjs',
//     // secure:true,
// });

// { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]

var peerJS = new Peer({
  config: {
    'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]
  } /* Sample servers, please use appropriate ones */,
});
