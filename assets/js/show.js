//------------- charts.js -------------//
MONTHLY_WEIGHTS= [["January",.02], ["February",.05], ["March", .13], ["April", .13], ["May", .13], ["June", .10], ["July", .10], ["August",.07], ["September", .09], ["October", .10], ["November", .06], ["December", .04] ];    
//Need to get pipeline report
var today= new Date();
var beginningOfToday= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0);
var noDaysForSales = 30 //to be dynamic eventually 
var noDaysForLeads = 30 //to be dynamic eventually

// Current Month Calculations
var noLeadsOpened = previousDaysTotal(noDaysForLeads, lead_data.seriesData.leads);
var noLeadsClosed = previousDaysTotal(noDaysForLeads, sales_data.seriesData.closed_leads);
var noLeadsWon = previousDaysTotal(noDaysForLeads, sales_data.seriesData.leads_won);
var Won2Close = parseFloat(noLeadsWon)/parseFloat(noLeadsClosed);
//Leads open/day
var openRate = noLeadsOpened/noDaysForLeads;
//Leads closed/day
var closeRate = noLeadsClosed/noDaysForSales;
//No. Open Leads 
var i = dayIndex(pipeline_data.seriesData.open_leads, beginningOfToday.valueOf());
var noOpen = pipeline_data.seriesData.open_leads[i][1];
//Previous Days Totals
var salesOfInterest= previousDaysTotal(noDaysForSales,sales_data.seriesData.won_lead_value);
var avgSaleOfInterest = 0;
if (noLeadsWon > 0)
	avgSaleOfInterest = salesOfInterest/noLeadsWon;
var avgSalePerDay = salesOfInterest/noDaysForSales;
var DPLOfInterest = salesOfInterest/noLeadsOpened;
//Previous Months Calculations


//Monthly data
var leadsOpenByMonth = aggregateMonthly(lead_data.seriesData.leads);
var leadsWonByMonth = aggregateMonthly(sales_data.seriesData.leads_won);
var leadsClosedByMonth = aggregateMonthly(sales_data.seriesData.closed_leads);
var salesByMonth = aggregateMonthly(sales_data.seriesData.won_lead_value);
var won2closeByMonth = aggregateMonthly(sales_data.seriesData.win_rate);

//Annual Data
var projectedSales =(sales_data.summaryData.won_lead_value.sum/effectiveYearElapsed());
var percentToGoal = projectedSales/goal*100
var colours = {
               white: '#fff',
               dark: '#79859b',
               red: '#f68484',
               blue: '#75b9e6',
               green: '#71d398',
               yellow: '#ffcc66',
               orange: '#f4b162',
               purple: '#af91e1',
               pink: '#f78db8',
               lime: '#a8db43',
               magenta: '#eb45a7',
               teal: '#97d3c5',
               black: '#000',
               brown: '#d1b993',
               textcolor: '#5a5e63',
               gray: '#f3f5f6'
           };

