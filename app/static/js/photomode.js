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
})

$('#photo-form').submit(function(e) {
    e.preventDefault();
    var file = $('#myimage').attr('src')
    var title = $("#photo-title").val()
    console.log(file)
    $.ajax({
        url : '/photomode/save',
        type: 'POST',
        cache: false,
        data: {
            file: file,
            title: title
        },
        success:function(data){
            alert("Photo Saved!")
            $('#savePhotoModal').modal('toggle');
        },
        error:function(){
            // function param should be the error response generated
            // by the backend.
            console.log("Error.")
        }
    })
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
      //console.log(value)
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
}

// On mouse click UP show user their filtered image
function mOut() {
    var img = document.getElementById("myimage")
    img.src = temp2
}
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .not('[href="#myCarousel"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
