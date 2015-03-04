$(function() {
	MONTHLY_WEIGHTS= [["January",.02], ["February",.05], ["March", .13], ["April", .13], ["May", .13], ["June", .10], ["July", .10], ["August",.07], ["September", .09], ["October", .10], ["November", .06], ["December", .04] ];
		$.get('/user/getUsers', function(users) {
			
			var d1 = [];
			for (var i = 0; i < users.length; i++) {
				d1.push([i, users[i].performanceMetrics.sales.summaryData.won_lead_value.sum + 100000]);
			}

			var d2 = [];
			for (var i = 0; i < users.length; i++) {
				d2.push([i, users[i].performanceMetrics.sales.summaryData.won_lead_value.sum + 40000]);
			}

			var d3 = [];
			for (var i = 0; i < users.length; i++) {
				d3.push([i, users[i].performanceMetrics.sales.summaryData.won_lead_value.sum]);
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

		});
});