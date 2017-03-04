$(document).ready(function(){
	var $input_submit=$('.input_submit');

	$input_submit.on('click', function(e){
		e.preventDefault();
		alert(1);
	});

})