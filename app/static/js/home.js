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

$('#login-form').submit(function() {
    var username = $("#username-l").val()
    var password = $("#password-l").val()
    console.log("Logging login-form\n","username:", username, "password:", password)
});

$('#signup').on('show.bs.modal', function (event) {
    var modal = $(this)
    modal.find('.modal-title').text('Adding a new album..')
})

$('#signup-form').submit(function() {
    var username = $("#username-s").val()
    var password = $("#password-s").val()
    console.log("Logging signup-form\n","username:", username, "password:", password)
});
