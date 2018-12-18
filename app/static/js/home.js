$('#openDrawer').click(function() {
    console.log("drawer opened")
    document.getElementById("mySidenav").style.width = "250px";
});

$('#closeDrawer').click(function() {
    console.log("drawer closed")
    document.getElementById("mySidenav").style.width = "0";
});

(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
})();

$('#signupModal').on('show.bs.modal', function (event) {
    var modal = $(this)
    modal.find('[data-toggle="tooltip"]').tooltip();
})

$('#password-s').focus(function(){
    $('#password-strength').css('visibility', 'visible')
})

$('#password-s').keyup(function (event) {
    var password = $("#password-s").val()
    var password_strength = 0;
    // Digit test
    if(/\d/.test(password)){
        password_strength += 10
    }
    // Lowercase test
    if(/[a-z]/.test(password)){
        password_strength += 10
    }
    // Uppercase test
    if(/[A-Z]/.test(password)){
        password_strength += 10
    }
    // Special Char test
    if(/[#?!@$%^&*-]/.test(password)){
        password_strength += 20
    }
    // Length test
    if(password.length >= 8){
        password_strength += 50
    }
    
    switch(password_strength) {
        case 0:
            $('#password-strength').css('background-color', '#e9ecef')
            $('#pw-strength-feedback').html('Password Strength')
            break;
        case 10:
            $('#password-strength').css('background-color', '#D9534F')
            $('#pw-strength-feedback').html('Weak')
            break;
        case 20:
            $('#password-strength').css('background-color', '#D9534F')
            $('#pw-strength-feedback').html('Weak')
            break;
        case 30:
            $('#password-strength').css('background-color', '#F28F3B')
            $('#pw-strength-feedback').html('Normal')
            break;
        case 40:
            $('#password-strength').css('background-color', '#F28F3B')
            $('#pw-strength-feedback').html('Normal')
            break;
        case 50:
            $('#password-strength').css('background-color', '#F2C14E')
            $('#pw-strength-feedback').html('Medium')
            break;
        case 60:
            $('#password-strength').css('background-color', '#F2C14E')
            $('#pw-strength-feedback').html('Medium')
            break;
        case 70:
            $('#password-strength').css('background-color', '#81C14B')
            $('#pw-strength-feedback').html('Fairly Strong')
            break;
        case 80:
            $('#password-strength').css('background-color', '#81C14B')
            $('#pw-strength-feedback').html('Fairly Strong')
            break;
        case 90:
            $('#password-strength').css('background-color', '#81C14B')
            $('#pw-strength-feedback').html('Fairly Strong')
        case 100:
            $('#password-strength').css('background-color', '#5FAD56')
            $('#pw-strength-feedback').html('Strong')
            break;
        default:
            break;
        }
})

$('#login-form').submit(function() {
    var login = document.getElementById('login-form')
    if(login.checkValidity() === false){
        console.log("FALSE")
    } else {
        var username = $("#username-l").val()
        var password = $("#password-l").val()
        console.log("Logging login-form\n","username:", username, "password:", password)
        $.ajax({
            url : '/login',
            type: 'POST',
            cache: false,
            data: {
                username: username,
                password: password
            },
            success:(data)=>{
                window.location.href = '/';
            },
            error:function(){
                console.log("Error.")
                console.alert("HELLO?")
            }
        })
    }
});

$('#signup-form').submit(function() {
    var signup = document.getElementById('signup-form')
    if(signup.checkValidity() === false){
        console.log("FALSE")
    } else {
        var username = $("#username-s").val()
        var password = $("#password-s").val()
        console.log("Logging signup-form\n","username:", username, "password:", password)
        $.ajax({
            url : '/signup',
            type: 'POST',
            cache: false,
            data: {
                username: username,
                password: password
            },
            success:(data)=>{
                alert("signed up!")
                window.location.href = '/profile';
            },
            error:function(){
                alert("NOT signed up!")
                console.log("Error.")
            }
        })
    }
});