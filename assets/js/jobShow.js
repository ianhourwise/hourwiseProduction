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


      $.post('/job/updateStatus/?id=' + jobId + '&status=' + $(this).attr('name'), function(status) {
        
        $('#statusModal').modal('hide');
        $('#statusText').html(status);

      });
    });

    $(document).on('click', '.add-task', function(e) {
      $('#newTaskForm').html('');
      $('#newTaskForm').append('<br><br><form class= "form-signin"><h2 class= "form-signin-heading">Add Task...</h2><input type= "text" class = "form-control" placeholder = "Name" name="name" id="newTaskName"><hr><input type= "text" class = "form-control" placeholder = "Description" name="description" id="newTaskDescription"><hr><input type="date" class = "form-control" placeholder = "Start Date" name="startDate" id="newTaskStartDate"><hr><input type="date" class = "form-control" placeholder = "End Date" name="endDate" id="newTaskEndDate"><hr><hr><select name="urgent" id="newTaskUrgency"><option value="false" selected>Not Urgent</option><option value="true">Urgent</option></select><hr><input class = "btn btn-lg btn-primary btn-block" value = "Create Task" id="createNewTask"/> </form>');
    });

    $(document).on('click', '#createNewTask', function(e) {
      var name = $('#newTaskName').val();
      var description = $('#newTaskDescription').val();
      var startDate = $('#newTaskStartDate').val();
      var endDate = $('#newTaskEndDate').val();

      $.post('/task/create?name=' + name + '&description=' + description + '&startDate=' + startDate + '&endDate=' + endDate + '&job=' + jobId + '&fromJobShow=true&completed=false', function(task) {
        $('#newTaskForm').html('');
        $('#tasksList').append('<li> <a href="#" class="check-link completeTask"><i class="fa fa-square-o"></i> </a><span class="m-l-xs">' + task.description + '<br>  Due: ' + task.endDate + '</span></li>');
      }); 
    });

    // $(document).on('click', '.completeTask', function(e) {
    //   console.log('clickity clack');
    //   console.log($(this).attr('name'));
    // });

    $('.completeTask').click(function() {
      console.log($(this).attr('name'));

      $.post('/task/completeTask?id=' + $(this).attr('name'));
    });

  //}
});