$(document).ready(function() {
	$(document).on('click', '#sendSMS', function(e) {
    console.log('Contact Id - ' + $('#touchRecipient').val());
    console.log('Job Id     - ' + $(this).attr('name'));
    console.log('Touch Body - ' + $('#touchBody').val());


		// var toNumber = $(this).attr('name');
		// toNumber = toNumber.slice(2, 12);
		// console.log(toNumber);
		$.post('/touch/outboundJobSMS?toNumber=' + toNumber + '&body=' + $('#smsBody').val() + '&fromPost=true&contactId=' + $('#touchRecipient').val() + '&jobId=' + $(this).attr('name'), function ( touch ) {
      		console.log(touch);

      		var htmlString = '<div class="timeline-item"><div class="row"><div class="col-xs-3 date">';

      		
            htmlString += '<i class="fa fa-arrow-up"></i>+1' + $( "#touchRecipient option:selected" ).text() + '<br><small class="text-navy">Created by:<br>You</small>'; 
          
            htmlString += '</div><div class="col-xs-7 content no-top-border"><p class="m-b-xs"><strong>Message</strong></p>';

            htmlString += '<p>' + $('#smsBody').val() + '</p></div></div></div>';

            $('#smsBody').val('');
      		$('.feed-activity-list').prepend(htmlString);
                
 
     });
	});

});