$(document).ready(function() {

	io.socket.get('/user/subscribeToDashboard');

	io.socket.on('user', function (obj) {
	  console.log('hitting socket event trigger');
	  
	  var user = obj.data.user;
	  sales_data = user.integrations.nutshell.performanceMetrics.sales;
	  lead_data = user.integrations.nutshell.performanceMetrics.leads;
	  pipeline_data = user.integrations.nutshell.performanceMetrics.pipeline ;
	  goal = user.salesGoal;

	  	var noLeadsOpened = previousDaysTotal(noDaysForLeads, lead_data.seriesData.leads);
		var noLeadsClosed = previousDaysTotal(noDaysForLeads, sales_data.seriesData.closed_leads);
		var noLeadsWon = previousDaysTotal(noDaysForLeads, sales_data.seriesData.leads_won);
		var Won2Close = parseFloat(noLeadsWon)/parseFloat(noLeadsClosed);
		//Leads open/day
		var openRate = noLeadsOpened/noDaysForLeads;
		//Leads closed/day
		var closeRate = noLeadsClosed/noDaysForSales;
		//No. Open Leads 
		var i = dayIndex(pipeline_data.seriesData.open_leads, beginningOfToday.valueOf());
		var noOpen = pipeline_data.seriesData.open_leads[i][1];
		//Previous Days Totals
		var salesOfInterest= previousDaysTotal(noDaysForSales,sales_data.seriesData.won_lead_value);
		var avgSaleOfInterest = 0;
		if (noLeadsWon > 0)
			avgSaleOfInterest = salesOfInterest/noLeadsWon;
		var avgSalePerDay = salesOfInterest/noDaysForSales;
		var DPLOfInterest = salesOfInterest/noLeadsOpened;
		//Previous Months Calculations


		//Monthly data
		var leadsOpenByMonth = aggregateMonthly(lead_data.seriesData.leads);
		var leadsWonByMonth = aggregateMonthly(sales_data.seriesData.leads_won);
		var leadsClosedByMonth = aggregateMonthly(sales_data.seriesData.closed_leads);
		var salesByMonth = aggregateMonthly(sales_data.seriesData.won_lead_value);
		var won2closeByMonth = aggregateMonthly(sales_data.seriesData.win_rate);
		//Annual Data
		var projectedSales =(sales_data.summaryData.won_lead_value.sum/effectiveYearElapsed());

		$('#numRedLeads').html(user.integrations.nutshell.redLeads.Total_Red_Leads);

		d1 =  aggregateMonthly(sales_data.seriesData.won_lead_value); 
    //Update Annual Data

		$('#projectedSales').html('$'+ moneyMe(projectedSales));
	  	$('#percentGoal').attr('data-percent', percentToGoal.toString()+'%');
	  	$('#percentGoal').html(percentToGoal.toFixed(0).toString()+'%');
	    //Plot monthly charts and update views

	    // monthSummary(today.getMonth(), colours);
	    

		initPieChartPage(20,100,1500, colours);
		$('#monthOfInterest').val(today.getMonth());
		updateMonthly();
		$('#monthOfInterest').change(function(){
			updateMonthly();
		});
  	});

    d1 =  aggregateMonthly(sales_data.seriesData.won_lead_value); 
    //Update Annual Data

	$('#projectedSales').html('$'+ moneyMe(projectedSales));
  	$('#percentGoal').attr('data-percent', percentToGoal.toString()+'%');
  	$('#percentGoal').html(percentToGoal.toFixed(0).toString()+'%');
    //Plot monthly charts and update views

    // monthSummary(today.getMonth(), colours);
    

	initPieChartPage(20,100,1500, colours);
	$('#monthOfInterest').val(today.getMonth());
	updateMonthly();
	$('#monthOfInterest').change(function(){
		updateMonthly();
	});

 	
    //update instance after 5 sec
    setTimeout(function() {
       
        // $('#winRate').data('easyPieChart').update(40);
    }, 5000);

    // $(".easy-pie-chart-green").easyPieChart({
    //     barColor: colours.green,
    //     borderColor: colours.green,
    //     trackColor: '#b1f8b1',
    //     scaleColor: false,
    //     lineCap: 'butt',
    //     lineWidth: 20,
    //     size: 100,
    //     animate: 1500
    // });
//     //------------- Init pie charts -------------//
//     //pass the variables to pie chart init function
//     //first is line width, size for pie, animated time , and colours object for theming.
// 	initPieChart(10,40, 1500, colours);
// 	initPieChartPage(20,100,1500, colours);

 	
// });

// //Setup easy pie charts in sidebar
// var initPieChart = function(lineWidth, size, animateTime, colours) {
// 	$(".pie-chart").easyPieChart({
//         barColor: colours.dark,
//         borderColor: colours.dark,
//         trackColor: '#d9dde2',
//         scaleColor: false,
//         lineCap: 'butt',
//         lineWidth: lineWidth,
//         size: size,
//         animate: animateTime
//     });
// }

//Setup easy pie charts in page




	// //generate random number for charts
	randNum = function(){
		return (Math.floor( Math.random()* (1+150-50) ) ) + 80;
	}

	// //------------- LIne charts with dots -------------//
	// $(function() {

	// 	//first line chart
		var d2 = [];
		//here we generate randomdata data for chart
		for (var i = 0; i < 8; i++) {
			d2.push([new Date(Date.today().add(i).days()).getTime(),randNum()]);
		}
	// 	d1= user.performanceMetrics.seriesData.leads_won;
		
	// 	console.log(d1);
		var chartMinDate = d1[0][0]; //first day
    	var chartMaxDate = d1[d1.length-1][0];//last day

    	// var tickSize = [1, "day"];
    	var tickSize = [1, "month"];
    	// var tformat = "%d/%m/%y";
    	var tformat = "%b";

 //    	var total = 0;
 //    	//calculate total earnings for this period
 //    	for (var i = 0; i < 8; i++) {
	// 		total = d1[i][1] + total;
	// 	}

    	var options = {
    		grid: {
				show: true,
			    aboveData: true,
			    color: colours.white ,
			    labelMargin: 20,
			    axisMargin: 0, 
			    borderWidth: 0,
			    borderColor:null,
			    minBorderMargin: 5 ,
			    clickable: true, 
			    hoverable: true,
			    autoHighlight: true,
			    mouseActiveRadius: 100,
			},
			series: {
				grow: {
		            active: true,
		     		duration: 1500
		        },
	            lines: {
            		show: true,
            		fill: false,
            		lineWidth: 2.5
	            },
	            points: {
	            	show:true,
	            	radius: 4,
	            	lineWidth: 2.5,
	            	fill: true,
	            	fillColor: colours.blue
	            }
	        },
	        colors: [colours.white],
	        legend: { 
	        	position: "ne", 
	        	margin: [0,-25], 
	        	noColumns: 0,
	        	labelBoxBorderColor: null,
	        	labelFormatter: function(label, series) {
				    return '<div style="padding: 10px; font-size:20px;font-weight:bold;">'+ label + ': $'+moneyMe(sales_data.summaryData.won_lead_value.sum)+'</div>';
				},
				backgroundColor: colours.blue,
    			backgroundOpacity: 0.5,
    			hideSquare: true //hide square color helper 
	    	},
	        shadowSize:0,
	        tooltip: true, //activate tooltip
			tooltipOpts: {
				content: "$%y.0",
				xDateFormat: "%d/%m",
				shifts: {
					x: -30,
					y: -50
				},
				theme: 'dark',
				defaultTheme: false
			},
			yaxis: { 
				min: 0
			},
			xaxis: { 
	        	mode: "time",
	        	minTickSize: tickSize,
	        	timeformat: tformat,
	        	min: chartMinDate,
	        	max: chartMaxDate,
	        	tickLength: 0,
	            
	        }
    	}

		var plot = $.plot($("#line-chart-dots"),[{
    			label: "Sales", 
    			data: d1
    		}], options
    	);		var plot = $.plot($("#year"),[{
    			label: "Relative Contribution", 
    			data: MONTHLY_WEIGHTS
    		}],{xaxis: { 
	        	mode: "categories",
				tickLength: 0
	        }}
    	);
		

	// });
	//------------- Ordered bars chart -------------//
	// $(function () {


//DOM READY
});


	// var(sales_dataBar = function (month){
