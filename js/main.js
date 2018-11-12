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

