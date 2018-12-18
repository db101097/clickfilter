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