function monthSummary(month, colours){	
	//Need to get real lead data...right now just putting in leads won and closed 
	var monthCode = (new Date(today.getFullYear(), month, 1, 0)).valueOf();
	var	weight = MONTHLY_WEIGHTS[month][1];
	console.log('--------goal: ' + goal);
	var salesTarget = goal*weight; 
	var monthSales = d1[month][1];
	var monthGoal = goal*MONTHLY_WEIGHTS[month][1];
	var noLeadsWon = leadsWonByMonth[month][1];
	var sales = salesByMonth[month][1];
	var projectedSales = projectedMonthsSales(month);
	var pctToGoal = projectedSales/monthGoal;	
	var winRate = (isThisMonthMOI(month)) ? Won2Close*100 : leadsWonByMonth[month][1]/leadsClosedByMonth[month][1]*100;
	var avgSale = (isThisMonthMOI(month)) ? avgSaleOfInterest : salesByMonth[month][1]/leadsWonByMonth[month][1] ; 
	var dollarPerLead = (isThisMonthMOI(month)) ? DPLOfInterest : salesByMonth[month][1]/leadsOpenByMonth[month][1] ; 
	var lead2close = (isThisMonthMOI(month)) ? noLeadsOpened/noLeadsClosed*100 : leadsOpenByMonth[month][1]/leadsClosedByMonth[month][1]*100 ; ; 
	var totalLeadsStarting = parseFloat(pipeline_data.seriesData.open_leads[dayIndex(pipeline_data.seriesData.open_leads, monthCode)][1]);
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
 	// //Lead-Estimate Data
 	// current = [[0,5],[1,noLeadsWon]];
 	// projected = [[0,10],[1,8]];
 	// goals = [[0,15],[1,10]];

 	//Lead Data
 	var current = [[0,(totalLeadsStarting +leadsOpenByMonth[month][1]-leadsClosedByMonth[month][1])]];
 	var projected = [[0,totalLeads]];
 	var goals = [[0,leadsNeeded]];
 	$('#leadsTitle').html('Need '+ (leadsNeeded-totalLeads).toFixed(0) + ' Leads!');


 	var salesData = [{data: sCurrent, label: "Current", bars:{order:1}}, 
  			{data: sProjected, label: "Projected", bars:{order:2}}, 
 			{data: sGoal, label: "Goal", bars:{order:3}},
 			];
 	var leData = [
 	// {data: sCurrent, label: "Current", bars:{order:1}}, 
  // 			{data: sProjected, label: "Projected", bars:{order:2}}, 
 	// 		{data: sGoal, label: "Goal", bars:{order:3}},
 			{data: current, label: "Current", bars:{order:1}}, 
 			{data: projected, label:"Projected", bars:{order:1}}, 
 			{data: goals, label: "Goal",bars:{order:3}}
 			];
    var stack = 0, bars = false, lines = false, steps = false;
	var options = {
			bars: {
				show:true,
				barWidth: 0.2,
				fill:1
			},
			grid: {
				show: true,
			    aboveData: true,
			    color: colours.textcolor ,
			    labelMargin: 5,
			    axisMargin: 0, 
			    borderWidth: 0,
			    borderColor:null,
			    minBorderMargin: 5 ,
			    clickable: true, 
			    hoverable: true,
			    autoHighlight: false,
			    mouseActiveRadius: 20
			},
	        series: {
	        	stack: stack
	        }, 
	        xaxis: {
       		    ticks: [
       		        [0,"SALES"],   
       		    ]
       		},
       		// yaxes: [{min:0},{position: "right", min: 0}],
	        legend: { position: "ne" },
	        colors: [colours.blue, colours.magenta, colours.green],
	        tooltip: true, //activate tooltip
			tooltipOpts: {
				content: "%s : %y.0",
				shifts: {
					x: -30,
					y: -50
				},
				theme: 'dark',
				defaultTheme: false
			}
	};
	// $.plot($("#sales-bars-chart"), salesData, options);
	options2 = options;
	options2.xaxis.ticks = [ [0,"LEADS"],[1,"Estimates"]];
	options2.colors = [colours.brown, colours.yellow, colours.teal];
	$.plot($("#leads-bars-chart"), leData, options2);

};

