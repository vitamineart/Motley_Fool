$(document).ready(function() {


	var previousScroll = 0;
	$(window).scroll(function(event){
		var scroll = $(this).scrollTop();
		if (scroll > previousScroll){
	    	// downscroll code
	    	$('body').removeClass('scrollup').addClass('scrolldown');
		} else {
	    	// upscroll code
	    	$('body').removeClass('scrolldown').addClass('scrollup');
		}
		previousScroll = scroll;
	});


	$('.header-search-wrapper-toggle').click(function() {
		$(this).closest('.header-search-wrapper').toggleClass('open');
	});

	var header = $('header.navigation'),
		focusingMenuLinks = $('header.navigation .main-menu').find('.main-menu-item').not(':first').find('a');
	$('header.navigation .main-menu').find('.main-menu-item').not(':first').hover(function() {
		header.addClass('menu-in-focus');
	}, function() {
		header.removeClass('menu-in-focus');
	});


	$(function(){ // mobile nav functionality
		var menu = $('.mobile-nav-container');
		$('#mobile-menu-toggle').click(function() {
			$(this).toggleClass('close-menu');
			$('body').toggleClass('mobile-menu-open');
			menu.toggleClass('open');
		});

		// $('.close-menu').click(function() {
		// 	menu.removeClass('open');
		// 	$('body').removeClass('mobile-menu-open');

		// });

		$(document).mouseup(function (e) {
		    var container = menu;

		    if (!container.is(e.target) // if the target of the click isn't the container...
		        && !$(".close-menu").is(e.target)
		        && container.has(e.target).length === 0) // ... nor a descendant of the container
		    {
		        container.removeClass('open');
		        $('#mobile-menu-toggle').removeClass('close-menu');
				$('body').removeClass('mobile-menu-open');
		    }
		});


		menu.find('.main-menu-item-link').click(function() {
			$(this).closest('.main-menu-item.dropdown').addClass('expanded');
			return false;
		});
		menu.find('.sub-menu-name').find('.btn-level-up').click(function() {
			$(this).closest('.main-menu-item.dropdown').removeClass('expanded');
		});
	});


	// global expando
	$(function(){
		$('.show-more').click(function() {
			$(this).closest('.expandable').toggleClass('expanded');
			return false;
		});
	});

	$('#main-content').waypoint(function(direction) {
	    if (direction == 'up') {
	    	// $('#share-box').removeClass('visible');
	    } else if (direction =='down') {
	    	$('#share-box').addClass('visible');
	    }
	}, {
		offset: '-600px'
	});


	// sticky header-ads
	// if scroll - start timeout 3sec - sticky
	//
	//


	// HP Services
	$(function(){

		// hp services volatility scale
		var graphItems = [];
		$('.hp-services-volatility-graph-group-item').each(function(index, el) {
		    graphItems.push(el);
		});
		$.each(graphItems, function(index) {
			$(this).outerHeight((index+1)*1.8 + 15);
		});
		if (window.matchMedia('(min-width: 660px)').matches) {
			$.each(graphItems, function(index) {
				$(this).outerHeight((index+1)*2.3 + 25);
			});
		};
		if (window.matchMedia('(min-width: 860px)').matches) {
			$.each(graphItems, function(index) {
				$(this).outerHeight((index+1)*2.8 + 35);
			});
		};

		// hp services tabs functionality
	    var tab = $('.hp-service-tab'),
	        tab_content = $('.hp-services-tabs-content').find('.service-panel');
	    tab.focus(function(){
	        var tab_id = $(this).data('tab');

	        tab.removeClass('active');
	        tab_content.removeClass('active');

	        $(this).addClass('active');
	        $("#"+tab_id).addClass('active');

	        var IND = $(this).index();
	        var graph_Group = $('.hp-services-volatility-graph-group');
	       	graph_Group.eq(IND).nextAll().removeClass('active');
	       	graph_Group.eq(IND).prevAll().andSelf().addClass('active');
	    });
	});


	// services bourbon filter
	var Filter = (function() {
	  function Filter(element) {
	    this._element = $(element);
	    this._optionsContainer = this._element.find(this.constructor.optionsContainerSelector);
	  }

	  Filter.selector = '.filter';
	  Filter.optionsContainerSelector = '> div';
	  Filter.hideOptionsClass = 'hide-options';

	  Filter.enhance = function() {
	    var klass = this;

	    return $(klass.selector).each(function() {
	      return new klass(this).enhance();
	    });
	  };

	  Filter.prototype.enhance = function() {
	    this._buildUI();
	    this._bindEvents();
	  };

	  Filter.prototype._buildUI = function() {
	    this._summaryElement = $('<label></label>').
	      addClass('summary').
	      attr('data-role', 'summary').
	      prependTo(this._optionsContainer);

	    this._clearSelectionButton = $('<button class=clear></button>').
	      text('Clear').
	      attr('type', 'button').
	      insertAfter(this._summaryElement);

	    this._optionsContainer.addClass(this.constructor.hideOptionsClass);
	    this._updateSummary();
	  };

	  Filter.prototype._bindEvents = function() {
	    var self = this;

	    this._summaryElement.click(function() {
	      self._toggleOptions();
	    });

	    this._clearSelectionButton.click(function() {
	      self._clearSelection();
	    });

	    this._checkboxes().change(function() {
	      self._updateSummary();
	    });

	    $('body').click(function(e) {
	      var inFilter = $(e.target).closest(self.constructor.selector).length > 0;

	      if (!inFilter) {
	        self._allOptionsContainers().addClass(self.constructor.hideOptionsClass);
	      }
	    });
	  };

	  Filter.prototype._toggleOptions = function() {
	    this._allOptionsContainers().
	      not(this._optionsContainer).
	      addClass(this.constructor.hideOptionsClass);

	    this._optionsContainer.toggleClass(this.constructor.hideOptionsClass);
	  };

	  Filter.prototype._updateSummary = function() {
	    var summary = 'All';
	    var checked = this._checkboxes().filter(':checked');

	    if (checked.length > 0 && checked.length < this._checkboxes().length) {
	      summary = this._labelsFor(checked).join(', ');
	    }

	    this._summaryElement.text(summary);
	  };

	  Filter.prototype._clearSelection = function() {
	    this._checkboxes().each(function() {
	      $(this).prop('checked', false);
	    });

	    this._updateSummary();
	  };

	  Filter.prototype._checkboxes = function() {
	    return this._element.find(':checkbox');
	  };

	  Filter.prototype._labelsFor = function(inputs) {
	    return inputs.map(function() {
	      var id = $(this).attr('id');
	      return $("label[for='" + id + "']").text();
	    }).get();
	  };

	  Filter.prototype._allOptionsContainers = function() {
	    return $(this.constructor.selector + " " + this.constructor.optionsContainerSelector);
	  };

	  return Filter;
	})();

	$(function() {
	  Filter.enhance();
	});



	// filtering with checkboxes
	var $filterCheckboxes = $('input[type="checkbox"]');

	$('#filter-btn').on('click', function() {

	  var selectedFilters = {};

	  $filterCheckboxes.filter(':checked').each(function() {

	    if (!selectedFilters.hasOwnProperty(this.name)) {
	      selectedFilters[this.name] = [];
	    }

	    selectedFilters[this.name].push(this.value);

	  });

	  // create a collection containing all of the filterable elements
	  var $filteredResults = $('.filterable');

	  // loop over the selected filter name -> (array) values pairs
	  $.each(selectedFilters, function(name, filterValues) {

	    // filter each .flower element
	    $filteredResults = $filteredResults.filter(function() {

	      var matched = false,
	        currentFilterValues = $(this).data('filter').split(' ');

	      // loop over each category value in the current .item's data-filter
	      $.each(currentFilterValues, function(_, currentFilterValue) {

	        // if the current category exists in the selected filters array
	        // set matched to true, and stop looping. as we're ORing in each
	        // set of filters, we only need to match once

	        if ($.inArray(currentFilterValue, filterValues) != -1) {
	          matched = true;
	          return false;
	        }
	      });

	      // if matched is true the current .flower element is returned
	      return matched;

	    });

	  });

	  $('.filterable').hide().filter($filteredResults).show();

	});


});
