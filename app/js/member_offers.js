// member offers nav
	$(function(){

	 var tab = $('.member-offers-filter'),
	        tab_content = $('.member-offers-list-category');
	    tab.focus(function(){
	        var tab_id = $(this).data('filter');

	        tab.removeClass('active');
	        tab_content.hide();

	        $(this).addClass('active');
	        $("#"+tab_id).show();
	    })
	});
