$('#openDrawer').click(function() {
    console.log("drawer opened")
    document.getElementById("mySidenav").style.width = "250px";
});

$('#closeDrawer').click(function() {
    console.log("drawer closed")
    document.getElementById("mySidenav").style.width = "0";
});

$('#addNewPhoto').click(function() {
    console.log("Implement addNewPhoto")
});

$('.single-album').click(function() {
    var photo = $(this)
    var photo = photo.prop("innerText");
    console.log(photo)
})

$('.dropdown-item').click(function(e) {
    e.preventDefault();
    var photo_title = $(this)
    var album_id = $('#album-title').attr("name")
    photo_title = photo_title.prop("innerText");
    console.log(photo_title)
    $.ajax({
        url : '/addphoto',
        type: 'POST',
        cache: false,
        data: {
            photo_title: photo_title,
            album_id: album_id
        },
        success:function(data){
            alert(data)
            $('#photoModal').modal('toggle');
            location.reload();
        },
        error:function(){
            // function param should be the error response generated
            // by the backend.
            console.log("Error.")
        }
    })
})