// var initPieChartPage = function(lineWidth, size, animateTime, colours) {
function initPieChartPage(lineWidth, size, animateTime, colours) {

	$(".easy-pie-chart").easyPieChart({
        barColor: colours.dark,
        borderColor: colours.dark,
        trackColor: colours.gray,
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });
    $(".easy-pie-chart-red").easyPieChart({
        barColor: colours.red,
        borderColor: colours.red,
        trackColor: '#fbccbf',
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });
    $(".easy-pie-chart-green").easyPieChart({
        barColor: colours.green,
        borderColor: colours.green,
        trackColor: '#b1f8b1',
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });
    $(".easy-pie-chart-blue").easyPieChart({
        barColor: colours.blue,
        borderColor: colours.blue,
        trackColor: '#d2e4fb',
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });
    $(".easy-pie-chart-teal").easyPieChart({
        barColor: colours.teal,
        borderColor: colours.teal,
        trackColor: '#c3e5e5',
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });
    $(".easy-pie-chart-purple").easyPieChart({
        barColor: colours.purple,
        borderColor: colours.purple,
        trackColor: '#dec1f5',
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: lineWidth,
        size: size,
        animate: animateTime
    });

};
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

function moneyMe(number){
	return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "$&,")
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
	console.log(closeRate + '-' + Won2Close + '-' + avgSaleOfInterest + '-' + daysRemaining(month));
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
	var numOpened = 0;
	var noDays= noDays*3600*1000*24;
	var prevDay = today - noDays;
	var startDay = new Date(prevDay);
	startDay.setHours(0,0,0,0);
	
	for(var i in data){
		//console.log(i);
		var dataDate= new Date(data[i][0]);
		if(dataDate>=startDay){total+=parseFloat(data[i][1]); numOpened++;}
	}

	console.log('-------' + total + '--------' + numOpened + '-------');
	return total

}

