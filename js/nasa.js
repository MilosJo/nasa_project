var cameras = {
	curiosity:['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
	opportunity:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM'],
	spirit:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM']
};
function getRoverData(name, callback){
  $.ajax({
    url:'https://api.nasa.gov/mars-photos/api/v1/manifests/'+ name.toLowerCase()+'?api_key=Gr3St2r31hrlUI1kMV88Xi2OLbQLIK5RKRmPeTDc',
  method:'GET',
  type: 'jsonp',
}).done(function(res){
		callback(res);
		showCameras(name);
	});
};



function getRoverImages(name, callback) {
	var sol = $("#sol-selector").val();
  	$.ajax({
    	url:'https://api.nasa.gov/mars-photos/api/v1/rovers/'+ name.toLowerCase()+'/photos?sol='+ sol +'&api_key=Gr3St2r31hrlUI1kMV88Xi2OLbQLIK5RKRmPeTDc',
	  	method:'GET',
	  	type: 'jsonp',
	}).done(function(res){
		callback(res.photos);
	});
}

function showCameras(name){
	$('#cameras').empty();
	for(var i =0; i < cameras[name].length; i++){
		var span = $('<span>');
		var input = $('<input type="checkbox">');
		input.val(cameras[name][i]);
		span.text(cameras[name][i]);
		$('#cameras').append(input);
		$('#cameras').append(span);
	}
};

$(".rover").on('click', function() {
	var name = $(this).data('rover');
	$('.rover').removeClass('active');
	$(this).addClass('active');
    getRoverData(name, handleResults);
});

function handleResults(res){

  $('#total_photos').text(res.photo_manifest.total_photos);
  $('#max_sol').text(res.photo_manifest.max_sol);
  $('#landing_date').text(res.photo_manifest.landing_date);
  $('#launch_date').text(res.photo_manifest.launch_date);
  $('#name').text(res.photo_manifest.name);
  $("#sol-selector").attr('max', res.photo_manifest.max_sol);
}

getRoverData('curiosity',handleResults);


var btn = $('<button class="btn">');
btn.text('Fetch pictures');
$('#aside').append(btn);

$('.btn').on('click', function(){
	$('#container').html('<img class="loading" src="loading.gif" />');
	var rover = $('.rover.active').data('rover');
	getRoverImages(rover, function(photos) {
		$("#container").html('');
		photos.forEach(function(photo, index) {
			if(index > 15) { 
				return;
			}
			$('#container').append('<a class="rover-img-link" href="'+ photo.img_src + '"><img class="rover-img" src="' + photo.img_src + '" /></a>');
		})
		$('.rover-img-link').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
			image: {
					verticalFit: true
			},
			zoom: {
				enabled: true,
				duration: 300 // don't foget to change the duration also in CSS
			}
		});
	})
});
	
$("#sol-selector").on('change', function() {
	$("#selected_sol").text($(this).val())
})



