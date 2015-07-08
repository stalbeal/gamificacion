
	$(document).ready(function() {
	if ($('#message').val()) {
	$('#errorMessage').append(' <p >' + $('#message').val() + '</p>');
	$("#modalError").modal('show');
	}
	});
