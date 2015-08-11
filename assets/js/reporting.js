$(document).ready(function() {

	$(".chosen").chosen();

	var tickets = lastTickets.slice(0);

	var taskTypeArray = ['client_management', 'fupc', 'ipc', 'invoice', 'junk_spam', 'other', 'quote', 'cpc', 'hourwise', 'unmatched'];
	var removableTaskArray = ['client_management', 'fupc', 'ipc', 'invoice', 'junk_spam', 'other', 'quote', 'cpc', 'hourwise', 'unmatched'];
	var currentCompany = null;
	var currentAssignee = null;
	var currentRequester = null;

	var users = [];

	for (var i = 0; i < companies.length; i++)
		for (var j = 0; j < companies[i].employees.length; j++)
			if (companies[i].employees[j].zendeskId != undefined)
				users.push(companies[i].employees[j]);

	displayTaskData(tickets, taskTypeArray);

	function displayTaskData (tickets, taskTypeArray) {
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



		if (currentAssignee != null) {
			//filter companies by assignee
			console.log(tickets[0].zendesk.assignee_id + ' - ' + currentAssignee.zendeskId);
			var assigneeTickets = [];
			for (var i = 0; i < tickets.length; i++)
				if (tickets[i].zendesk.assignee_id == currentAssignee.zendeskId)
					assigneeTickets.push(tickets[i]);

			var tickets = [];
			console.log(assigneeTickets);
			tickets = assigneeTickets.slice(0);
		}

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

		var ticketsSum = 0;
		var minutesSum = 0;

		for (var i = 0; i < taskArray.length; i++) {
			var sum = 0;
			var min = 0;
			var max = 0;
			var median = 0;
			var mean = 0;

			ticketsSum += taskArray[i].tickets.length;

			if (taskArray[i].tickets.length > 0) {
				sum = taskArray[i].tickets.reduce(function(a, b) { return a + b; });
				min = taskArray[i].tickets[0];
				max = taskArray[i].tickets[taskArray[i].tickets.length - 1];

				if (taskArray[i].tickets.length % 2 == 0)
					median = taskArray[i].tickets[taskArray[i].tickets.length / 2];
				else
					median = taskArray[i].tickets[(taskArray[i].tickets.length - 1) / 2]

				mean = (sum)/(taskArray[i].tickets.length);

				minutesSum += sum;
			}

			taskData.push([i, sum]);
			ticksArray.push([i, taskArray[i].name]);

			
			
			$('#taskTable').append('<tr class="taskType" name="' + taskTypeArray[i] + '"><td>' + taskArray[i].name + '</td><td>' + taskArray[i].tickets.length + '</td><td>' + sum + '</td><td>' + min + '</td><td>' + max + '</td><td>' + median + '</td><td>' + mean + '</td></tr>');
		}

		$('#taskTable').append('<tr class="taskType" name="'+ '"><td>' + '<b>SUMMATIONS</b>' + '</td><td><b>' + ticketsSum + '</b></td><td><b>' + minutesSum + '</b></td></tr>');
		//console.log('total tix - ' + ticketsSum + '\ntotal min - ' + minutesSum);

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

	function displayCompanyData (companiesArray, showTickets) {
		$('#orgTable').html("");

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
				displayTaskData(companiesArray[i].actualTickets, removableTaskArray);
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

	function displayAssigneeData (companiesArray, showTickets) {
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
				displayTaskData(companiesArray[i].actualTickets, removableTaskArray);
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
		$('#ticketList').html("");

		for (var i = 0; i < tickets.length; i++) 
			$('#ticketList').append('<tr><td>' + tickets[i].zendesk.subject + '</td><td>' + tickets[i].zendesk.fields[3].value + '</td><td>' + tickets[i].zendesk.requester_id + '</td><td>' + tickets[i].zendesk.created_at + '</td><td>' + tickets[i].zendesk.via.channel + '</td><td> <a href="' +  tickets[i].zendesk.url + '">Go to ticket</a> </td></tr>');
	}

	var companiesTickets = [];
	var companiesMinutes = [];

	var assigneeTickets = [];
 	var assigneeMinutes = [];

 	var requesterTickets = [];
 	var requesterMinutes = [];

 	var companiesArray = [];
 	var assigneeArray = [];
 	var requesterArray = [];

 	sortTickets(tickets);

	function sortTickets (tickets) {
		companiesTickets = [];
		companiesMinutes = [];

		assigneeTickets = [];
	 	assigneeMinutes = [];

	 	requesterTickets = [];
	 	requesterMinutes = [];

	 	companiesArray = [];
	 	assigneeArray = [];
	 	requesterArray = [];

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

	 	for (var i = 0; i < users.length; i++) {
			assigneeTickets[i] = [];
			assigneeMinutes[i] = [];

			var ticketCount = 0;

			for (var j = 0; j < tickets.length; j++) {
				if (tickets[j].zendesk.assignee_id == users[i].zendeskId && tickets[j].zendesk.fields[3].value != null) {
					assigneeTickets[i][ticketCount] = tickets[j];
					assigneeMinutes[i][ticketCount] = tickets[j].zendesk.fields[3].value * 1;

					ticketCount++;
				}
			}
	 	}

	 	for (var i = 0; i < users.length; i++) {
			requesterTickets[i] = [];
			requesterMinutes[i] = [];

			var ticketCount = 0;

			for (var j = 0; j < tickets.length; j++) {
				if (tickets[j].zendesk.requester_id == users[i].zendeskId && tickets[j].zendesk.fields[3].value != null) {
					requesterTickets[i][ticketCount] = tickets[j];
					requesterMinutes[i][ticketCount] = tickets[j].zendesk.fields[3].value * 1;

					ticketCount++;
				}
			}
	 	}

	 	for (var i = 0; i < companiesTickets.length; i++)
			if (companiesTickets[i].length > 0)  
				companiesArray.push(JSON.parse('{"name":"' + companies[i].name + '", "tickets":' + JSON.stringify(companiesMinutes[i].sort(function(a,b) {return a-b})) + ', "actualTickets":' + JSON.stringify(companiesTickets[i].sort(function(a,b) {return a-b})) + ', "employees":' + JSON.stringify(companies[i].employees) + '}'));
		
		companiesTickets.sort(function(a,b) {return a.name - b.name});

		

		for (var i = 0; i < assigneeTickets.length; i++)
			if (assigneeTickets[i].length > 0)  
				assigneeArray.push(JSON.parse('{"name":"' + users[i].username + '", "zendeskId": ' + users[i].zendeskId + ', "tickets":' + JSON.stringify(assigneeMinutes[i].sort(function(a,b) {return a-b})) + ', "actualTickets":' + JSON.stringify(assigneeTickets[i].sort(function(a,b) {return a-b})) + '}'));
		
		

		for (var i = 0; i < requesterTickets.length; i++)
			if (requesterTickets[i].length > 0)  
				requesterArray.push(JSON.parse('{"name":"' + users[i].username + '", "tickets":' + JSON.stringify(requesterMinutes[i].sort(function(a,b) {return a-b})) + ', "actualTickets":' + JSON.stringify(requesterTickets[i].sort(function(a,b) {return a-b})) + '}'));

		companiesTickets.sort(function(a,b) {return a.name - b.name});	

		displayCompanyData(companiesArray, false);

		var htmlString = '<option value="all" selected="selected" class="assignee">All</option>';

		for (var i = 0; i < assigneeArray.length; i++)
			htmlString += '<option class="assignee" value="' + assigneeArray[i].zendeskId + '">' + assigneeArray[i].name + '</option>';

		$(".assigneeList").html(htmlString);
		$('.chosen').trigger('chosen:updated');

		htmlString = '<option value="all" selected="selected" class="requester">All</option>';

		for (var i = 0; i < requesterArray.length; i++)
			htmlString += '<option class="requester" value="' + requesterArray[i].zendeskId + '">' + requesterArray[i].name + '</option>';

		$(".requesterList").html(htmlString);
		$('.chosen').trigger('chosen:updated');
	}

	$(document).on('click', '.company', function (e) {
		currentCompany = companiesArray[$(this).attr('name')];
		$('#singleCompany').removeClass('false');
		$('#singleCompany').addClass('true');

		$('.orgFilters').html(currentCompany.name);

		var htmlString = '<option value="all" selected="selected" class="requester">All</option>';

		for (var i = 0; i < currentCompany.employees.length; i++)
			if (currentCompany.employees[i].zendeskId != null)
				htmlString += '<option class="requester" value="' + currentCompany.employees[i].zendeskId + '">' + currentCompany.employees[i].username + '</option>';

		$(".requesterList").html(htmlString);
		$('.chosen').trigger('chosen:updated');

		displayCompanyData([companiesArray[$(this).attr('name')]], true);

	});

	$(document).on('click', '#clearOrg', function (e) {
		$('#orgTable').html("");

		$('#singleCompany').removeClass('true');
		$('#singleCompany').addClass('false');

		$('.orgFilters').html('All');

		currentCompany = null;

		var htmlString = '<option value="all" selected="selected" class="requester">All</option>';

		for (var i = 0; i < requesterArray.length; i++)
			htmlString += '<option class="requester" value="' + requesterArray[i].zendeskId + '">' + requesterArray[i].name + '</option>';

		$('.requesterList').html(htmlString);
		$('.chosen').trigger('chosen:updated');

		displayCompanyData(companiesArray, false);
		displayTaskData(tickets, taskTypeArray);
		displayTicketList(tickets);
	});

	$(document).on('click', '.taskType', function (e) {
		$('#taskTable').html("");

		displayTaskData(tickets, [$(this).attr('name')]);
	});

	$(document).on('click', '#clearTasks', function (e) {
		$('#taskTable').html("");

		$('.taskFilters').html('All');

		removableTaskArray = taskTypeArray.slice(0);

		$('.taskButton').removeClass('btn-default');
		$('.taskButton').addClass('remove');
		$('.taskButton').addClass('btn-success');

		if (currentRequester != null)
			displayTaskData(currentRequester.actualTickets, removableTaskArray);
		else if (currentCompany != null)
			displayTaskData(currentCompany.actualTickets, removableTaskArray);
		else if (currentAssignee != null)
			displayTaskData(currentAssignee.actualTickets, removableTaskArray);
		else
			displayTaskData(tickets, removableTaskArray);
	});

	$(document).on('click', '.assignee', function (e) {
		if ($(this).html() != 'All') {
			for (var i = 0; i < assigneeArray.length; i++) 
				if (assigneeArray[i].name == $(this).html())
					currentAssignee = assigneeArray[i];
		}
		else
			currentAssignee = null;

		console.log(currentAssignee); 

		if (currentCompany != null)
			displayTaskData(currentCompany.actualTickets, removableTaskArray);
		else if (currentRequester != null)
			displayTaskData(currentRequester.actualTickets, removableTaskArray);
		else if (currentAssignee != null)
			displayTaskData(currentAssignee.actualTickets, removableTaskArray);
		else
			displayTaskData(tickets, removableTaskArray);
	});

	$(document).on('click', '.requester', function (e) {
		console.log($(this).html());
		if ($(this).html() != 'All') {
			for (var i = 0; i < requesterArray.length; i++) 
				if (requesterArray[i].name == $(this).html())
					currentRequester = requesterArray[i];
		}
		else
			currentRequester = null;

		currentAssignee = null; 

		if (currentRequester != null)
			displayTaskData(currentRequester.actualTickets, removableTaskArray);
		else if (currentCompany != null)
			displayTaskData(currentCompany.actualTickets, removableTaskArray);
		else if (currentAssignee != null)
			displayTaskData(currentAssignee.actualTickets, removableTaskArray);
		else
			displayTaskData(tickets, removableTaskArray);
	});

	$(document).on('click', '.tickets', function (e) {
		if ($(this).hasClass('current') != true) {
			tickets = [];

			if ($(this).attr('name') == 'lastMonth')
				tickets = lastTickets.slice(0);
			else
				tickets = currentTickets.slice(0);

			$('.current').removeClass('btn-default');
			$('.current').addClass('btn-success');
			$('.current').removeClass('current');
			

			$(this).removeClass('btn-success');
			$(this).addClass('btn-default');
			$(this).addClass('current');

			sortTickets(tickets);
			displayTaskData(tickets, removableTaskArray);
		}
	});

	$(document).on('click', '.taskButton', function (e) {
		$('#taskTable').html("");

		if ($(this).hasClass('remove')) {
			var index = removableTaskArray.indexOf($(this).attr('name'));

			if (index > -1)
				removableTaskArray.splice(index, 1);

			$(this).removeClass('remove');
			$(this).removeClass('btn-success');
			$(this).addClass('btn-default');

			var filterString = '';

			for (var i = 0; i < removableTaskArray.length; i++)
				filterString += removableTaskArray[i] + ' ';

			$('.taskFilters').html(filterString);

			if (currentRequester != null)
				displayTaskData(currentRequester.actualTickets, removableTaskArray);
			else if (currentCompany != null)
				displayTaskData(currentCompany.actualTickets, removableTaskArray);
			else if (currentAssignee != null)
				displayTaskData(currentAssignee.actualTickets, removableTaskArray);
			else
				displayTaskData(tickets, removableTaskArray);
		}
		else {
			removableTaskArray.push($(this).attr('name'));

			$(this).addClass('remove');
			$(this).removeClass('btn-default');
			$(this).addClass('btn-success');

			var filterString = '';

			for (var i = 0; i < removableTaskArray.length; i++)
				filterString += removableTaskArray[i] + ' ';

			$('.taskFilters').html(filterString);

			if (currentRequester != null)
				displayTaskData(currentRequester.actualTickets, removableTaskArray);
			else if (currentCompany != null)
				displayTaskData(currentCompany.actualTickets, removableTaskArray);
			else if (currentAssignee != null)
				displayTaskData(currentAssignee.actualTickets, removableTaskArray);
			else
				displayTaskData(tickets, removableTaskArray);
		}
		
	});
});