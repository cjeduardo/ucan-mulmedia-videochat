
const querySearch = window.location.search;
const urlParams = new URLSearchParams(querySearch);

var logged_user = JSON.parse(localStorage.getItem('logged_user'));

if( !logged_user ){
    window.location.href = "login.html";
}

var ROOM_ID = urlParams.get('roomId') ? urlParams.get('roomId') : 22;
var USER_ID = logged_user.id;
var partilha = false, muted = true; 
var localStream, sharedStream;

console.log(USER_ID, ROOM_ID)

var data = {
    userId: USER_ID,
    roomId: ROOM_ID
}

var connectedPeers = {};

const videoGrid = $("#video-grid");
const videoTag = document.createElement('video');

// const videoTag2 = document.createElement('video');

function toggleMute() {
    muted = !muted;
    videoTag.muted = muted;

    $("#mute").text( muted ? "unmute" : "mute" );

    
}

function share() { 
    partilha = !partilha;
    if( partilha ){
        $("#share").text( "Stop Share Screen" )
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            // localStream = stream;
            // console.log(localStream)
            sharedStream = stream;
            
            console.log(localStream.getTracks()[1])

            stream.getTracks()[1].onended = () => {
                partilha = !partilha;
                $("#share").text( "Share Screen" )
                if( localStream.getTracks()[1] ){
                    localStream.removeTrack(localStream.getTracks()[1]);
                }
            }
            
            var trackP = localStream.getTracks()[1];
            localStream.removeTrack(localStream.getTracks()[1]);
            localStream.addTrack(stream.getTracks()[1]);
            localStream.addTrack(trackP);

            // console.log(localStream.getTracks());
        })
    }else{
        $("#share").text( "Share Screen" )
        if( localStream.getTracks()[1] ){
            // localStream.getTracks()[1].stop();
            localStream.removeTrack(localStream.getTracks()[1]);
        }
    }

    
 }



$(function(){
    $("#room-id").text(ROOM_ID);

    
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then((stream)=>{
        const div = document.createElement("div");
        // div.append(document.getElementById("vid-controls"));
        localStream = stream;
        addVideoStream(videoTag, localStream, div);

        peerJS.on('call', call => {
            call.answer(localStream);
            const video = document.createElement('video');
            const div = document.createElement("div");
            call.on('stream', (otherStream) => {
                addVideoStream(video, otherStream, div);
            });
        })


        socket.on("user-joined", userId => {
            // console.log(`User joined: ${userId}`);
            if( !connectedPeers[userId] )
                connectToNewUser(userId, localStream);
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
    
    video.muted = muted;

    video.classList.add("video-item", "col-12");
    div.classList.add("col", "col-md-6", "div-video", "d-flex", "flex-column", "center");

    div.append(video);
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