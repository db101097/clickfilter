$('#openDrawer').click(function() {
    console.log("drawer opened")
    document.getElementById("mySidenav").style.width = "250px";
});

$('#closeDrawer').click(function() {
    console.log("drawer closed")
    document.getElementById("mySidenav").style.width = "0";
});

$('#login').on('show.bs.modal', function (event) {
    var modal = $(this)
    modal.find('.modal-title').text('Adding a new album..')
})

$('#signup').on('show.bs.modal', function (event) {
    var modal = $(this)
    modal.find('.modal-title').text('Adding a new album..')
  })