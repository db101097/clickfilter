
// convert to angular

formData = new FormData();


function showPicture(event){
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
        var img = document.getElementById("myimage")
        img.title = file.name
        img.src = e.target.result
        temp1 = e.target.result
        formData.set('img', img.src)
    };
    reader.readAsDataURL(file)
}

function onSubmit(event) {
    var img = document.getElementById("myimage")
    if(img.src == "") {
      alert("No image provided")
    }
    else {
      var value = event.target.value;
      console.log("value:", value)
      //http://localhost:5000/hey

      formData.set('value', value);

      $.ajax({
          url : 'http://localhost:5000/hey',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          xhrFields: {
              responseType: 'blob'
          },
          success:function(data){
              let reader = new FileReader();
              reader.readAsDataURL(data)
              console.log("eeee")
              reader.onload = function(e){
                  img.src = e.target.result
            };
          },
          error:function(){
              console.log("eeeeeeEEE")
          }
      })
    }
}


var temp1 = "";
var temp2 = "";

function mDown() {
    var img = document.getElementById("myimage")
    temp2 = img.src
    img.src = temp1
    console.log("mdown")

}

function mUp() {
    var img = document.getElementById("myimage")
    img.src = temp2
    console.log("mup")
}