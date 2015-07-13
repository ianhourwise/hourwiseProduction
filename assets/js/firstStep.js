$(document).ready(function() {
	var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

	elems.forEach(function(html) {
	  var switchery = new Switchery(html, {color: '#B34A4A'});
	});

	var leadGenCheckBox = elems[0];
	var pipelineCheckBox = elems[1];
	var documentCheckBox = elems[2];

	$('#nextButton').click(function() {
		if ($('#emailInput').val() != '' && $('#nameInput').val() != '')
			window.location.href = '/static/signUp?showLeadGen=' + leadGenCheckBox.checked + '&showPipeline=' + pipelineCheckBox.checked + '&showDocument=' + documentCheckBox.checked + '&email=' + $('#emailInput').val() + '&name=' + $('#nameInput').val() + '&referrer=' + $('#referrerEmail').val();
		else {
			$('#enterEmail').css('display', 'block');
			$('#emailInput').focus();
		}
			
	});

	// $('#emailInput').blur(function() {
	// 	console.log($('#emailInput').val());
	// });

	$('#nameInput').blur(function() {
		if ($('#emailInput').val() != '' && $('#nameInput').val() != '')
			$.post('/static/firstStepData?email=' + $('#emailInput').val() + '&name=' + $('#nameInput').val());
	});

	$('#leadGenHeader').click(function() {
		if (!leadGenCheckBox.checked)
			$(this).css('background', '#EBEBEC');
		else
			$(this).css('background', '#879F48');
	});

	$('#pipelineHeader').click(function() {
		if (!pipelineCheckBox.checked)
			$(this).css('background', '#EBEBEC');
		else
			$(this).css('background', '#879F48');
	});

	$('#documentHeader').click(function() {
		if (!documentCheckBox.checked)
			$(this).css('background', '#EBEBEC');
		else
			$(this).css('background', '#879F48');
	});

	$('#referrer').click(function(ev) {
		ev.preventDefault();

		$('#referrerForm').css('display', 'block');
	});
});