
var logged_user = JSON.parse(localStorage.getItem('logged_user'));

if( !logged_user ){
    window.location.href = "login.html";
}

const HOST = "localhost";
const HOST_PROD = "www.production.com";
const PORT = 8001;
const SCHEME = "http";
const prod = false;

const URL = !prod ? `${SCHEME}://${HOST}:${PORT}` : `${SCHEME}://${HOST_PROD}`;

const socket = io(URL);


var user_to_send = {};
var users = [];
var comments = [];

$(()=>{
    var request = $.ajax({
        url: `http:127.0.0.1:8000/get-users`,
        type: "GET",
        dataType: "json",
        success: function(data){
        
          
          for (let i = 0; i < data.length; i++) {
            if( data[i].id != logged_user.id ){
                users.push(data[i])
            }
          }

        //   console.log(data);

          updateAtualUser(users[0].id);

          $("#users").append(`<li class="me-box"><button class="btn form-control">${logged_user.name}</button></li>`)
          users.forEach(element => {
            $("#users").append(`<li class="box-user"><button class="btn form-control" onclick="updateAtualUser(${element.id})">${element.name}</button></li>`)
          });
        }
      })
      
      request.fail((jqXHR, textStatus)=>{
        alert("Houve um erro ao pegar os dados..!");
        // console.log(jqXHR, textStatus);
        return false;
      });
      
})

function addComment(data){
    var request = $.ajax({
        url: `http:127.0.0.1:8000/add-comment`,
        type: "POST",
        data: data,
        dataType: "json",
        success: function(data){
            getAllComments();
        }
      })
    
      request.fail((jqXHR, textStatus)=>{
        alert("Houve um erro ao pegar os dados..!");
        // console.log(jqXHR, textStatus);
        return false;
      });
}

function getAllComments(id_sender, id_receptor){
    console.log(id_receptor);
    var request = $.ajax({
        url: `http://127.0.0.1:8000/message-chat/sender/${id_sender}/recept/${id_receptor}`,
        type: "GET",
        dataType: "json",
        success: function(data){
          comments = data;
          console.log(document);

          document.getElementById('messages').innerText = ''; 

          comments.forEach(element => {
            $("#messages").append(`<div class="${element.id_sender == logged_user.id ? "mysms" : "othersms"}">${element.message}</div>`)
        });

        //   updateMessages();
          
        }
      })
    
      request.fail((jqXHR, textStatus)=>{
        alert("Houve um erro ao pegar os dados..!");
        // console.log(jqXHR, textStatus);
        return false;
      });
}

function updateAtualUser(id){
    users.forEach( (element) =>{
        if( element.id === id )
            user_to_send = element
    } )
    // console.log(user_to_send)
    $("#atual-header").text(user_to_send.name);
    getAllComments(logged_user.id, user_to_send.id); 
}

socket.on("connect", () => {
    console.log("Connected to server..!");
});

socket.on('receive-data', function(data) {
    if( data.id_receptor == logged_user.id ){
        updateAtualUser(data.id_sender)
        addComment(data)
        getAllComments(data.id_receptor, logged_user.id)
    }
    // console.log("data receivd", data);
});


$("#btn-sender").on("click", (event) => {
    let data = {
        id_sender: logged_user.id,
        id_receptor: user_to_send.id,
        message: $("#txt-sender").val(),
    }

    socket.emit("send-message", data)
})

