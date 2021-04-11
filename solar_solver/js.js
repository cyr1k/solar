$( "#buttonCalculate" ).on( "click", function( event ) {
    $( "#result" ).text("heyo");
});

$("#inputCapacity").on("mousemove",function(event){
    $( "#result" ).text($("#inputCapacity").val());
});
