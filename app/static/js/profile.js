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