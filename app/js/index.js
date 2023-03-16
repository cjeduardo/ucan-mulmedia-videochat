
const querySearch = window.location.search;
const urlParams = new URLSearchParams(querySearch);

var USER_ID = urlParams.get('userId') ? urlParams.get('userId') : 0;

var dateElement = $("#hdate");
var timeElement = $("#htime");

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

$(function(){

    updateTime()

    setInterval(updateTime, 1000)
    
    function updateTime(){
        timeElement.text( new Date().toLocaleString("pt", { hour: 'numeric', minute: 'numeric'} ) );
        dateElement.text( new Date().toLocaleString("pt", { weekday: 'short', month: 'long', day: 'numeric'} ) );
    }

})

$("#btn-join").click(goToJoinRoom);
$("#btn-create").click(createRoom);
$("#btn-chat").click(gotoChat);

function goToJoinRoom(){
    let value = prompt("Enter room id");
    
    window.location.href = "room2.html?roomId=" + value;
    //window.location.href = "join-room.html"; // MostrarModal
}

function createRoom(){
    window.location.href = "room2.html?roomId=" + Date.now();
}

function gotoChat(){
    window.location.href = "chat.html";
}

// $.get('../views/login.html', (data)=> {
//     console.log(data);
//     $("#cc").append(data);
//     // $("#cc").remove("#login");
// })
