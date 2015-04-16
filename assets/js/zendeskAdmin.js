$(document).ready(function() {

	var cjId = 491576246;
	var stefanyId = 889077333;
	var emilyId = 760940413;

	var barChartData = {
		labels : ['CJ', 'Stefany', 'Emily'],
		datasets : [
			{
				fillColor : "rgba(240,82,200,0.5)",
				strokeColor : "rgba(240,73,73,0.8)",
				highlightFill : "rgba(240,73,73,0.75)",
				highlightStroke : "rgba(240,73,73,1)",
				data : [cjSolved.tier5, stefanySolved.tier5, emilySolved.tier5]
			},
			{
				fillColor : "rgba(240,100,82,0.5)",
				strokeColor : "rgba(240,73,73,0.8)",
				highlightFill : "rgba(240,73,73,0.75)",
				highlightStroke : "rgba(240,73,73,1)",
				data : [cjSolved.tier4, stefanySolved.tier4, emilySolved.tier4]
			},
			{
				fillColor : "rgba(197,220,85,0.5)",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "rgba(197,220,85,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data : [cjSolved.tier3, stefanySolved.tier3, emilySolved.tier3]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : [cjSolved.tier2, stefanySolved.tier2, emilySolved.tier2]
			},
			{
				fillColor : "rgba(240,73,73,0.5)",
				strokeColor : "rgba(240,73,73,0.8)",
				highlightFill : "rgba(240,73,73,0.75)",
				highlightStroke : "rgba(240,73,73,1)",
				data : [cjSolved.tier1, stefanySolved.tier1, emilySolved.tier1]
			}
		]
	};

	$("#canvas-wrapper").html("").html('<canvas id="myChart"></canvas>');

	var ctx = $("#myChart").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.

	var myNewChart = new Chart(ctx).StackedBar(barChartData, {
		responsive : true
	});

	function redrawGraph(barChartData) {

		$("#canvas-wrapper").html("").html('<canvas id="myChart"></canvas>');

		var ctx = $("#myChart").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.

		var myNewChart = new Chart(ctx).StackedBar(barChartData, {
			responsive : true
		});	
	}

	function updateCJ(cjSolved) {

		$('#cj1').html(cjSolved.tier1);
		$('#cj2').html(cjSolved.tier2);
		$('#cj3').html(cjSolved.tier3);
		$('#cj4').html(cjSolved.tier4);
		$('#cj5').html(cjSolved.tier5);

		$('#cjTotal').html(cjSolved.total);
	}

	function updateEmily(emilySolved) {

		$('#emily1').html(emilySolved.tier1);
		$('#emily2').html(emilySolved.tier2);
		$('#emily3').html(emilySolved.tier3);
		$('#emily4').html(emilySolved.tier4);
		$('#emily5').html(emilySolved.tier5);

		$('#emilyTotal').html(emilySolved.total);
	}

	function updateStefany(stefanySolved) {

		$('#stef1').html(stefanySolved.tier1);
		$('#stef2').html(stefanySolved.tier2);
		$('#stef3').html(stefanySolved.tier3);
		$('#stef4').html(stefanySolved.tier4);
		$('#stef5').html(stefanySolved.tier5);

		$('#stefTotal').html(stefanySolved.total);
	}

	function updateTotals(oneTotal, twoTotal, threeTotal, fourTotal, fiveTotal, grandTotal) {

		$('#oneTotal').html(oneTotal);
		$('#twoTotal').html(twoTotal);
		$('#threeTotal').html(threeTotal);
		$('#fourTotal').html(fourTotal);
		$('#fiveTotal').html(fiveTotal);
		$('#grandTotal').html(grandTotal);
	}

	$('select').on('change', function (e) {
	    var optionSelected = $("option:selected", this);
	    var valueSelected = this.value;
	    
	    if (valueSelected == 'thisMonth') {

	    	var barChartData = {
				labels : ['CJ', 'Stefany', 'Emily'],
				datasets : [
					{
						fillColor : "rgba(240,82,200,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [cjSolved.tier5, stefanySolved.tier5, emilySolved.tier5]
					},
					{
						fillColor : "rgba(240,100,82,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [cjSolved.tier4, stefanySolved.tier4, emilySolved.tier4]
					},
					{
						fillColor : "rgba(197,220,85,0.5)",
						strokeColor : "rgba(220,220,220,0.8)",
						highlightFill: "rgba(197,220,85,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data : [cjSolved.tier3, stefanySolved.tier3, emilySolved.tier3]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,0.8)",
						highlightFill : "rgba(151,187,205,0.75)",
						highlightStroke : "rgba(151,187,205,1)",
						data : [cjSolved.tier2, stefanySolved.tier2, emilySolved.tier2]
					},
					{
						fillColor : "rgba(240,73,73,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [cjSolved.tier1, stefanySolved.tier1, emilySolved.tier1]
					}
				]
			};

			redrawGraph(barChartData);

			updateCJ(cjSolved);

			updateStefany(stefanySolved);

			updateEmily(emilySolved);

			updateTotals(cjSolved.tier1 + stefanySolved.tier1 + emilySolved.tier1, cjSolved.tier2 + stefanySolved.tier2 + emilySolved.tier2, cjSolved.tier3 + stefanySolved.tier3 + emilySolved.tier3, cjSolved.tier4 + stefanySolved.tier4 + emilySolved.tier4, cjSolved.tier5 + stefanySolved.tier5 + emilySolved.tier5, cjSolved.total + stefanySolved.total + emilySolved.total);			
	    }

	    else if (valueSelected == 'thisWeek') {
	    	var currentDate = new Date();
	    	var startDate = new Date();
	    	//startDate.setDate(startDate.getDate() - 1);

	    	if (currentDate.getDay() == 1)
	    		startDate.setDate(currentDate.getDate() - 1);
	    	else if (currentDate.getDay() == 2)
	    		startDate.setDate(currentDate.getDate() - 2);
	    	else if (currentDate.getDay() == 3)
	    		startDate.setDate(currentDate.getDate() - 3);
	    	else if (currentDate.getDay() == 4)
	    		startDate.setDate(currentDate.getDate() - 4);
	    	else if (currentDate.getDay() == 5)
	    		startDate.setDate(currentDate.getDate() - 5);
	    	else if (currentDate.getDay() == 6)
	    		startDate.setDate(currentDate.getDate() - 6);

	    	var weekArray = [];
	    	var weekCJ = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekStefany = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekEmily = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	for (var i = 0; i < solvedTickets.tickets.length; i++) {
	    		var dateString = solvedTickets.tickets[i].created_at;
			  	var year = parseInt(dateString.substring(0, 4));
			  	var month = parseInt(dateString.substring(5, 7));
			  	var day = parseInt(dateString.substring(7, 9));

			  	var createdAt = new Date(year, month, day);

			  	console.log('startDate - ' + startDate + '\n createdAt - ' + createdAt + '\n currentDate - ' + currentDate);

			  	if (createdAt >= startDate && createdAt <= currentDate) {
			  		weekArray.push(solvedTickets.tickets[i]);
			  		if (solvedTickets.tickets[i].assignee_id == cjId) {
		  				weekCJ.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekCJ.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekCJ.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekCJ.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekCJ.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekCJ.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == stefanyId) {
		  				weekStefany.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekStefany.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekStefany.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekStefany.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekStefany.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekStefany.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == emilyId) {
						weekEmily.total++;

						if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekEmily.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekEmily.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekEmily.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekEmily.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekEmily.tier5++;
					}
			  	}
			  	else
			  		console.log('--------FILTERING SOME DATA AT LEAST--------');
			  		
	    	}

	    	var barChartDataWeek = {
				labels : ['CJ', 'Stefany', 'Emily'],
				datasets : [
					{
						fillColor : "rgba(240,82,200,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier5, weekStefany.tier5, weekEmily.tier5]
					},
					{
						fillColor : "rgba(240,100,82,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier4, weekStefany.tier4, weekEmily.tier4]
					},
					{
						fillColor : "rgba(197,220,85,0.5)",
						strokeColor : "rgba(220,220,220,0.8)",
						highlightFill: "rgba(197,220,85,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data : [weekCJ.tier3, weekStefany.tier3, weekEmily.tier3]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,0.8)",
						highlightFill : "rgba(151,187,205,0.75)",
						highlightStroke : "rgba(151,187,205,1)",
						data : [weekCJ.tier2, weekStefany.tier2, weekEmily.tier2]
					},
					{
						fillColor : "rgba(240,73,73,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier1, weekStefany.tier1, weekEmily.tier1]
					}
				]
			};

			redrawGraph(barChartDataWeek);

			updateCJ(weekCJ);

			updateStefany(weekStefany);

			updateEmily(weekEmily);

			updateTotals(weekCJ.tier1 + weekStefany.tier1 + weekEmily.tier1, weekCJ.tier2 + weekStefany.tier2 + weekEmily.tier2, weekCJ.tier3 + weekStefany.tier3 + weekEmily.tier3, weekCJ.tier4 + weekStefany.tier4 + weekEmily.tier4, weekCJ.tier5 + weekStefany.tier5 + weekEmily.tier5, weekCJ.total + weekStefany.total + weekEmily.total);
	    }

	    else if (valueSelected == 'lastWeek') {
	    	var currentDate = new Date();
	    	var startDate = new Date();
	    	//startDate.setDate(startDate.getDate() - 1);

	    	startDate.setDate(currentDate.getDate() - 7)

	    	var weekArray = [];
	    	var weekCJ = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekStefany = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekEmily = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	for (var i = 0; i < solvedTickets.tickets.length; i++) {
	    		var dateString = solvedTickets.tickets[i].created_at;
			  	var year = parseInt(dateString.substring(0, 4));
			  	var month = parseInt(dateString.substring(5, 7));
			  	var day = parseInt(dateString.substring(7, 9));

			  	var createdAt = new Date(year, month, day);

			  	console.log('startDate - ' + startDate + '\n createdAt - ' + createdAt + '\n currentDate - ' + currentDate);

			  	if (createdAt >= startDate && createdAt <= currentDate) {
			  		weekArray.push(solvedTickets.tickets[i]);
			  		if (solvedTickets.tickets[i].assignee_id == cjId) {
		  				weekCJ.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekCJ.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekCJ.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekCJ.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekCJ.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekCJ.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == stefanyId) {
		  				weekStefany.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekStefany.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekStefany.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekStefany.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekStefany.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekStefany.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == emilyId) {
						weekEmily.total++;

						if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekEmily.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekEmily.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekEmily.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekEmily.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekEmily.tier5++;
					}
			  	}
			  	else
			  		console.log('--------FILTERING SOME DATA AT LEAST--------');
			  		
	    	}


	    	var barChartDataWeek = {
				labels : ['CJ', 'Stefany', 'Emily'],
				datasets : [
					{
						fillColor : "rgba(240,82,200,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier5, weekStefany.tier5, weekEmily.tier5]
					},
					{
						fillColor : "rgba(240,100,82,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier4, weekStefany.tier4, weekEmily.tier4]
					},
					{
						fillColor : "rgba(197,220,85,0.5)",
						strokeColor : "rgba(220,220,220,0.8)",
						highlightFill: "rgba(197,220,85,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data : [weekCJ.tier3, weekStefany.tier3, weekEmily.tier3]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,0.8)",
						highlightFill : "rgba(151,187,205,0.75)",
						highlightStroke : "rgba(151,187,205,1)",
						data : [weekCJ.tier2, weekStefany.tier2, weekEmily.tier2]
					},
					{
						fillColor : "rgba(240,73,73,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier1, weekStefany.tier1, weekEmily.tier1]
					}
				]
			};

			redrawGraph(barChartDataWeek);

			updateCJ(weekCJ);

			updateStefany(weekStefany);

			updateEmily(weekEmily);

			updateTotals(weekCJ.tier1 + weekStefany.tier1 + weekEmily.tier1, weekCJ.tier2 + weekStefany.tier2 + weekEmily.tier2, weekCJ.tier3 + weekStefany.tier3 + weekEmily.tier3, weekCJ.tier4 + weekStefany.tier4 + weekEmily.tier4, weekCJ.tier5 + weekStefany.tier5 + weekEmily.tier5, weekCJ.total + weekStefany.total + weekEmily.total);
	    }

	    else if (valueSelected == 'lastTwoWeeks') {
	    	var currentDate = new Date();
	    	var startDate = new Date();
	    	//startDate.setDate(startDate.getDate() - 1);

	    	startDate.setDate(currentDate.getDate() - 14)

	    	var weekArray = [];
	    	var weekCJ = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekStefany = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	var weekEmily = {
	    		total: 0,
	    		tier1: 0,
	    		tier2: 0,
	    		tier3: 0,
	    		tier4: 0,
	    		tier5: 0
	    	};

	    	for (var i = 0; i < solvedTickets.tickets.length; i++) {
	    		var dateString = solvedTickets.tickets[i].created_at;
			  	var year = parseInt(dateString.substring(0, 4));
			  	var month = parseInt(dateString.substring(5, 7));
			  	var day = parseInt(dateString.substring(7, 9));

			  	var createdAt = new Date(year, month, day);

			  	//console.log('startDate - ' + startDate + '\n createdAt - ' + createdAt + '\n currentDate - ' + currentDate);

			  	if (createdAt >= startDate && createdAt <= currentDate) {
			  		weekArray.push(solvedTickets.tickets[i]);
			  		if (solvedTickets.tickets[i].assignee_id == cjId) {
		  				weekCJ.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekCJ.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekCJ.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekCJ.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekCJ.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekCJ.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == stefanyId) {
		  				weekStefany.total++;

		  				if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekStefany.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekStefany.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekStefany.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekStefany.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekStefany.tier5++;
		  			}
		  			else if (solvedTickets.tickets[i].assignee_id == emilyId) {
						weekEmily.total++;

						if (solvedTickets.tickets[i].fields[0].value == 'tier_1')
		  					weekEmily.tier1++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_2')
		  					weekEmily.tier2++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_3')
		  					weekEmily.tier3++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_4')
		  					weekEmily.tier4++;
		  				else if (solvedTickets.tickets[i].fields[0].value == 'tier_5')
		  					weekEmily.tier5++;
					}
			  	}
			  	else
			  		console.log('--------FILTERING SOME DATA AT LEAST--------');
			  		
	    	}

	    	var barChartDataWeek = {
				labels : ['CJ', 'Stefany', 'Emily'],
				datasets : [
					{
						fillColor : "rgba(240,82,200,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier5, weekStefany.tier5, weekEmily.tier5]
					},
					{
						fillColor : "rgba(240,100,82,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier4, weekStefany.tier4, weekEmily.tier4]
					},
					{
						fillColor : "rgba(197,220,85,0.5)",
						strokeColor : "rgba(220,220,220,0.8)",
						highlightFill: "rgba(197,220,85,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data : [weekCJ.tier3, weekStefany.tier3, weekEmily.tier3]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,0.8)",
						highlightFill : "rgba(151,187,205,0.75)",
						highlightStroke : "rgba(151,187,205,1)",
						data : [weekCJ.tier2, weekStefany.tier2, weekEmily.tier2]
					},
					{
						fillColor : "rgba(240,73,73,0.5)",
						strokeColor : "rgba(240,73,73,0.8)",
						highlightFill : "rgba(240,73,73,0.75)",
						highlightStroke : "rgba(240,73,73,1)",
						data : [weekCJ.tier1, weekStefany.tier1, weekEmily.tier1]
					}
				]
			};

			redrawGraph(barChartDataWeek);

			updateCJ(weekCJ);

			updateStefany(weekStefany);

			updateEmily(weekEmily);

			updateTotals(weekCJ.tier1 + weekStefany.tier1 + weekEmily.tier1, weekCJ.tier2 + weekStefany.tier2 + weekEmily.tier2, weekCJ.tier3 + weekStefany.tier3 + weekEmily.tier3, weekCJ.tier4 + weekStefany.tier4 + weekEmily.tier4, weekCJ.tier5 + weekStefany.tier5 + weekEmily.tier5, weekCJ.total + weekStefany.total + weekEmily.total);
	    }
	});



});