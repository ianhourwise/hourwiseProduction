
/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */



  // as soon as this file is loaded, connect automatically, 
  //var socket = io.connect();
$(document).ready(function() {

  io.socket.get('/user/subscribeToAlerts');

  io.socket.get('/task/subscribeToTasks');

  io.socket.on('user', function (obj) {
      console.log(obj);
      var data = obj.data;
      $('#newAlert').html('1');
      if (data.fromTask == null)
        $('#alertsList').prepend('<li id=' + data.id + '><div><i class="fa fa-bullhorn fa-fw"></i> ' + data.message + '<span class="pull-right text-muted small"><div class="btn btn-sml"><a href="/communication/index/' + data.communicationId + '">Go</a></div><div class="btn btn-sml dismissAlert" id="req.session.User.id">Dismiss</div></span></div></li><li class="divider"></li>');
      else
        $('#alertsList').prepend('<li id=' + data.id + '><div><i class="fa fa-ticket fa-fw"></i> ' + data.message + '<span class="pull-right text-muted small"><div class="btn btn-sml"><a href="https://foundation53.zendesk.com/agent/tickets/' + communicationId + '">Go to ZD</a></div><div class="btn btn-sml dismissAlert" id="req.session.User.id">Dismiss</div></span></div></li><li class="divider"></li>');

      console.log(data.message);
  });

  io.socket.on('task', function (obj) {
    console.log(obj.data);
  });

   $(document).on('click', '#alertDropdown', function(e) {
      $('#newAlert').html('0');
   });

   $(document).on('click', '.dismissAlert', function(e) {
      var alertId = $(this).closest('li').attr('name');
      var scopedThis = this;

      $.post('/user/dismissAlert?alertId=' + alertId, function (response) {
        $(scopedThis).closest('li').remove();
        $(scopedThis).closest('.divider').remove();
      });
   });

   $(document).on('click', '.clearAll', function(e) {
      var scopedThis = this;

      $.post('/user/clearAllAlerts', function (response) {
        $(scopedThis).closest('ul').empty();
      });
   });
});


  // io.socket.get('/user/testSocket/', function(something) {
  //   console.log('did something');
  // });

  //   // Listen for the event called 'user'
  //   io.socket.on('user',function(obj){
  //     if (obj.verb == 'updated') {
  //       var previous = obj.previous;
  //       var data = obj.data;
  //       console.log('User '+previous.name+' has been updated to '+data.name);
  //     }
  //   });

  //   io.socket.get('/user/testSocket/',{name:'Walter'});


