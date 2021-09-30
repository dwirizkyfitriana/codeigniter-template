$(function() {
	$(document).on("click", ".payment-history", function (e) {
    	var newWindow = window.open(APP_DOMAIN + "/srm/payment/history/" + accountName,'_blank');
    });
});