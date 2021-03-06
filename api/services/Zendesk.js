
module.exports = {

	//zendesk client should be ready to use, below is a sample API method call

	createTicket: function (ticket) { //send in a 'ticket' object that we'll use for ticket creation and a callback to let us know when and if the ticker was created successfully
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  process.env.ZENDESK_USERNAME,
		  token:     process.env.ZENDESK_TOKEN,
		  remoteUri: process.env.ZENDESK_URI,
		});

		if (ticket.mediaUrl == null)
			ticket.mediaUrl = '';

		var ticket = { //make a JSON object to pass to Zendesk's API, these will/can be overloaded by params passed to our service method
		   "ticket":
		     {
		       "subject": ticket.subject, 
		       "description": ticket.description + ' ' + ticket.mediaUrl,
		       "requester": ticket.requester,
		       "custom_fields": [
		       		{
		       			"id" : "24123756",
		       			"value": "cpc"
		       		},
		       		{
		       			"id": "25572787",
		       			"value": null
		       		},
		       		{
		       			"id": "23900657",
		       			"value": null
		       		},
		       		{
		       			"id": "25555168",
		       			"value": "1"
		       		}
		       ],
		       "tags": [
		       		"cpc"
		       ],
		       "fields": [
		       		{
		       			"id" : "24123756",
		       			"value": "cpc"
		       		},
		       		{
		       			"id": "25572787",
		       			"value": null
		       		},
		       		{
		       			"id": "23900657",
		       			"value": null
		       		},
		       		{
		       			"id": "25555168",
		       			"value": "1"
		       		}
		       ]
		     }
		 };

		client.tickets.create(ticket,  function(err, req, result) {
			console.log(err);
		  if (err) return handleError(err);
		  console.log(JSON.stringify(result, null, 2, true));
		});

		function handleError(err) {
		    console.log(err);
		    process.exit(-1);
		}
	},

	listAllTickets: function (callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI
		// });

		var client = zendesk.createClient({
		  username:  'jon@hourwise.com',
		  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		  remoteUri: 'https://foundation53.zendesk.com/api/v2'
		});

		console.log('about to call ZD for tickets');
		client.tickets.list(function (err, statusList, body, responseList, resultList) {
		  if (err) {
		    console.log(err);
		    return;
		  }
		  console.log('got tickets - ' + body.length);
		  callback(body);
		});
	},

	exportTicketsSince: function (startTime, callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI
		// });

		var client = zendesk.createClient({
		  username:  'jon@hourwise.com',
		  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		  remoteUri: 'https://foundation53.zendesk.com/api/v2'
		});

		console.log('About to export tickets... ' + startTime);

		client.tickets.export(startTime, function (err, statusList, body, responseList, resultList) {
			if (err) {
				console.log(err);
				callback([]);
			}
				

			//console.log(body.results.length);
			console.log(JSON.stringify(body));

			callback(body);
		});
	},

	listTickets: function (callback) { //pass in a callback function that'll return the list of tickets

		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  process.env.ZENDESK_USERNAME,
		  token:     process.env.ZENDESK_TOKEN,
		  remoteUri: process.env.ZENDESK_URI
		});

		// var client = zendesk.createClient({
		//   username:  'jon@hourwise.com',
		//   token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
		//   remoteUri: 'https://remote.zendesk.com/api/v2'
		// });

		// client.users.list(function (err, req, result) {
		//   if (err) {
		//     console.log(err);
		//     return;
		//   }
		//   console.log(JSON.stringify(result.map(function (user) {return user.name;}), null, 2, true));//gets the first page
		//   console.log("Total Users: "+result.length);
		// });

		// client.tickets.listRecent(function (err, ticket, tickets) {
		// 	console.log(tickets.length);
		// });

		client.tickets.list(function (err, statusList, body, responseList, resultList) {
		  if (err) {
		    console.log(err);
		    return;
		  }
		  var lastTicket = body[body.length -1];

		  //console.log(lastTicket);

		  var previousMonth = new Date();
		  previousMonth.setMonth(previousMonth.getDate() - 30);

		  var relevantTickets = [];
		  var solved = 0;
		  for (var i = 0; i < body.length; i++) {
		  	var dateString = body[i].created_at;
		  	var year = parseInt(dateString.substring(0, 4));
		  	var month = parseInt(dateString.substring(5, 7));
		  	var day = parseInt(dateString.substring(8, 11));

		  	var createdAt = new Date(year, month - 1, day); //substracting one from month because months start at 0 for date objects

		  	if (createdAt > previousMonth) 
		  		relevantTickets.push(body[i]); 	
		  }
		  callback(relevantTickets); //change to array of tickets after testing 
		});
	},

	findTicket: function (id, callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI,
		// });
		
		var client = zendesk.createClient({
			  username:  'jon@hourwise.com',
			  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
			  remoteUri: 'https://foundation53.zendesk.com/api/v2'
			});

		client.tickets.show(id, function (err, statusList, body, responseList, resultList) {
			console.log('err - ' + err);
			console.log('statusList' + statusList);
			console.log('body' + body)

			client.tickets.getComments(id, function (err, statusList, body2, responseList, resultList) {
				callback(body, body2);
			});
		});
	},

	findTickets: function (ids, bool, callback) {
		if (bool == true) {
			console.log(zendesk + '\n');
			console.log(fs + '\n');
			console.log(client + '\n');
		}
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI,
		// });
		var client = zendesk.createClient({
			  username:  'jon@hourwise.com',
			  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
			  remoteUri: 'https://foundation53.zendesk.com/api/v2'
			});
		

		client.tickets.showMany(ids, function (err, statusList, body, responseList, resultList) {
			// console.log('err - ' + err);
			// console.log('statusList' + statusList);
			console.log('body length - ' + body.length)

			callback(body);

			// client.tickets.getComments(id, function (err, statusList, body2, responseList, resultList) {
			// 	callback(body, body2);
			// });
		});
	},

	listTicketsByUserId: function (id, callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  process.env.ZENDESK_USERNAME,
		  token:     process.env.ZENDESK_TOKEN,
		  remoteUri: process.env.ZENDESK_URI,
		});

		client.tickets.listByUserRequested(id, function (err, statusList, body) {
			// console.log('err - ' + err);
			// console.log('body - ' + body);

			callback(body);
		});
	},

	getCommentsForTicket: function (id, callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	    var client = zendesk.createClient({
		  username:  process.env.ZENDESK_USERNAME,
		  token:     process.env.ZENDESK_TOKEN,
		  remoteUri: process.env.ZENDESK_URI,
		});

		client.tickets.getComments(id, function (err, statusList, body, responseList, resultList) {
			if (err) {
				//console.log('ERROR IN GET COMMENTS -----');
				callback(err, null);
			}
			
			//console.log('IN ZD SERVICE-------------' + body);	

			callback(null, body);
		});
	},

	pullOrganizations: function (callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI,
		// });
		
		var client = zendesk.createClient({
			  username:  'jon@hourwise.com',
			  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
			  remoteUri: 'https://foundation53.zendesk.com/api/v2'
			});

		client.organizations.list(function (err, statusList, body, responseList, resultList) {
			if (err)
				console.log(err);

			callback(body);
		});
	},

	getUsersForOrganization: function (id, callback) {
		var zendesk = require('node-zendesk'),
	    fs      = require('fs');

	 //    var client = zendesk.createClient({
		//   username:  process.env.ZENDESK_USERNAME,
		//   token:     process.env.ZENDESK_TOKEN,
		//   remoteUri: process.env.ZENDESK_URI,
		// });
		
		var client = zendesk.createClient({
			  username:  'jon@hourwise.com',
			  token:     'xNcP4dPcaNnumSE3ikom8hRwRLgkTfPXEa5UGouU',
			  remoteUri: 'https://foundation53.zendesk.com/api/v2'
			});

		client.users.listByOrganization(id, function (err, statusList, body, responseList, resultList) {
			if (err)
				console.log(err);

			callback(body);
		});
	}
};