$(document).ready(function() {
	$(document).on('click', '.sendSMS', function(e) {
		var toNumber = $(this).attr('name');
		toNumber = toNumber.slice(2, 12);
		console.log(toNumber);
		$.post('/touch/outboundSMS?toNumber=' + toNumber + '&body=' + $('#smsBody').val() + '&fromPost=true', function ( touch ) {
          		console.log(touch);

          		var htmlString = '<div class="timeline-item"><div class="row"><div class="col-xs-3 date">';

          		
                htmlString += '<i class="fa fa-arrow-up"></i>+1' + toNumber + '<br><small class="text-navy">Created by:<br>You</small>'; 
              
                htmlString += '</div><div class="col-xs-7 content no-top-border"><p class="m-b-xs"><strong>Message</strong></p>';

                htmlString += '<p>' + $('#smsBody').val() + '</p></div></div></div>';

                $('#smsBody').val('');
          		$('#timeLine').prepend(htmlString);
                    
     
         });
	});

});