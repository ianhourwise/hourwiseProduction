$(document).ready(function() {
	$(document).on('click', '#saveChanges', function(e) {
		$.post('/company/updateMinutes?minutesPaid=' + $('#minutesPaidFor').val() + '&maxMinutes=' + $('#maxMinutesAllowed').val() + '&id=' + $('#id').val(), function (err) {
			if (err)
				console.log(err);

			console.log('success');
		});
	});
})