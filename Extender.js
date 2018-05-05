window.addEventListener("load", function() {
	$(document).ready(function() {
		/* Extra Functions */
		Array.prototype.clean = function(deleteValue) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == deleteValue) {				 
					this.splice(i, 1);
					i--;
				}
			}
			return this;
		};
		
		/* Setup tags and tag-groups */
		var $groups = new Array('Class', 'Archetype', 'Creature', 'Race', 'God', 'Job', 'Location', 'Sex');
		var $tags = new Array();
		
		$('.filter-options .tag-check-list .row div').each(function() {
			$(this).children("label").each(function() {
				$tags.push($(this));
			});
		});
		
		/* Insert category for each group */
		var $filters = $('.filter-options form.custom');
		$.each($groups, function($groupKey, $groupValue) {
			$filters.append('<div class="row underlined custom-underlined"><div class="large-12 columns">' + $groupValue + '</div></div>');
			$filters.append('<div class="tag-custom-check-list" filter="' + $groupValue + '"><div class="row"><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div></div></div>');
			
			var $myTags = new Array();
			$.each($tags, function($tagKey, $tagValue) {
				if($tagValue.children('input').data('tag').split(':')[0] == $groupValue) {
					$myTags.push($tagValue);
					delete $tags[$tagKey];
				}
			});
			$tags.clean(undefined);
			
			var $myFilter = $filters.children('.tag-custom-check-list[filter="' + $groupValue + '"]');
			$.each($myTags, function($tagKey, $tagValue) {
				$myFilter.children('.row').children('.columns:nth-child(' + (($tagKey%4)+1) + ')').append($tagValue);
			});
		});
		
		/* Insert category for each group */
		$('.tag-custom-check-list label').each(function() {
			var $delimiter = $(this).parents('.tag-custom-check-list').attr('filter') + ": ";
			var $html = $(this).html();
			var $htmlArray = $html.split($delimiter);
			var $lastVar = $htmlArray.pop();
			var $restVar = $htmlArray.join($delimiter);
			$(this).html($restVar + $lastVar);
		});
		
		/* Insert category fof remaining tags */
		$filters.append('<div class="row underlined custom-underlined"><div class="large-12 columns">Other</div></div>');
		$filters.append('<div class="tag-custom-check-list" filter="Other"><div class="row"><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div></div></div>');
		var $myFilter = $filters.children('.tag-custom-check-list[filter="Other"]');
		$.each($tags, function($tagKey, $tagValue) {
			$myFilter.children('.row').children('.columns:nth-child(' + (($tagKey%4)+1) + ')').append($tagValue);
		});
		
		/* Remove and unbind old stuff not needed anymore */
		$('form.custom>.underlined:not(".custom-underlined")').remove();
		$('form.custom .tag-check-list').remove();
		$('form.custom *').unbind();
		
		/* Add tags toggle events */
		$('.tag-custom-check-list label').click(function() {
			if($(this).attr("data-method") == "Add") {
				$(this).attr("data-method", "Sub");
			} else if($(this).attr("data-method") == "Sub") {
				$(this).removeAttr("data-method");
			} else {
				$(this).attr("data-method", "Add");
			}
			return false;
		});
		
		/* Isotope event */
		var $grid = $('.character-list').find('.character-list-item-container');
		var $filters = {};
		$.each($groups, function($groupKey, $groupValue) {
			$filters[$groupValue] = {};
		});
		$filters['Other'] = {};
		
		$('.tag-custom-check-list label').click(function() {
			var $filterGroup = $(this).parents('.tag-custom-check-list').attr('filter');
			var $filterElement = $(this).children('input').attr('data-tag');
			var $filterOption = $(this).attr('data-method');
			$filters[$filterGroup][$filterElement] = $filterOption;
			if($filterOption == undefined) {
				delete $filters[$filterGroup][$filterElement];
			}
			
			customFilter($filters);
			delete $filterGroup;
			delete $filterElement;
			delete $filterOption;
		});
		$('.custom-filter-options label input').on('change', function() {
			customFilter($filters);
		});
		$('#quick_search').on('keyup paste', function() {
			customFilter($filters);
		});
		
		//$grid.isotope({ filter: '.show-in-filter:not(.hide-in-filter)' });
		/* Custom isotope event */
		function customFilter($filters) {
			$('.character-list .character-list-item-container').each(function() {
				var $character = $(this);
				var $isSet = false;
				$character.removeClass('show-in-filter');
				$character.removeClass('hide-in-filter');
				
				if($('#quick_search').val() != "") {
					$isSet = true;
					if($character.find('.character-name a').text().toLowerCase().indexOf($('#quick_search').val().toLowerCase()) != -1) {
						$character.addClass('show-in-filter');
					}
				}
				var $value = $('#quick_search').val();
				
				var $hasFilter = false;
				var $filterExists = false;
				if($('.pc-npc-filter-options label[for="pc"] input').is(':checked')) {
					$filterExists = true;
					if($character.hasClass('pc')) {
						$hasFilter = true;
					}
				}
				if($('.pc-npc-filter-options label[for="npc"] input').is(':checked')) {
					$filterExists = true;
					if($character.hasClass('npc')) {
						$hasFilter = true;
					}
				}
				if($hasFilter && $filterExists) {
					$character.addClass('show-in-filter');
					$isSet = true;
				} else if($filterExists) {
					$character.removeClass('show-in-filter');
					$isSet = true;
				}
				
				var $hasFilter = false;
				var $filterExists = false;
				if($('.public-gm-only-filter-options label[for="public"] input').is(':checked')) {
					$filterExists = true;
					if(!$character.children('div').hasClass('gm-only')) {
						$hasFilter = true;
					}
				}
				if($('.public-gm-only-filter-options label[for="gm_only"] input').is(':checked')) {
					$filterExists = true;
					if($character.children('div').hasClass('gm-only')) {
						$hasFilter = true;
					}
				}
				if($hasFilter && $filterExists) {
					$character.addClass('show-in-filter');
					$isSet = true;
				} else if($filterExists) {
					$character.removeClass('show-in-filter');
					$isSet = true;
				}
				
				$.each($filters, function($filterKey, $filerValue) {
					var $hasFilter = false;
					var $filterExists = false;
					$.each($filerValue, function($elementKey, $elementValue) {
						if($elementValue == "Add") { $filterExists = true; }
						if(($elementValue == "Add") && (!$isSet || $character.hasClass('show-in-filter'))) {
							if($character.find('.tags-list a[data-tag="' + $elementKey + '"]').attr('data-tag') == $elementKey) {
								$hasFilter = true;
							}
						} else if($elementValue == "Sub" && (!$isSet || $character.hasClass('show-in-filter'))) {
							if($character.find('.tags-list a[data-tag="' + $elementKey + '"]').attr('data-tag') == $elementKey) {
								$character.addClass('hide-in-filter');
							}
						}
					});
					if($hasFilter && $filterExists) {
						$character.addClass('show-in-filter');
						$isSet = true;
					} else if($filterExists) {
						$character.removeClass('show-in-filter');
						$isSet = true;
					}
				});
				if(!$isSet) {
					$character.addClass('show-in-filter');
				}
			});
			delete $hasFilter;
			delete $character;
			delete $isSet;
			
			$grid.each(function() {
				$(this).hide();
				if($(this).hasClass("show-in-filter")) {
					if(!$(this).hasClass("hide-in-filter")) {
						$(this).show();
					}
				}
			});
		}
		
		delete $groups;
		delete $tags;
		delete $filters;
		delete $myTags;
		delete $myFilter;
	});
}, false);
