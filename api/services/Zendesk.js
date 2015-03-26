
module.exports = {

	//zendesk client should be ready to use, below is a sample API method call

	createTicket: function (ticket) { //send in a 'ticket' object that we'll use for ticket creation and a callback to let us know when and if the ticker was created successfully
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  'jon@hourwise.com',
		  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		  remoteUri: 'https://foundation53.zendesk.com/api/v2',
		});

		var ticket = { //make a JSON object to pass to Zendesk's API, these will/can be overloaded by params passed to our service method
		   "ticket":
		     {
		       "subject": ticket.subject, 
		       "description": ticket.description
		     }
		 };

		client.tickets.create(ticket,  function(err, req, result) {
		  if (err) return handleError(err);
		  console.log(JSON.stringify(result, null, 2, true));
		});

		function handleError(err) {
		    console.log(err);
		    process.exit(-1);
		}
	},

	listTickets: function (callback) { //pass in a callback function that'll return the list of tickets

		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  'jon@hourwise.com',
		  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		  remoteUri: 'https://foundation53.zendesk.com/api/v2',
		});

		// var client = zendesk.createClient({
		//   username:  'jon@hourwise.com',
		//   token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		//   remoteUri: 'https://remote.zendesk.com/api/v2'
		// });

		client.users.list(function (err, req, result) {
		  if (err) {
		    console.log(err);
		    return;
		  }
		  console.log(JSON.stringify(result.map(function (user) {return user.name;}), null, 2, true));//gets the first page
		  console.log("Total Users: "+result.length);
		});

		// client.tickets.list(function (err, statusList, body, responseList, resultList) {
		//   if (err) {
		//     console.log(err);
		//     return;
		//   }
		//   var lastTicket = body[body.length -1];
		//   console.log('Created at - ' + lastTicket.created_at + '\n' +
		//   			   'Requester - ' + lastTicket.requester_id + '\n' + 
		//   			   'Assignee - ' + lastTicket.assignee_id + '\n' + 
		//   			   'Tier - ' + lastTicket.fields[0].value + '\n' + 
		//   			   'Task - ' + lastTicket.description + '\n' +
		//   			   'Ticket Num - ' + lastTicket.id + '\n' + 
		//   			   'status - ' + lastTicket.status + '\n');
		//   //console.log(JSON.stringify(body[body.length - 1], null, 2, true)); //will display all tickets
		//   callback(null); //change to array of tickets after testing 
		//});
	}

};