$(document).ready(function() {

	var contactsArray = [];

	$('.chosen-select').on('change', function() {
		for (var i = 0; i < contacts.length; i++)
			if ($(this).val() == contacts[i].id) {
				var contact = contacts[i];
				contactsArray.push(contacts[i].id);
			}
				

		$('#contactContainer').append('<div class="col-lg-4 removeContact" style="height: 215px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + contact.name + '</strong></h3><h4>' + contact.emails.email1 + '</h4><address>' + contact.addresses.address1 + '<br><abbr title="Phone">P:</abbr>' + contact.phoneNumbers.phoneNumber1 + '</address></div><div class="clearfix"></div></div></div>');
	});

	$("#contactContainer").on('mouseover', '.contact-box', function(){
	    $(this).css("border", "3px solid red");
	});

	$("#contactContainer").on('mouseout', '.contact-box', function(){
	    $(this).css("border", "1px solid #e7eaec");
	});

	$('#contactContainer').on('click', '.removeContact', function() {
		console.log('clickity clack');
		$(this).remove();
	});

	$('#submitJob').on('click', function() {
		var jobName = $('#jobName').val();
		var jobDescription = $('#description').val();
		var owner = $('#owner').attr('name');
		var recipients = contactsArray;
		var jobNumber = $('#jobNumber').val();
		var revenue = $('#revenue').val();
		var desiredMargin = $('#desiredMargin').val();
		var street1 = $('#street1').val();
		var street2 = $('#street2').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var zipCode = $('#zipCode').val();

		var address = street1 + ', ' + city + ', ' + state + ' ' + zipCode;

		$.post('/job/create?name=' + jobName + '&description=' + jobDescription + '&owner=' + owner + '&recipients=' + recipients + '&jobNumer=' + jobNumber + '&amount=' + revenue + '&desiredMargin=' + desiredMargin + '&address=' + address);
	});

});