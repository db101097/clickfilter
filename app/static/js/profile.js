$('#openDrawer').click(function() {
    console.log("drawer opened")
    document.getElementById("mySidenav").style.width = "250px";
});

$('#closeDrawer').click(function() {
    console.log("drawer closed")
    document.getElementById("mySidenav").style.width = "0";
});

$('#addNewAlbum').click(function() {
    console.log("Implement addNewAlbum")
});

$('#albumModal').on('show.bs.modal', function (event) {
    var modal = $(this)
    modal.find('.modal-title').text('Adding a new album..')
});

$('.single-album').click(function() {
    var album = $(this)
    var album_url = "/album/" + album.prop("innerText");
    window.location.href = album_url;
})

$('#album-form').submit(function(e) {
    e.preventDefault();
    var title = $("#album-title").val()
    console.log(title)
    $.ajax({
        url : '/addalbum',
        type: 'POST',
        cache: false,
        data: {
            title: title
        },
        success:function(data){
            alert(data)
            $('#albumModal').modal('toggle');
        },
        error:function(){
            // function param should be the error response generated
            // by the backend.
            console.log("Error.")
        }
    })
})