$(document).ready(function() {
	$(document).on('click', '#sendSMS', function(e) {
    
		$.post('/touch/outboundJobSMS?toNumber=' + $('#touchRecipient').val() + '&body=' + $('#touchBody').val() + '&fromPost=true&contactId=' + $('#touchRecipient').val() + '&jobId=' + $(this).attr('name'), function ( message ) {
      		console.log(message);

          var htmlString = '<div class="feed-element"><img alt="image" class="img-circle" src="/images/default-avatar.png"><div class="media-body"><strong>' + $( "#touchRecipient option:selected" ).text() + '</strong><br><div class="well"><i class="fa fa-mobile"></i> ' + $('#touchBody').val() + '</div></div></div>'

            $('#touchBody').val('');
      		$('.feed-activity-list').prepend(htmlString);
     });
	});

  $(document).on('click', '#sendEmail', function(e) {
    
    $.post('/touch/outboundJobSMS?toNumber=' + $('#touchRecipient').val() + '&body=' + $('#touchBody').val() + '&fromPost=true&contactId=' + $('#touchRecipient').val() + '&jobId=' + $(this).attr('name'), function ( message ) {
          console.log(message);

          var htmlString = '<div class="feed-element"><img alt="image" class="img-circle" src="/images/default-avatar.png"><div class="media-body"><strong>' + $( "#touchRecipient option:selected" ).text() + '</strong><br><div class="well"><i class="fa fa-mobile"></i> ' + $('#touchBody').val() + '</div></div></div>'

            $('#touchBody').val('');
          $('.feed-activity-list').prepend(htmlString);
     });
  });

});