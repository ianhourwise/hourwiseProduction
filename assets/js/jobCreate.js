$(document).ready(function() {

	var contactsArray = [];
	var groupsArray = [];
	var productsAndServicesArray =[];

	$('.recipients').on('change', function() {
		if ($(this).val() == 'addNew') {
			$('#contactContainer').append('<form id="newContactForm"><input type= "text" class = "form-control" placeholder = "Name" name="name" id="newName"><hr><input type= "text" class = "form-control" placeholder = "Address" name="address" id="newAddress"><hr><input type= "text" class = "form-control" placeholder = "Phone Number" name="phoneNumber" id="newPhoneNumber"><hr><input type= "text" class = "form-control" placeholder = "Email" name="email" id="newEmail"><hr><input type="hidden" class="form-control" value="<%= user.id %>" name="createdBy"><input type="hidden" class="form-control" value="<%= user.company.id %>" name="company"><input class = "btn btn-lg btn-primary btn-block" id="newContact" value = "Create Contact" /></form>');
	      }
      else {
  		for (var i = 0; i < contacts.length; i++)
				if ($(this).val() == contacts[i].id) {
					var contact = contacts[i];
					contactsArray.push(contacts[i].id);
				}
				

		$('#contactContainer').append('<div class="col-lg-4 removeContact" style="height: 215px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + contact.name + '</strong></h3><h4>' + contact.emails.email1 + '</h4><address>' + contact.addresses.address1 + '<br><abbr title="Phone">P:</abbr>' + contact.phoneNumbers.phoneNumber1 + '</address></div><div class="clearfix"></div></div></div>');
      }
	});

	$("#contactContainer").on('mouseover', '.contact-box', function(){
	    $(this).css("border", "3px solid red");
	});

	$("#contactContainer").on('mouseout', '.contact-box', function(){
	    $(this).css("border", "1px solid #e7eaec");
	});

	$('#contactContainer').on('click', '.removeContact', function() {
		$(this).remove();
	});

	$('.groups').on('change', function() {
		
  		for (var i = 0; i < groups.length; i++)
			if ($(this).val() == groups[i].id) {
				var group = groups[i];
				groupsArray.push(groups[i].id);
			}
				

		$('#groupContainer').append('<div class="col-lg-4 removeContact" style="height: 150px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + group.name + '</strong></h3><address>' + group.address + '</div><div class="clearfix"></div></div></div>');
      
	});

	$('.productsAndServices').on('change', function() {
		
  		if ($(this).val() == 'addNew') {
			$('#productsAndServicesContainer').append('<form id="newProductAndService"><input type= "text" class = "form-control" placeholder = "Name" name="name" id="newNameProduct"><hr><input type= "text" class = "form-control" placeholder = "Description" name="description" id="newDescriptionProduct"><input type="hidden" class="form-control" value="<%= user.id %>" name="createdBy"><input type="hidden" class="form-control" value="<%= user.company.id %>" name="company"><br><input class = "btn btn-lg btn-primary btn-block" id="newProduct" value = "Add Product/Service" /></form>');
	      }
      	else {
	  		for (var i = 0; i < productsAndServices.length; i++)
				if ($(this).val() == productsAndServices[i].id) {
					var product = productsAndServices[i];
					productsAndServicesArray.push(productsAndServices[i]);
				}
					

		$('#productsAndServicesContainer').append('<div class="col-lg-4 removeProduct" style="height: 215px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + product.name + '</strong></h3><h4>' + product.description + '</h4></div><div class="clearfix"></div></div></div>');
      
		}
	});

	$("#productsAndServicesContainer").on('mouseover', '.contact-box', function() {
	    $(this).css("border", "3px solid red");
	    console.log($('#estCloseDate').val());
	});

	$("#productsAndServicesContainer").on('mouseout', '.contact-box', function() {
	    $(this).css("border", "1px solid #e7eaec");
	});

	$('#productsAndServicesContainer').on('click', '.removeProduct', function() {
		$(this).remove();
	});

	$('#submitJob').on('click', function() {
		var jobName = $('#jobName').val();
		var jobDescription = $('#description').val();
		var owner = $('#owner').attr('name');
		var recipients = contactsArray;
		var client = $('#client').val();
		var jobNumber = $('#jobNumber').val();
		var revenue = $('#revenue').val();
		var desiredMargin = $('#desiredMargin').val();
		var street1 = $('#street1').val();
		var street2 = $('#street2').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var zipCode = $('#zipCode').val();
		var source = $('#source').val();
		var endDate = $('#estCloseDate').val();
		var hotness = $('#hotness').val();

		var address = street1 + ', ' + city + ', ' + state + ' ' + zipCode;

		$.post('/job/create?name=' + jobName + '&description=' + jobDescription + '&owner=' + owner + '&recipients=' + recipients + '&jobNumer=' + jobNumber + '&amount=' + revenue + '&desiredMargin=' + desiredMargin + '&address=' + address + '&client=' + client + '&source=' + source + '&groups=' + groupsArray + '&productsAndServices=' + productsAndServicesArray + '&endDate=' + endDate + '&hotness=' + hotness);
	});

	$('#contactContainer').on('click', '#newContact', function() {

		$.post('/contact/newContact/?createdBy=' + user.id + '&name=' + $('#newName').val() + '&address=' + $('#newAddress').val() + '&phoneNumber=' + $('#newPhoneNumber').val() + '&email=' + $('#newEmail').val(), function(contact) {
			if (contact == null)
				console.log(err);

			else {
				contactsArray.push(contact.id);
				$('#newContactForm').remove();
				$('#contactContainer').append('<div class="col-lg-4 removeContact" style="height: 215px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + contact.name + '</strong></h3><h4>' + contact.emails.email1 + '</h4><address>' + contact.addresses.address1 + '<br><abbr title="Phone">P:</abbr>' + contact.phoneNumbers.phoneNumber1 + '</address></div><div class="clearfix"></div></div></div>');
			}
		});
	});

	$('#productsAndServicesContainer').on('click', '#newProduct', function() {

		$.post('/company/newProduct/?createdBy=' + user.id + '&name=' + $('#newNameProduct').val() + '&description=' + $('#newDescriptionProduct').val() + '&company=' + company.id, function(product) {
			if (product == null)
				console.log(err);

			else {
				productsAndServicesArray.push(product.id);
				$('#newProductAndService').remove();
				$('#productsAndServicesContainer').append('<div class="col-lg-4 removeContact" style="height: 215px;"><div class="contact-box"><div class="col-sm-8"><h3><strong>' + product.name + '</strong></h3><h4>' + product.description + '</h4></div><div class="clearfix"></div></div></div>');
			}
		});
	});

});