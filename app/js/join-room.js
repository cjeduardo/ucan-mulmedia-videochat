

const querySearch = window.location.search;
const urlParams = new URLSearchParams(querySearch);

// var ROOM_ID = urlParams.get('roomId') ? urlParams.get('roomId') : 22;
var USER_ID = urlParams.get('userId') ? urlParams.get('userId') : 0;



var txtRoomId = $("#txt-room-id");

function join(e) {
    e.preventDefault();

    let roomId = txtRoomId.val();
    console.log(roomId);

    if( !roomId ){
        alert("digite o id da reuniao")
        return;
    }

    window.location.href = "room.html?roomId=" + roomId + "&userId="+USER_ID;
}