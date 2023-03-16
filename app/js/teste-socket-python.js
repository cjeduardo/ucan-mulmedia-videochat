


const socketPy = io(URL_SERVER);

socketPy.on("connect", () => {
  console.log("Connected to server flask python..!");
});


socketPy.on("my response", (data) => {
    console.log(data);  
    console.log("Connected to server flask python on JS..!");
})