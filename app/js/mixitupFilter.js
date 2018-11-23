// services filtering
	$(function(){
		var $filterSelect = $('.service-filter-select'),
		$container = $('.cs-services-container');

    	var fool_services_filter = mixitup($container, {
		    animation: {
		        duration: 400,
		        nudge: false,
		        reverseOut: true,
		        easing: 'ease-in-out',
		        effects: "fade translateX(100%) stagger(50ms)"
		    },
		    selectors: {
		    	target: '.cs-services-content-item'
		    },
		    controls: {
	            toggleLogic: 'or'
	        },
		    callbacks: {
	            onMixEnd: function(state) {
	                 console.log('Operation complete');
	                 var state = fool_services_filter.getState();
					console.log(state.totalShow + 'targets are currently shown');
					var quo = $('.cs-services-content').find('.cs-services-content-item').filter(':visible').length;
					$('.cs-services-content').find('.cs-services-content-item').filter(':visible').each(function(index, el) {
							var classnames =  $(this).attr('class');
							console.log(quo, classnames);
					});
	            },
	            onMixFail: function(){
	                console.log('No items were found matching the selected filters.');
	              }
	        }
    	});

		// $filterSelect.on('change', function(){
		// 	fool_services_filter.filter(this.value);
		// });


	});
