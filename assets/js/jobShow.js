$(document).ready(function() {
	$(document).on('click', '#sendSMS', function(e) {
    
		$.post('/touch/outboundJobSMS?toNumber=' + $('#touchRecipient').val() + '&body=' + $('#touchBody').val() + '&fromPost=true&contactId=' + $('#touchRecipient').val() + '&jobId=' + $(this).attr('name'), function ( message ) {
      		console.log(message);

          var htmlString = '<div class="feed-element"><img alt="image" class="img-circle" src="/images/default-avatar.png"><div class="media-body"><strong>' + $( "#touchRecipient option:selected" ).text() + '</strong><br><div class="well"><i class="fa fa-mobile"></i> ' + $('#touchBody').val() + '</div></div></div>';

            $('#touchBody').val('');
      		$('.feed-activity-list').prepend(htmlString);
     });
	});

  $(document).on('click', '#sendEmail', function(e) {
    
    $.post('/touch/sendEmail?fromEmail=' + fromEmail + '&body=' + $('#touchBody').val() + '&subject=New Message for ' + jobName + '&toName=' + $( "#touchRecipient option:selected" ).text() + '&toEmail=' + $( "#touchRecipient option:selected" ).attr('name') + '&jobId=' + $(this).attr('name'), function ( message ) {
          console.log(message);

          var htmlString = '<div class="feed-element"><img alt="image" class="img-circle" src="/images/default-avatar.png"><div class="media-body"><strong>' + $( "#touchRecipient option:selected" ).text() + '</strong><br><div class="well"><i class="fa fa-file-o"></i> ' + $('#touchBody').val() + '</div></div></div>';

            $('#touchBody').val('');
          $('.feed-activity-list').prepend(htmlString);
     });
  });

  //if (userRole == 'concierge' || userRole == 'superUser') {
    //Allow editing 

    $(document).on('click', '#status', function(e) {
      $('#statusModal').modal('show');  
    });

    $(document).on('click', ".statusOption", function(e) {
      console.log($(this).attr('name'));

      $('#statusModal').modal('hide');
    });
  //}
});