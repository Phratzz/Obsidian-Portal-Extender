window.addEventListener("load", function() {
	jQuery(document).ready(function() {
		var $segments = jQuery(location).attr('href').split("/").splice(0, 5);
		if($segments.length == 4 && ($segments[3] == "characters" || $segments[3] == "characters#")) {
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
			var $groups = new Object();
			var $other = new Array();
		
			jQuery('.filter-options .tag-check-list .row div').each(function() {
				jQuery(this).children("label").each(function() {
					var $split = jQuery(this).children('input').data('tag').split(':');
					if($split.length > 1) {
						if($groups[$split[0]] == undefined) {
							$groups[$split[0]] = new Array();
						}
						$groups[$split[0]].push(jQuery(this));
					} else {
						$other.push(jQuery(this));
					}
				});
			});
			
			/* Insert category for each group */
			var $filters = jQuery('.filter-options form.custom');
			jQuery.each($groups, function($groupKey, $groupValue) {
				$filters.append('<div class="row underlined custom-underlined"><div class="large-12 columns">' + $groupKey + '</div></div>');
				$filters.append('<div class="tag-custom-check-list" filter="' + $groupKey + '"><div class="row"><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div></div></div>');
				
				var $myFilter = $filters.children('.tag-custom-check-list[filter="' + $groupKey + '"]');
				jQuery.each($groupValue, function($tagKey, $tagValue) {
					$myFilter.children('.row').children('.columns:nth-child(' + (($tagKey%4)+1) + ')').append($tagValue);
				});
			});
			
			/* Insert category for each group */
			jQuery('.tag-custom-check-list label').each(function() {
				var $delimiter = jQuery(this).parents('.tag-custom-check-list').attr('filter') + ": ";
				var $html = jQuery(this).html();
				var $htmlArray = $html.split($delimiter);
				var $lastVar = $htmlArray.pop();
				var $restVar = $htmlArray.join($delimiter);
				jQuery(this).html($restVar + $lastVar);
			});
			
			/* Insert category fof remaining tags */
			$filters.append('<div class="row underlined custom-underlined"><div class="large-12 columns">Other</div></div>');
			$filters.append('<div class="tag-custom-check-list" filter="Other"><div class="row"><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div><div class="large-3 columns"></div></div></div>');
			var $myFilter = $filters.children('.tag-custom-check-list[filter="Other"]');
			jQuery.each($other, function($tagKey, $tagValue) {
				$myFilter.children('.row').children('.columns:nth-child(' + (($tagKey%4)+1) + ')').append($tagValue);
			});
			
			/* Remove and unbind old stuff not needed anymore */
			jQuery('form.custom>.underlined:not(".custom-underlined")').remove();
			jQuery('form.custom .tag-check-list').remove();
			jQuery('form.custom *').unbind();
			
			/* Add tags toggle events */
			jQuery('.tag-custom-check-list label').click(function() {
				if(jQuery(this).attr("data-method") == "Add") {
					jQuery(this).attr("data-method", "Sub");
				} else if(jQuery(this).attr("data-method") == "Sub") {
					jQuery(this).removeAttr("data-method");
				} else {
					jQuery(this).attr("data-method", "Add");
				}
				return false;
			});
			
			/* Isotope event */
			var $grid = jQuery('.character-list').find('.character-list-item-container');
			var $filters = {};
			jQuery.each($groups, function($groupKey, $groupValue) {
				$filters[$groupKey] = {};
			});
			$filters['Other'] = {};
			
			jQuery('.tag-custom-check-list label').click(function() {
				var $filterGroup = jQuery(this).parents('.tag-custom-check-list').attr('filter');
				var $filterElement = jQuery(this).children('input').attr('data-tag');
				var $filterOption = jQuery(this).attr('data-method');
				$filters[$filterGroup][$filterElement] = $filterOption;
				if($filterOption == undefined) {
					delete $filters[$filterGroup][$filterElement];
				}
				
				customFilter($filters);
				delete $filterGroup;
				delete $filterElement;
				delete $filterOption;
			});
			jQuery('.custom-filter-options label input').on('change', function() {
				customFilter($filters);
			});
			jQuery('#quick_search').on('keyup paste', function() {
				customFilter($filters);
			});
			
			//$grid.isotope({ filter: '.show-in-filter:not(.hide-in-filter)' });
			/* Custom isotope event */
			function customFilter($filters) {
				jQuery('.character-list .character-list-item-container').each(function() {
					var $character = jQuery(this);
					var $isSet = false;
					$character.removeClass('show-in-filter');
					$character.removeClass('hide-in-filter');
					
					if(jQuery('#quick_search').val() != "") {
						$isSet = true;
						if($character.find('.character-name a').text().toLowerCase().indexOf(jQuery('#quick_search').val().toLowerCase()) != -1) {
							$character.addClass('show-in-filter');
						}
					}
					var $value = jQuery('#quick_search').val();
					
					var $hasFilter = false;
					var $filterExists = false;
					if(jQuery('.pc-npc-filter-options label[for="pc"] input').is(':checked')) {
						$filterExists = true;
						if($character.hasClass('pc')) {
							$hasFilter = true;
						}
					}
					if(jQuery('.pc-npc-filter-options label[for="npc"] input').is(':checked')) {
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
					if(jQuery('.public-gm-only-filter-options label[for="public"] input').is(':checked')) {
						$filterExists = true;
						if(!$character.children('div').hasClass('gm-only')) {
							$hasFilter = true;
						}
					}
					if(jQuery('.public-gm-only-filter-options label[for="gm_only"] input').is(':checked')) {
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
					
					jQuery.each($filters, function($filterKey, $filerValue) {
						var $hasFilter = false;
						var $filterExists = false;
						jQuery.each($filerValue, function($elementKey, $elementValue) {
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
					jQuery(this).hide();
					if(jQuery(this).hasClass("show-in-filter")) {
						if(!jQuery(this).hasClass("hide-in-filter")) {
							jQuery(this).show();
						}
					}
				});
			}
			
			delete $groups;
			delete $tags;
			delete $filters;
			delete $myTags;
			delete $myFilter;
		}
	});
}, false);
