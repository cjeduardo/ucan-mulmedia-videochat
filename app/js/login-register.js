var alertWrong = $("#login-error");

const msgUserWrong = "Senha ou usário incorrectos", timeIn = 500, timeOut = 3000;

function logar(email, password){

  let user = {
    email: email,
    password:password
  }

  var request = $.ajax({
    url: `${URL_SERVER}/login`,
    type: "POST",
    data: user,
    dataType: "json",
    success: function(data){
      user = data;
      localStorage.setItem("logged_user", JSON.stringify(user));

      alertWrong
        .removeClass("alert-danger")
        .addClass("alert-success")
        .text("Success!")
        .fadeIn(timeIn, function () {
          alertWrong.fadeOut(timeOut);
        });
      
      window.location.href = "index.html";
      return true;
    }
  })

  request.fail((jqXHR, textStatus)=>{
    alertWrong
      .removeClass("alert-success")
      .addClass("alert-danger")
      .text(msgUserWrong)
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });

    console.log(jqXHR, textStatus);

    return false;
  });
}

function login(e) {  
  // fileResult = read("/app/assets/data/users.json");
  e.preventDefault();
  if( $("#txtUsername").val() == "" || $("#txtPassword").val() == "" ) {

    alertWrong
      .removeClass("alert-success")
      .addClass("alert-danger")
      .text("Preencha todos os campos..!")
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });
    
    return false;
  }

  logar($("#txtUser").val(), $("#txtPassword").val());

}

function register(e) {
  // fileResult = read("/app/assets/data/users.json");
  e.preventDefault();
  if( $("#txtUsername").val() == "" || $("#txtPassword").val() == "" || $("#txtEmail").val() == "" ) {

    alertWrong
      .removeClass("alert-success")
      .addClass("alert-danger")
      .text("Preencha todos os campos..!")
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });
    
    return false;
  }

  let user = {
    name: $("#txtUser").val(),
    email: $("#txtEmail").val(),
    password: $("#txtPassword").val()
  }

  var request = $.ajax({
    url: `${URL_SERVER}/add-user`,
    type: "POST",
    data: user,
    dataType: "json",
    success: function(data){
      user = data;
      console.log(user);

      alertWrong
        .removeClass("alert-danger")
        .addClass("alert-success")
        .text("Usuário adicionado!")
        .fadeIn(timeIn, function () {
          alertWrong.fadeOut(timeOut, function(){
            logar($("#txtEmail").val(), $("#txtPassword").val())
            return true;
          });
        });
    }
  })

  request.fail((jqXHR, textStatus)=>{
    alertWrong
      .removeClass("alert-success")
      .addClass("alert-danger")
      .text("Erro ao adicionar usuário!")
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });

    console.log(jqXHR, textStatus);

    return false;
  });
  
}