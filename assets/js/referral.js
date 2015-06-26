
$('.closeModal').click(function() {
	$('#getInfoModal').modal('toggle');
});

$('#modalSubmit').click(function() {

	$('#getInfoModal').modal('toggle');

	$.post('/user/addReferral?id=' + userId + '&name=' + $('#modalName').val() + '&email=' + $('#modalEmail').val() + '&phoneNumber=' + $('#modalPhone').val(), function (res) {
		console.log('cool');
	});
});