$(document).ready(function() {

	var taskTypeArray = ['client_management', 'fupc', 'ipc', 'invoice', 'junk_spam', 'other', 'quote', 'cpc', 'hourwise', 'unmatched'];
	displayTaskData(tickets, taskTypeArray);

	function displayTaskData (tickets, taskTypeArray) {
		console.log('getting called');
		var clientManagementTickets = [];
		var fupcTickets = [];
		var ipcTickets = [];
		var invoiceTickets = [];
		var junkTickets = [];
		var otherTickets = [];
		var quoteTickets = [];
		var cpcTickets = [];
		var unmatchedTickets = [];
		var hourwiseTaskTickets = [];

		$('#taskTable').html("");



		for (var i = 0; i < tickets.length; i++) {

			if (tickets[i].zendesk.fields[0].value == 'client_management' && tickets[i].zendesk.fields[3].value != null)
				clientManagementTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'fupc' && tickets[i].zendesk.fields[3].value != null)
				fupcTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'ipc' && tickets[i].zendesk.fields[3].value != null)
				ipcTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'invoice' && tickets[i].zendesk.fields[3].value != null)
				invoiceTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'junk_spam' && tickets[i].zendesk.fields[3].value != null)
				junkTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'other' && tickets[i].zendesk.fields[3].value != null)
				otherTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'quote' && tickets[i].zendesk.fields[3].value != null)
				quoteTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'cpc' && tickets[i].zendesk.fields[3].value != null)
				cpcTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else if (tickets[i].zendesk.fields[0].value == 'hourwise' && tickets[i].zendesk.fields[3].value != null)
				hourwiseTaskTickets.push(tickets[i].zendesk.fields[3].value * 1);
			else
				unmatchedTickets.push(tickets[i].zendesk.fields[3].value * 1);
		}
		var taskArray = [];

		for (var i = 0; i < taskTypeArray.length; i++) {
			if (taskTypeArray[i] == 'client_management')
				taskArray.push(JSON.parse('{"name":"Client Management", "tickets":' + JSON.stringify(clientManagementTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'fupc')
				taskArray.push(JSON.parse('{"name":"FUPC", "tickets":' + JSON.stringify(fupcTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'ipc')
				taskArray.push(JSON.parse('{"name":"IPC", "tickets":' + JSON.stringify(ipcTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'invoice')
				taskArray.push(JSON.parse('{"name":"Invoice", "tickets":' + JSON.stringify(invoiceTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'junk_spam')
				taskArray.push(JSON.parse('{"name":"Junk/Spam", "tickets":' + JSON.stringify(junkTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'other')
				taskArray.push(JSON.parse('{"name":"Other", "tickets":' + JSON.stringify(otherTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'quote')
				taskArray.push(JSON.parse('{"name":"Quote", "tickets":' + JSON.stringify(quoteTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'cpc')
				taskArray.push(JSON.parse('{"name":"CPC", "tickets":' + JSON.stringify(cpcTickets.sort(function(a,b) {return a-b})) + '}'));
			else if (taskTypeArray[i] == 'hourwise')
				taskArray.push(JSON.parse('{"name":"Hourwise", "tickets":' + JSON.stringify(hourwiseTaskTickets.sort(function(a,b) {return a-b})) + '}'));
			else
				taskArray.push(JSON.parse('{"name":"Unmatched", "tickets":' + JSON.stringify(unmatchedTickets.sort(function(a,b) {return a-b})) + '}'));
		}
		

		var taskData = [];
		var ticksArray = [];

		for (var i = 0; i < taskArray.length; i++) {
			var sum = 0;
			var min = 0;
			var max = 0;
			var median = 0;
			var mean = 0;

			if (taskArray[i].tickets.length > 0) {
				sum = taskArray[i].tickets.reduce(function(a, b) { return a + b; });
				min = taskArray[i].tickets[0];
				max = taskArray[i].tickets[taskArray[i].tickets.length - 1];

				if (taskArray[i].tickets.length % 2 == 0)
					median = taskArray[i].tickets[taskArray[i].tickets.length / 2];
				else
					median = taskArray[i].tickets[(taskArray[i].tickets.length - 1) / 2]

				mean = (sum)/(taskArray[i].tickets.length);
			}

			taskData.push([i, sum]);
			ticksArray.push([i, taskArray[i].name]);
			
			$('#taskTable').append('<tr class="taskType" name="' + taskTypeArray[i] + '"><td>' + taskArray[i].name + '</td><td>' + taskArray[i].tickets.length + '</td><td>' + sum + '</td><td>' + min + '</td><td>' + max + '</td><td>' + median + '</td><td>' + mean + '</td></tr>');
		}

		  $.plot($("#taskGraph"), [taskData], {
		  		xaxis: {
		  			ticks: ticksArray
		  		},
		    	series: {
		        	bars: {
		            	show: true
		        	}
		    	},
		        grid: {
		            hoverable: true,
		            borderWidth: 1
		        }
			});
	}
        

	// var paint89Tickets = [];
	// var AVETickets = [];
	// var builderTickets = [];
	// var cambiumTickets = [];
	// var commonwealthTickets = [];
	// var deckTickets = [];
	// var eveDaleTickets = [];
	// var firstPlaceTickets = [];
	// var futureOneTickets = [];
	// var hourwiseTickets = [];
	// var projetTickets = [];
	// var oaklandTickets = [];
	// var outdoorTickets = [];
	// var pinnacleTickets = [];
	// var qualityTickets = [];
	// var rebuildersTickets = [];
	// var twoChicksTickets = [];
	// var depotTickets = [];
	// var noCompanyTickets = [];

	var companiesTickets = [];
	var companiesMinutes = [];

	for (var i = 0; i < companies.length; i++) {
		companiesTickets[i] = [];
		companiesMinutes[i] = [];

		var ticketCount = 0;

		for (var j = 0; j < tickets.length; j++) {
			if (companies[i].zendeskId == '34898946') {
				if (tickets[j].zendesk.organization_id == companies[i].zendeskId || tickets[j].zendesk.organization_id == '34594213' && tickets[j].zendesk.fields[3].value != null) {
					companiesTickets[i][ticketCount] = tickets[j];
					companiesMinutes[i][ticketCount] = tickets[j].zendesk.fields[3].value * 1;
					
					ticketCount++;
				}
			}
			else {
				if (tickets[j].zendesk.organization_id == companies[i].zendeskId && tickets[j].zendesk.fields[3].value != null && companies[i].zendeskId != undefined) {
					companiesTickets[i][ticketCount] = tickets[j];
					companiesMinutes[i][ticketCount] = tickets[j].zendesk.fields[3].value * 1;

					ticketCount++;
				}
			}
		}
 	}

	// for (var i = 0; i < tickets.length; i++) {

	// 	if (tickets[i].zendesk.organization_id == '34898946' || tickets[i].zendesk.organization_id == '34594213' && tickets[i].zendesk.fields[3].value != null)
	// 		paint89Tickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '41674248' && tickets[i].zendesk.fields[3].value != null)
	// 		AVETickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	if (tickets[i].zendesk.organization_id == '41955688' && tickets[i].zendesk.fields[3].value != null)
	// 		builderTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '41104057' && tickets[i].zendesk.fields[3].value != null)
	// 		cambiumTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '41674088' && tickets[i].zendesk.fields[3].value != null)
	// 		commonwealthTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '257929808' && tickets[i].zendesk.fields[3].value != null)
	// 		deckTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '251934908' && tickets[i].zendesk.fields[3].value != null)
	// 		eveDaleTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '35018897' && tickets[i].zendesk.fields[3].value != null)
	// 		firstPlaceTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '35625427' && tickets[i].zendesk.fields[3].value != null)
	// 		futureOneTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '40631486' && tickets[i].zendesk.fields[3].value != null)
	// 		hourwiseTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '41680018' && tickets[i].zendesk.fields[3].value != null)
	// 		projetTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '42381158' && tickets[i].zendesk.fields[3].value != null)
	// 		oaklandTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '42012548' && tickets[i].zendesk.fields[3].value != null)
	// 		outdoorTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '255408727' && tickets[i].zendesk.fields[3].value != null)
	// 		pinnacleTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '42928357' && tickets[i].zendesk.fields[3].value != null)
	// 		qualityTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '35029088' && tickets[i].zendesk.fields[3].value != null)
	// 		rebuildersTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '41673168' && tickets[i].zendesk.fields[3].value != null)
	// 		twoChicksTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else if (tickets[i].zendesk.organization_id == '255688067' && tickets[i].zendesk.fields[3].value != null)
	// 		depotTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// 	else
	// 		noCompanyTickets.push(tickets[i].zendesk.fields[3].value * 1);
	// }

	var companiesArray = [];

	for (var i = 0; i < companiesTickets.length; i++)
		if (companiesTickets[i].length > 0)  
			companiesArray.push(JSON.parse('{"name":"' + companies[i].name + '", "tickets":' + JSON.stringify(companiesMinutes[i].sort(function(a,b) {return a-b})) + ', "actualTickets":' + JSON.stringify(companiesTickets[i].sort(function(a,b) {return a-b})) + '}'));
	
	companiesTickets.sort(function(a,b) {return a.name - b.name});	
	// companiesArray.push(JSON.parse('{"name":"89 Paint", "tickets":' + JSON.stringify(paint89Tickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"AVE Construction", "tickets":' + JSON.stringify(AVETickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Builder Decor", "tickets":' + JSON.stringify(builderTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Cambium Tree Services", "tickets":' + JSON.stringify(cambiumTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Commonwealth Curb Appeal", "tickets":' + JSON.stringify(commonwealthTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Deck Restoration", "tickets":' + JSON.stringify(deckTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"EveDale Home Improvement", "tickets":' + JSON.stringify(eveDaleTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"First Place Painting", "tickets":' + JSON.stringify(firstPlaceTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Future One Painting", "tickets":' + JSON.stringify(futureOneTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Hourwise", "tickets":' + JSON.stringify(hourwiseTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"New Projet", "tickets":' + JSON.stringify(projetTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Oakland Masonry and Stonework", "tickets":' + JSON.stringify(oaklandTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Outdoor Lighting Perspectives", "tickets":' + JSON.stringify(outdoorTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Pinnacle Cabinetry & Design", "tickets":' + JSON.stringify(pinnacleTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Quality First Construction", "tickets":' + JSON.stringify(qualityTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Richmond Rebuilders", "tickets":' + JSON.stringify(rebuildersTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Two Chicks and a Truck", "tickets":' + JSON.stringify(twoChicksTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Windows Depot", "tickets":' + JSON.stringify(depotTickets.sort(function(a,b) {return a-b})) + '}'));
	// companiesArray.push(JSON.parse('{"name":"Unmatched Tickets", "tickets":' + JSON.stringify(noCompanyTickets.sort(function(a,b) {return a-b})) + '}'));
	displayCompanyData(companiesArray, false);
	// var companyData = [];
	// var ticksArray1 = [];

	// for (var i = 0; i < companiesArray.length; i++) {
		
	// 	var sum = 0;
	// 	var min = 0;
	// 	var max = 0;
	// 	var median = 0;
	// 	var mean = 0;

	// 	if (companiesArray[i].tickets.length > 0){
	// 		sum = companiesArray[i].tickets.reduce(function(a, b) { return a + b; });
	// 		min = companiesArray[i].tickets[0];
	// 		max = companiesArray[i].tickets[companiesArray[i].tickets.length - 1];

	// 		if (companiesArray[i].tickets.length % 2 == 0)
	// 			median = companiesArray[i].tickets[companiesArray[i].tickets.length / 2];
	// 		else
	// 			median = companiesArray[i].tickets[(companiesArray[i].tickets.length - 1) / 2]

	// 		mean = (sum)/(companiesArray[i].tickets.length);
	// 	}

	// 	companyData.push([i, sum]);
	// 	ticksArray1.push([i, companiesArray[i].name]);

	// 	$('#orgTable').append('<tr class="company" name="' + i +'"><td>' + companiesArray[i].name + '</td><td>' + companiesArray[i].tickets.length + '</td><td>' + sum + '</td><td>' + min + '</td><td>' + max + '</td><td>' + median + '</td><td>' + mean + '</td></tr>');
	// }

	// $.plot($("#companyGraph"), [companyData], {
	//   		xaxis: {
	//   			ticks: ticksArray1
	//   		},
 //        	series: {
 //            	bars: {
 //                	show: true
 //            	}
 //        	},
	//         grid: {
	//             hoverable: true,
	//             borderWidth: 1
	//         }
 //    	});

	$(document).on('click', '.company', function (e) {
		$('#orgTable').html("");

		displayCompanyData([companiesArray[$(this).attr('name')]], true);

	});

	$(document).on('click', '#clearOrg', function (e) {
		$('#orgTable').html("");

		displayCompanyData(companiesArray, false);
		displayTaskData(tickets);
		displayTicketList(tickets);
	});

	$(document).on('click', '.taskType', function (e) {
		$('#taskTable').html("");

		displayTaskData(tickets, [$(this).attr('name')]);

	});

	$(document).on('click', '#clearTasks', function (e) {
		$('#taskTable').html("");

		displayTaskData(tickets, taskTypeArray);
	});

	function displayCompanyData (companiesArray, showTickets) {
		var companyData = [];
		var ticksArray1 = [];

		for (var i = 0; i < companiesArray.length; i++) {			
			var sum = 0;
			var min = 0;
			var max = 0;
			var median = 0;
			var mean = 0;

			if (companiesArray[i].tickets.length > 0){
				sum = companiesArray[i].tickets.reduce(function(a, b) { return a + b; });
				min = companiesArray[i].tickets[0];
				max = companiesArray[i].tickets[companiesArray[i].tickets.length - 1];

				if (companiesArray[i].tickets.length % 2 == 0)
					median = companiesArray[i].tickets[companiesArray[i].tickets.length / 2];
				else
					median = companiesArray[i].tickets[(companiesArray[i].tickets.length - 1) / 2]

				mean = (sum)/(companiesArray[i].tickets.length);
			}

			companyData.push([i, sum]);
			ticksArray1.push([i, companiesArray[i].name]);

			$('#orgTable').append('<tr class="company" name="' + i +'"><td>' + companiesArray[i].name + '</td><td>' + companiesArray[i].tickets.length + '</td><td>' + sum + '</td><td>' + min + '</td><td>' + max + '</td><td>' + median + '</td><td>' + mean + '</td></tr>');

			if (showTickets) {
				displayTaskData(companiesArray[i].actualTickets);
				displayTicketList(companiesArray[i].actualTickets);
			}
			
			
				

		}

		$.plot($("#companyGraph"), [companyData], {
	  		xaxis: {
	  			ticks: ticksArray1
	  		},
        	series: {
            	bars: {
                	show: true
            	}
        	},
	        grid: {
	            hoverable: true,
	            borderWidth: 1
	        }
    	});
	}

	function displayTicketList (tickets) {
		console.log('rebuilding ticket list...');
		console.log(tickets.length);
		$('#ticketList').html("");

		for (var i = 0; i < tickets.length; i++) 
			$('#ticketList').append('<tr><td>' + tickets[i].zendesk.subject + '</td><td>' + tickets[i].zendesk.fields[3].value + '</td><td>' + tickets[i].zendesk.requester_id + '</td><td>' + tickets[i].zendesk.created_at + '</td><td>' + tickets[i].zendesk.via.channel + '</td><td> <a href="' +  tickets[i].zendesk.url + '">Go to ticket</a> </td></tr>');
	}

});