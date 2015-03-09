$(function() {
	MONTHLY_WEIGHTS= [["January",.02], ["February",.05], ["March", .13], ["April", .13], ["May", .13], ["June", .10], ["July", .10], ["August",.07], ["September", .09], ["October", .10], ["November", .06], ["December", .04] ];
		$.get('/user/getUsers', function(users) {

			var d1 = [];
			var d2 = [];
			var d3 = [];


			for (var z = 0; z < users.length; z++) {
				if (users[z].performanceMetrics == undefined)
					console.log('no metrics');
				else {
					var today= new Date();
					var beginningOfToday= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0);
					var noDaysForSales = 30 //to be dynamic eventually 
					var noDaysForLeads = 30 //to be dynamic eventually

					// Current Month Calculations
					var noLeadsOpened = previousDaysTotal(noDaysForLeads, users[z].performanceMetrics.leads.seriesData.leads);
					var noLeadsClosed = previousDaysTotal(noDaysForLeads, users[z].performanceMetrics.sales.seriesData.closed_leads);
					var noLeadsWon = previousDaysTotal(noDaysForLeads, users[z].performanceMetrics.sales.seriesData.leads_won);
					var Won2Close = parseFloat(noLeadsWon)/parseFloat(noLeadsClosed);
					//Leads open/day
					var openRate = noLeadsOpened/noDaysForLeads;
					//Leads closed/day
					var closeRate = noLeadsClosed/noDaysForSales;
					//No. Open Leads 
					var i = dayIndex(users[z].performanceMetrics.pipeline.seriesData.open_leads, beginningOfToday.valueOf());
					var noOpen = users[z].performanceMetrics.pipeline.seriesData.open_leads[i][1];
					//Previous Days Totals
					console.log('------z: ' + z);
					var salesOfInterest= previousDaysTotal(noDaysForSales, users[z].performanceMetrics.sales.seriesData.won_lead_value);
					var avgSaleOfInterest = salesOfInterest/noLeadsWon;
					var avgSalePerDay = salesOfInterest/noDaysForSales;
					var DPLOfInterest = salesOfInterest/noLeadsOpened;
					//Previous Months Calculations

					var d4 = aggregateMonthly(users[z].performanceMetrics.sales.seriesData.won_lead_value); 


					//Monthly data
					console.log('------z------: ' + z);
					var leadsOpenByMonth = aggregateMonthly(users[z].performanceMetrics.leads.seriesData.leads);
					var leadsWonByMonth = aggregateMonthly(users[z].performanceMetrics.sales.seriesData.leads_won);
					var leadsClosedByMonth = aggregateMonthly(users[z].performanceMetrics.sales.seriesData.closed_leads);
					var salesByMonth = aggregateMonthly(users[z].performanceMetrics.sales.seriesData.won_lead_value);
					var won2closeByMonth = aggregateMonthly(users[z].performanceMetrics.sales.seriesData.win_rate);

					var month = new Date();
					month = month.getMonth();


					console.log('----month: ' + month);

					var monthCode = (new Date(today.getFullYear(), month, 1, 0)).valueOf();
					var	weight = MONTHLY_WEIGHTS[month][1];
					var goal = users[z].wizardInfo.salesGoal * weight;
					console.log('--------goal: ' + goal);
					var salesTarget = goal*weight; 
					var monthSales = d4[month][1];
					var monthGoal = goal*MONTHLY_WEIGHTS[month][1];
					var noLeadsWon = leadsWonByMonth[month][1];
					var sales = salesByMonth[month][1];
					var projectedSales = projectedMonthsSales(month);
					var pctToGoal = projectedSales/monthGoal;	
					var winRate = (isThisMonthMOI(month)) ? Won2Close*100 : leadsWonByMonth[month][1]/leadsClosedByMonth[month][1]*100;
					var avgSale = (isThisMonthMOI(month)) ? avgSaleOfInterest : salesByMonth[month][1]/leadsWonByMonth[month][1] ; 
					var dollarPerLead = (isThisMonthMOI(month)) ? DPLOfInterest : salesByMonth[month][1]/leadsOpenByMonth[month][1] ; 
					var lead2close = (isThisMonthMOI(month)) ? noLeadsOpened/noLeadsClosed*100 : leadsOpenByMonth[month][1]/leadsClosedByMonth[month][1]*100 ; ; 
					var totalLeadsStarting = parseFloat(users[z].performanceMetrics.pipeline.seriesData.open_leads[dayIndex(users[z].performanceMetrics.pipeline.seriesData.open_leads, monthCode)][1]);
				    console.log('month code '+ monthCode + 'has this many leads' + totalLeadsStarting);
					var totalLeadsOpened = leadsOpenByMonth[month][1] + projectedLeads(month);
					console.log('leads opened: ' + leadsOpenByMonth[month][1] + " leads projected: " + projectedLeads(month)+ 'leads closed' + leadsClosedByMonth[month][1]);
					var totalLeads = totalLeadsStarting + totalLeadsOpened - leadsClosedByMonth[month][1];
					var leadsNeeded = (monthGoal - projectedSales)/dollarPerLead+totalLeads;
					console.log('leads needed' + (monthGoal-projectedSales));
					console.log('$/lead - ' +  dollarPerLead );
					//Sales Data
				 	var sCurrent =[[0,sales]];
				 	var sProjected=[[0,projectedSales]];
				 	var sGoal = [[0,monthGoal]];

				 	console.log('--------salesTarget: ' + salesTarget);

					d1.push([z, salesTarget]);
					d2.push([z, projectedSales]);
					d3.push([z, sales]);
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
					console.log('looking for...' + dayOfInterest + "in....");
					console.log(daysArray);
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

					console.log(projectedSales);

					return totalProjected
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
					return total

				}

				var stack = 0,
					bars = true,
					lines = false,
					steps = false;

				function plotWithOptions() {
					$.plot("#placeholder", [ d1, d2, d3 ], {
						series: {
							stack: stack,
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

				plotWithOptions();			
				}
		});
});