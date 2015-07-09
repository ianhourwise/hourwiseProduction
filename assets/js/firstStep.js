$(document).ready(function() {
	var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

	elems.forEach(function(html) {
	  var switchery = new Switchery(html);
	});

	var leadGenCheckBox = elems[0];
	var pipelineCheckBox = elems[1];
	var documentCheckBox = elems[2];

	$('#nextButton').click(function() {
		if ($('#emailInput').val() != '')
			window.location.href = '/static/signUp?showLeadGen=' + leadGenCheckBox.checked + '&showPipeline=' + pipelineCheckBox.checked + '&showDocument=' + documentCheckBox.checked + '&email=' + $('#emailInput').val() + '&name=' + $('#nameInput').val();
		else
			$('#emailInput').focus();
	});

	// $('#emailInput').blur(function() {
	// 	console.log($('#emailInput').val());
	// });

	$('#nameInput').blur(function() {
		if ($('#emailInput').val() != '' && $('#nameInput').val() != '')
			$.post('/static/firstStepData?email=' + $('#emailInput').val() + '&name=' + $('#nameInput').val());
	});
});