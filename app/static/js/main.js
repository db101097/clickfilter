/* TODO
    Turn global vars into Objects.
    More error checking.
*/

// With JQuery
$(document).ready(function(){
$('.js--wp-2').waypoint(function(direction){
        $('.js--wp-2').addClass('animated bounceIn');
    },{
        offset:'80%'
    });


    $('.js--wp-3').waypoint(function(direction){
        $('.js--wp-3').addClass('animated jackInTheBox');
    },{
        offset:'50%'
    });
});

formData = new FormData();
var temp1 = document.getElementById("myimage").src; // temp strings to hold img URI
var temp2 = document.getElementById("myimage").src; 
var value = "";

// Takes .imagefile from user imput as event.
// Read image as URL -> update img on page.
// Save imageURL to formData, temp.
function showPicture(event){
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
        var img = document.getElementById("myimage")
        img.title = file.name
        img.src = e.target.result
        temp1 = e.target.result
        temp2 = e.target.result
        formData.set('img', img.src)
    };
    reader.readAsDataURL(file)
}

$('#myCarousel').on('slid.bs.carousel', function (e) {
    var ele = $('#myCarousel .carousel-indicators li.active');
    value = ele.data('value')
    onSubmit();
    console.log('target: ' + ele.data('target') + 
                ' value: ' + ele.data('value') + 
                ' slide-to: ' + ele.data('slideTo'));
})

// Takes user selection from radio buttons as event.
// passed event is the selected filter.
function onSubmit() {
    var img = document.getElementById("myimage")
    if(img.src == "" || formData.get('img') == null) {
      console.warn("No image provided")
      return;
    }
    if(value == "") {
        console.warn("Invalid value provided")
        return;
    }
    else {
      //var value = event.target.value;
      //console.log("value:", value)
      console.log("ee", value)
      formData.set('value', value);

      // backend API route for processing images.
      // http://localhost:5000/filterimg 
      // POST formData to backend, formData contains user's image, selected value.
      // receive blob and show user their filtered image.
      $.ajax({
          url : '/filterimg',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          cache: false,
          xhrFields: {
              responseType: 'blob'
          },
          success:function(data){
              let reader = new FileReader();
              reader.readAsDataURL(data)
              // console.log("POST SUCCESS.")
              reader.onload = function(e){
                  img.src = e.target.result
            };
          },
          error:function(){
              // function param should be the error response generated
              // by the backend.
              // console.log("Error.")
          }
      })
    }
}

// On mouse click DOWN show user their original image
function mHover() {
    var img = document.getElementById("myimage")
    temp2 = img.src
    img.src = temp1
    // console.log("hover")

}

// On mouse click UP show user their filtered image
function mOut() {
    var img = document.getElementById("myimage")
    img.src = temp2
    // console.log("hover OUT")
}