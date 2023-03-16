if( $("#txtUsername").val() == "" || $("#txtPassword").val() == "" ) {

    alertWrong.text("Preencha os campos..!");
    return;
  }

  let user = {
    name: $("#txtUsername").val(),
    email: $("#txtUsername").val(),
    password: $("#txtPassword").val()
  }



  request.done((msg)=>{
    // alert("done")
    // $("#log").text(msg);

    alertWrong
      .removeClass("alert-danger")
      .addClass("alert-success")
      .text("Success!")
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });

      window.location.href = "index.html?userId=" + user.id;
      return true;
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



  // var request = $.ajax({
  //   url: 'http://127.0.0.1:5000/',
  //   method: 'GET',
  // })


  var request = $.ajax({
    url: url,
    type: "POST",
    data: {
      name: name,
      password: password
    },
    dataType: "json",
    // success: function(data){
    //   console.log(data);
    // }
  }).fail((jqXHR, textStatus) => {
    alert("Falha no login")
  });


  request.done((data)=>{
    alertWrong
      .removeClass("alert-danger")
      .addClass("alert-success")
      .text("Success!")
      .fadeIn(timeIn, function () {
        alertWrong.fadeOut(timeOut);
      });
    
      // window.location.href = "index.html?userId=" + user.id;
  })