function updateMonthly(){
	var index = $('#monthOfInterest').val();
	var	weight = MONTHLY_WEIGHTS[index][1];
	var salesTarget = goal*weight; 
	var monthSales = d1[index][1];
	console.log (goal + '*' + MONTHLY_WEIGHTS[index][1] + '=' + goal*MONTHLY_WEIGHTS[index][1]);
	var monthGoal = goal*MONTHLY_WEIGHTS[index][1];
	var noLeadsWon = leadsWonByMonth[index][1];
	var sales = salesByMonth[index][1];
	var projectedSales = projectedMonthsSales(index);
	var pctToGoal = (projectedSales/monthGoal*100);	
	var winRate = (isThisMonthMOI(index)) ? Won2Close*100 : leadsWonByMonth[index][1]/leadsClosedByMonth[index][1]*100;
	var lead2close = (isThisMonthMOI(index)) ? noLeadsOpened/noLeadsClosed*100 : leadsOpenByMonth[index][1]/leadsClosedByMonth[index][1]*100 ; 
	var avgSale = (isThisMonthMOI(index)) ? avgSaleOfInterest : salesByMonth[index][1]/leadsWonByMonth[index][1] ; 
	var dollarPerLead = (isThisMonthMOI(index)) ? DPLOfInterest : salesByMonth[index][1]/leadsOpenByMonth[index][1] ; 
	var leadsInPerWeek = (isThisMonthMOI(index)) ? openRate*7 : (leadsOpenByMonth[index][1]/noDays(index)*7) ; 
	var leadsOutPerWeek = (isThisMonthMOI(index)) ? closeRate*7 : (leadsClosedByMonth[index][1]/noDays(index)*7) ; 
	
	//if month is current month populate with previous 30 days data
	// if(today.getMonth() == index){
	// 	alert('oh yeah');
	// }
	// else{ alert("oh no");

	//else populate with actual month data

  	
	$('#monthSalesGoal').html('$' + moneyMe(monthGoal));
	$('#monthSales').html('$'+ moneyMe(monthSales));
	$('#projMonthSales').html('$'+ moneyMe(projectedSales));
	$('#pctToGoal').data('easyPieChart').update(pctToGoal);
	$('#pctToGoalInner').html(pctToGoal.toFixed(0).toString());	
	$('#winRate').data('easyPieChart').update(winRate);
	$('#winRateInner').html(winRate.toFixed(0).toString());	
	$('#leadToClose').data('easyPieChart').update(lead2close);
	$('#leadToCloseInner').html(lead2close.toFixed(0).toString());	
	$('#avgSale').html('$' + moneyMe(avgSale));
	$('#dollarPerLead').html('$' + moneyMe(dollarPerLead));
	$('#leadsPerWeek').html(leadsInPerWeek.toFixed(1));
	$('#closedPerWeek').html(leadsOutPerWeek.toFixed(1));
	// }
	monthSummary(index, colours);

	$(document).on('click', '.addNumber', function(e) {

	    $.post('/user/addNumber?id=' + $(this).attr('name') + '&primaryNumber=' + $('#newNumber').val() + '&fromDash=true', function ( communication ) {
	      	if (communication != 'error') {
	      		console.log(communication);
	      		if (communication == 'not found') {
	      			$('#timelineWrapper').append('<input type= "text" class = "form-control" placeholder = "Add text..." maxlength="160" id="smsBody"><div class = "btn btn-lg btn-primary btn-block sendSMS" name="+1' + $('#newNumber').val() +'">Send</div>');
	      			$('.removeAfterSubmit').remove();
	      			$('#timeLine').prepend('<h2>Looks like there is no communication for this number yet... get one started!');
	      		}
	      			

	      		else {
	      			$('.removeAfterSubmit').remove();
	      			var htmlString = '';
	      			for (var i = 0; i < communication.touches.length; i++) {
	      				
	      				htmlString += '<div class="timeline-item"><div class="row"><div class="col-xs-3 date">';

	      				if (communication.touches[i].inbound == null)
	      					htmlString += '<i class="fa fa-arrow-up"></i>+1' + communication.touches[i].outbound;
	      				else
	      					htmlString += '<i class="fa fa-arrow-down"></i>' + communication.touches[i].inbound;

	      				htmlString += '<br><small class="text-navy">Sent from:<br> Unknown</small></div><div class="col-xs-7 content no-top-border"><p class="m-b-xs"><strong>Message</strong></p>';

	      				if (communication.touches[i].mediaURL != null)
	      					htmlString += ' <img src="' + communication.touches[i].mediaURL + '">';


			            htmlString += '<p>' + communication.touches[i].body + '</p></div></div></div>';  
     
	      			}

	      			$('#timeLine').prepend(htmlString);
	      			$('#timelineWrapper').append('<input type= "text" class = "form-control" placeholder = "Add text..." maxlength="160" id="smsBody"><div class = "btn btn-lg btn-primary btn-block sendSMS" name="+1' + communication.primaryNumber +'">Send</div>'); 
	      		}
	
	      	}	
	   });
	});

	$(document).on('click', '.sendSMS', function(e) {
		this.disabled = true;
		var toNumber = $(this).attr('name');
		toNumber = toNumber.slice(2, 12);
		console.log(toNumber);
		$.post('/touch/outboundSMS?toNumber=' + toNumber + '&body=' + $('#smsBody').val() + '&fromPost=true', function ( touch ) {
          		console.log(touch);

          		var htmlString = '<div class="timeline-item"><div class="row"><div class="col-xs-3 date">';

          		
                htmlString += '<i class="fa fa-arrow-up"></i>+1' + toNumber + '<br><small class="text-navy">Created by:<br>undefined</small>'; 
              
                htmlString += '</div><div class="col-xs-7 content no-top-border"><p class="m-b-xs"><strong>Message</strong></p>';

                htmlString += '<p>' + $('#smsBody').val() + '</p></div></div></div>';

                $('#smsBody').val('');
          		$('#timeLine').prepend(htmlString);
                    
     
         });
	});

}







































