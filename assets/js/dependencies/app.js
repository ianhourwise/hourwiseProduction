
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

  io.socket.get('/user/subscribe');

  io.socket.on('user', function (obj) {
    console.log(obj);
    var data = obj.data;
    console.log('Getting publish message from socket with id ---- '+ data.name);
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


