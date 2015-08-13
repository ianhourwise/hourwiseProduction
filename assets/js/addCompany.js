$(document).ready(function() {
	var orgId = '';
	var orgName = '';

	$(document).on('click', '.org', function (e) {
		var selected = $(this).html();
		selected = selected.replace('&amp;', '&');

		for (var i = 0; i < organizations.length; i++) 
			if (organizations[i].name == selected) {
				orgId = organizations[i].id;
				orgName = organizations[i].name;
			}
				
	});

	$(document).on('click', '.next', function (e) {
		window.location.href = '/company/nextStep?organizationId=' + orgId + '&organizationName=' + orgName;
	});
});