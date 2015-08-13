$(document).ready(function() {
	var owner;

	$(document).on('click', '.owner', function (e) {
		for (var i = 0; i < users.length; i++) 
			if (users[i].name == $(this).html())
				owner = users[i];
		console.log(owner.name); 		
	});

	$(document).on('click', '.finish', function (e) {
		$('input:checked').each(function () {
			for (var i = 0; i < users.length; i++) 
				if ($(this).val() == users[i].id && users[i].email != null && users[i].id != owner.id) 
					$.post('/user/create?username=' + users[i].name + '&email=' + users[i].email + '&password=tmpPass1234&fromWizard=true&company=' + $('#orgId').attr('name'), function (user) {

					});

		});

		$.post('/user/create?username=' + owner.name + '&email=' + owner.email + '&password=tmpPass1234&fromWizard=true&company=' + $('#orgId').attr('name'), function (user) {
			$.post('/company/addOwner?companyId=' + $('#orgId').attr('name') + '&user=' + user.id, function (company) {
				if (company != null)
					window.location.href = '/company/show/' + company.id
			});				
		});
	});
});