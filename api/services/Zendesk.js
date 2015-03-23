var zendesk = require('node-zendesk'),
    fs      = require('fs');

var client = zendesk.createClient({ //creating client we can use to talk to Zendesk's API
  username:  'username',
  token:     'oauth_token',
  remoteUri: 'https://remote.zendesk.com/api/v2',
  oauth: true //setting oauth to true... might have to change to false should we fail to authenticate
}); 


//zendesk client should be ready to use, below is a sample API method call

module.exports = {

	createTicket: function (ticket, callback) { //send in a 'ticket' object that we'll use for ticket creation and a callback to let us know when and if the ticker was created successfully
		var ticket = { //make a JSON object to pass to Zendesk's API, these will/can be overloaded by params passed to our service method
		   "ticket":
		     {
		       "subject":"My printer is on fire!", 
		       "comment": { "body": "The smoke is very colorful." }
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
		client.tickets.list(function (err, statusList, body, responseList, resultList) {
		  if (err) {
		    console.log(err);
		    return;
		  }
		  console.log(JSON.stringify(body, null, 2, true)); //will display all tickets
		});
	}

};