$(function() {
	MONTHLY_WEIGHTS= [["January",.02], ["February",.05], ["March", .13], ["April", .13], ["May", .13], ["June", .10], ["July", .10], ["August",.07], ["September", .09], ["October", .10], ["November", .06], ["December", .04] ];
		
	var d1 = [];
	var d2 = [];
	var d3 = [];

	var barChartData = {
		labels : [],
		datasets : [
			{
				fillColor : "rgba(197,220,85,0.5)",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "rgba(197,220,85,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data : []
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "rgba(151,187,205,0.75)",
				highlightStroke : "rgba(151,187,205,1)",
				data : []
			},
			{
				fillColor : "rgba(240,73,73,0.5)",
				strokeColor : "rgba(240,73,73,0.8)",
				highlightFill : "rgba(240,73,73,0.75)",
				highlightStroke : "rgba(240,73,73,1)",
				data : []
			}
		]
	};


	for (var z = 0; z < users.length; z++) {
		if (users[z].integrations == undefined)
			console.log('no metrics');
		else if (users[z].company && users[z].company.name == 'Hourwise' && users[z].email != 'randy@hourwise.com' && users[z].email != 'peter@hourwise.com')
			console.log('Hourwise employees... don\'t run metrics');
		else {
			var today= new Date();
			var beginningOfToday= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0);
			var noDaysForSales = 30 //to be dynamic eventually 
			var noDaysForLeads = 30 //to be dynamic eventually

			// Current Month Calculations
			var noLeadsOpened = previousDaysTotal(noDaysForLeads, users[z].integrations.nutshell.performanceMetrics.leads.seriesData.leads);
			var noLeadsClosed = previousDaysTotal(noDaysForLeads, users[z].integrations.nutshell.performanceMetrics.sales.seriesData.closed_leads);
			var noLeadsWon = previousDaysTotal(noDaysForLeads, users[z].integrations.nutshell.performanceMetrics.sales.seriesData.leads_won);
			var Won2Close = parseFloat(noLeadsWon)/parseFloat(noLeadsClosed);
			//Leads open/day
			var openRate = noLeadsOpened/noDaysForLeads;
			//Leads closed/day
			var closeRate = noLeadsClosed/noDaysForSales;
			//No. Open Leads 
			var i = dayIndex(users[z].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads, beginningOfToday.valueOf());
			var noOpen = users[z].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads[i][1];
			//Previous Days Totals
			var salesOfInterest= previousDaysTotal(noDaysForSales, users[z].integrations.nutshell.performanceMetrics.sales.seriesData.won_lead_value);
			var avgSaleOfInterest = salesOfInterest/noLeadsWon;
			var avgSalePerDay = salesOfInterest/noDaysForSales;
			var DPLOfInterest = salesOfInterest/noLeadsOpened;
			//Previous Months Calculations

			var d4 = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.sales.seriesData.won_lead_value); 


			//Monthly data
			var leadsOpenByMonth = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.leads.seriesData.leads);
			var leadsWonByMonth = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.sales.seriesData.leads_won);
			var leadsClosedByMonth = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.sales.seriesData.closed_leads);
			var salesByMonth = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.sales.seriesData.won_lead_value);
			var won2closeByMonth = aggregateMonthly(users[z].integrations.nutshell.performanceMetrics.sales.seriesData.win_rate);

			var month = new Date();
			month = month.getMonth();


			var monthCode = (new Date(today.getFullYear(), month, 1, 0)).valueOf();
			var	weight = MONTHLY_WEIGHTS[month][1];
			var goal = users[z].salesGoal;
			var salesTarget = goal*weight; 
			var monthSales = d4[month][0];
			var monthGoal = goal*MONTHLY_WEIGHTS[month][1];
			var noLeadsWon = leadsWonByMonth[month][1];
			var sales = salesByMonth[month][1];
			var projectedSales = projectedMonthsSales(month);
			// console.log('PROJECTED SALES: ' + projectedSales);
			var pctToGoalProjected = (isNaN(projectedSales)) ? 0 : projectedSales/monthGoal*100;
			var pctToGoal = sales/monthGoal*100;
			if (isNaN(pctToGoal)) pctToGoal = 0;	
			var winRate = (isThisMonthMOI(month)) ? Won2Close*100 : leadsWonByMonth[month][1]/leadsClosedByMonth[month][1]*100;
			var avgSale = (isThisMonthMOI(month)) ? avgSaleOfInterest : salesByMonth[month][1]/leadsWonByMonth[month][1] ; 
			var dollarPerLead = (isThisMonthMOI(month)) ? DPLOfInterest : salesByMonth[month][1]/leadsOpenByMonth[month][1] ; 
			var lead2close = (isThisMonthMOI(month)) ? noLeadsOpened/noLeadsClosed*100 : leadsOpenByMonth[month][1]/leadsClosedByMonth[month][1]*100 ; ; 
			var totalLeadsStarting = parseFloat(users[z].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads[dayIndex(users[z].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads, monthCode)][1]);
			var totalLeadsOpened = leadsOpenByMonth[month][1] + projectedLeads(month);
			var totalLeads = totalLeadsStarting + totalLeadsOpened - leadsClosedByMonth[month][1];
			var leadsNeeded = (monthGoal - projectedSales)/dollarPerLead+totalLeads;
			//Sales Data
		 	var sCurrent =[[0,sales]];
		 	//console.log(sCurrent[[0,sales]]);
		 	// console.log(sales);
		 	// console.log(monthSales);
		 	var sProjected=[[0,projectedSales]];
		 	var sGoal = [[0,monthGoal]];
		 	// console.log(projectedSales);
		 	if (isNaN(projectedSales))
		 		projectedSales = 0;
		 	if (isNaN(sales))
		 		sales = 0;


		 	barChartData.labels.push(users[z].username);
			barChartData.datasets[0].data.push(projectedSales);
			barChartData.datasets[1].data.push(monthGoal);
			barChartData.datasets[2].data.push(sales);

			// console.log(barChartData);

			d1.push([z, sales, users[z].id, users[z].username]);
			d2.push([z, monthGoal, users[z].id, users[z].username]);
			d3.push([z, projectedSales, users[z].id, users[z].username]);

			$('.percentToGoal[name=' + users[z].id + ']').html(pctToGoal.toFixed(0).toString() + '%');
			$('.percentToGoalProjected[name=' + users[z].id + ']').html(pctToGoalProjected.toFixed(0).toString() + '%');
			$('.actualSales[name=' + users[z].id + ']').html('$' + sales);
			$('.salesGoal[name=' + users[z].id + ']').html('$' + monthGoal);

		}
	}


		d2.sort(function (a,b) {
			return a[1] > b[1];
		});

		var newd1 = [];
		var newd3 = [];

		for (var i = 0; i < d2.length; i++) {
			for (var j = 0; j < d1.length; j++) {
				if (d2[i][2] == d1[j][2]) {
					newd1.push(d1[j]);
					newd3.push(d3[j]);
					break;
				}
			}
		}

		// console.log(d2);
		// console.log(newd1);
		// console.log(newd3);

		if (d2.length > 5) {
			d2.slice(5, d2.length - 1);
			newd1.slice(5, newd1.length - 1);
			newd3.slice(5, newd3.length - 1);
		}
		
		// for (var i = 0; i < users.length; i++) {
		// 	d2.push([i, users[i].performanceMetrics.sales.summaryData.won_lead_value.sum + 40000]);
		// }

		
		// for (var i = 0; i < users.length; i++) {
		// 	d3.push([i, users[i].performanceMetrics.sales.summaryData.won_lead_value.sum]);
		// }

		function effectiveYearElapsed(){
			var yearStart = new Date(today.getFullYear(),0);
			var elapsed = 0;
			var currentMonth= today.getMonth();

			for( i=0; i<=currentMonth; i++){		 
				if (i!=currentMonth){
					elapsed+= MONTHLY_WEIGHTS[i][1];
				}
				else{
					elapsed+=MONTHLY_WEIGHTS[i][1]*perMonthElapsed();
				}
			}
			return elapsed;

		};

		function perMonthElapsed(month, year){
			var month = month ? month : today.getMonth();
			var year = year ? year : today.getFullYear();
			var doi = new Date(year, month);
			var thisMonth = new Date(today.getFullYear(), today.getMonth());

			if(+doi == +thisMonth){ return today.getDate()/noDays(month, year);}
			else if(+doi > +today){return 0 ;}
			else {return 1;}
		};

		function isThisMonthMOI(moi){
			var thisMonth = new Date(today.getFullYear(), today.getMonth());
			if (moi == thisMonth.getMonth()){return true};
			return false
		}

		function noDays(month, year){
			var year = year ? year : today.getFullYear();
			return (new Date(year, month+1, 0)).getDate();

		}

		function daysRemaining(month, year){
			var month = month ? month : today.getMonth();
			var year = year ? year : today.getFullYear();
			return noDays(month, year)*(1 - perMonthElapsed(month, year));
		}

		function dayIndex(data, dayOfInterest){
			var index = 0;
			//data is in the form [[day, value], [day, value]]
			var daysArray = data.map(function(arr){
				return arr[0];
			})

			index = daysArray.indexOf(dayOfInterest);

			if (index != 0 ) { return index} 
			else{
				return daysArray.length;
			}

		}

		function aggregateMonthly(data){
			//Data should be in the form [[date, data], [date,data]....]
			var newArray = [[0,0.0],[1,0.0],[2,0.0],[3,0.0],[4,0.0],[5,0.0],[6,0.0],[7,0.0],[8,0.0],[9,0.0],[10,0.0],[11,0.0]];
			
			for(var i in data){
				var dateCode=data[i][0];
				// console.log(dateCode);
				var iData = parseFloat(data[i][1]);
				var tmp=0.0;
				var month = new Date(dateCode).getMonth();
				// console.log(month);
				for(j=0; j<12; j++){
					// console.log(newArray[j][0]);
					if(newArray[j][0]==month){
					newArray[j][1] += iData;
					tmp += iData;
					j=12;
					}
				}
			}
			for(k=0; k<12; k++){
				old = newArray[k][0];
				updated = new Date(2014, old);
				newArray[k][0]= updated;
			}
			return newArray
		}

		function projectedLeads(month){
			return daysRemaining(month)*openRate;
		}

		function projectedMonthsSales(month){
			var totalProjected = 0;
			var currentSales = salesByMonth[month][1];
			var dollarPerLead = (isThisMonthMOI(month)) ? DPLOfInterest : salesByMonth[month][1]/leadsOpenByMonth[month][1] ; 
			//
			var projectedSales = closeRate*Won2Close*avgSaleOfInterest*daysRemaining(month);
			// var projectedSales = dollarPerLead*openRate*daysRemaining(month);

			totalProjected = currentSales + projectedSales;

			return totalProjected;
		}

		function previousDaysTotal(noDays, data){
			// data should be in series form and [[datecode, value],[datecode, value]]
			// functions returns the sum of values between midight noDays before today and Now. 
			var total=0;
			var noDays= noDays*3600*1000*24;
			var prevDay = today - noDays;
			var startDay = new Date(prevDay);
			startDay.setHours(0,0,0,0);
			
			for(var i in data){
				var dataDate= new Date(data[i][0]);
				if(dataDate>=startDay){total+=parseFloat(data[i][1])}
			}
			return total;

		}

		var stack = 0,
			bars = true,
			lines = false,
			steps = false;

		var ticksArray = [];

		for (var i = 0; i < d2.length; i++)
			ticksArray.push([d2[i][0], d2[i][3]]);

		// console.log('----' + newd1[0][1]);
		// console.log('----' + d2[0][1]);
		// console.log('----' + newd3[0][1]);

		// var ctx = $("#myChart").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.

		// var myNewChart = new Chart(ctx).StackedBar(barChartData, {
		// 	responsive : true
		// });


		function plotWithOptions() {
			$.plot("#placeholder", [ newd1, d2,  newd3 ], {
				xaxis: {
					ticks: ticksArray
				},
				yaxis: {
					min: 0, 
					max: 350000
				},
				series: {
					stack: true,
					lines: {
						show: lines,
						fill: true,
						steps: steps
					},
					bars: {
						show: bars,
						barWidth: 0.6
					}
				}
			});
		}

		// console.log('++++' + ticksArray);

		// plotWithOptions();		

			
	 $(document).on('click', '.talkedTo', function(e) {

	 	var currentDiv = $(this);
	 	var htmlContent = $(this).html();

	 	var currentCallCount;

	 	var firstIndex;
	 	var secondIndex;

	 	for (var i = 0; i < htmlContent.length; i++) {
	 		if (htmlContent[i] == '(') 
	 			firstIndex = i + 1;
	 		else if (htmlContent[i] == ')') {
	 			secondIndex = i;
	 		}
	 	}

	 	currentCallCount = parseInt(htmlContent.substring(firstIndex, secondIndex));

        $.post('/user/talkedTo?id=' + $(this).attr('name'), function ( response ) {
          	if (response != 'error') {
          		currentCallCount++;
          		currentDiv.html('(' + currentCallCount + ') Talked to...');
          	}	
          		
          	
       });
    });

});