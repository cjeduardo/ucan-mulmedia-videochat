
const querySearch = window.location.search;
const urlParams = new URLSearchParams(querySearch);

var ROOM_ID = urlParams.get('roomId') ? urlParams.get('roomId') : 22;
var USER_ID = urlParams.get('userId') ? urlParams.get('userId') : 0;
console.log(USER_ID, ROOM_ID)

var data = {
    userId: USER_ID,
    roomId: ROOM_ID
}
var i = 0, j = 0;
var connectedPeers = {};

const videoGrid = $("#video-grid");
const videoTag = document.createElement('video');
// const videoTag2 = document.createElement('video');

$(function(){
    $("#room-id").text(ROOM_ID);

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then((stream)=>{
        const div = document.createElement("div");
        addVideoStream(videoTag, stream, div);

        i++;
        peerJS.on('call', call => {
            j++;
            call.answer(stream);
            const video = document.createElement('video');
            const div = document.createElement("div");
            call.on('stream', (otherStream) => {
                addVideoStream(video, otherStream, div);
            });
        })

        // peerJS.on('call', call => {
        //     call.answer(stream);
        //     const video = document.createElement('video');
        //     // call.on('stream', (otherStream) => {
        //         addVideoStream(video, stream);
        //     // });
        // })

        socket.on("user-joined", userId => {
            // console.log(`User joined: ${userId}`);
            if( !connectedPeers[userId] )
                connectToNewUser(userId, stream);
            console.log(connectedPeers);
        });
    });
})

function goToHome(){
    window.location.href = "index.html?userId=" + USER_ID;
}

// =============== FUNCTIONS =========================
function addVideoStream(video, stream, div){
    // alert();
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", function(){
        video.play();
    });
    
    video.muted = true;

    // let div = document.createElement('div');
    let divButtons = document.createElement('div');
    let icon_call = document.createElement("i");

    let btnEndCall = document.createElement('button');
    let btnMute = document.createElement('button');

    let btnShare = document.createElement('button');
    btnMute.innerHTML = 'Som: off';
    btnMute.classList.add('btn');

    btnEndCall.classList.add('btn-end-call', 'btn');
    btnShare.classList.add('btn');
    icon_call.classList.add('pi', 'pi-phone');

    btnEndCall.append(icon_call);
    btnShare.innerHTML = 'p. tela';

    btnShare.addEventListener('click', () => {

    })

    btnMute.addEventListener('click', () => {
        if( btnMute.innerText.includes("off") )
        {
            video.muted = false;
            btnMute.innerHTML = 'Som: on';
            return;
        }
        video.muted = true;
        btnMute.innerHTML = 'Som: off';
    });

    btnEndCall.addEventListener('click', () => {
        goToHome();
    });


    video.classList.add("video-item", "col-12");
    div.classList.add("col", "col-md-6", "div-video", "d-flex", "flex-column");
    divButtons.classList.add("div-btns");

    div.append(video);
    divButtons.append(btnMute);
    divButtons.append(btnShare);
    divButtons.append(btnEndCall);
    div.append(divButtons);

    console.log("Adicionou + ", i, j);
    
    videoGrid.append(div);
    return;
}

// ===================== socket io configs ===================

peerJS.on('open', id => {
    socket.emit("join-call", data, id);
} );
socket.on("user-unjoined", userId => {
    if( connectedPeers[userId] )
        connectedPeers[userId].close();
    console.log("user-unjoined: ", userId);
})
// ============================ Conect to other user =============================

function connectToNewUser(userId, stream) {
    
    const call = peerJS.call(userId, stream);

    const div = document.createElement("div");
    const video = document.createElement('video');
  
    // addVideoStream(video, stream);
    
    call.on( 'stream', remoteStream => {
        addVideoStream(video, remoteStream, div);
        // console.log("remoteStream");
    });
  
    call.on('close', () => {
        video.remove();
        div.remove();
    });

    connectedPeers[userId] = call;
  
}