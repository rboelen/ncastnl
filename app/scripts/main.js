 $(document).ready(function() {
	var nvveApp = {
		init: function() {

			if($('body').hasClass('home')){
			
			// Handle Video
			$('.video-bg video, .video-bg object').maximage('maxcover');
			nvveVideo.playVideo('video-home', {'poster': 'http://video-js.zencoder.com/oceans-clip.png'});

			}
			// Fit Video Entries
			$('.entry').fitVids();

			// Scroll Down
			$('.btn-border-down').on('click', function() {
				$.scrollTo($(this).attr('href'), 300, {offset:-64});
				return false;
			});

			// Handle Sticky Menu
			nvveStickyMenu.init();

			// Handle Register Form
			nvveRegister.init();

			// Handle Search Bar
			nvveSearchBar.init();

			// Load more
			$('#load-more-btn').on('click', function() {
				loadMore($(this).attr('href'));
				return false;
			});

			function loadMore(url) {
				if ((! url) || url == '#') {
					return;
				}
				$.get(url)
				.done(function(data) {
					$('.overview').append(data);
				})
				.fail(function(data) {
					// Server error?
				});
			}
		}
	};

	// 'Ported' to jQuery from http://tympanus.net/codrops/2013/06/26/expanding-search-bar-deconstructed/
	var nvveSearchBar = {
		init: function() {

			// Search Suggestions
			var dataset = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
			'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
			'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
			'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
			'North Dakota', 'Northern Marianas Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
			'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Virgin Islands', 'Washington',
			'West Virginia', 'Wisconsin', 'Wyoming'];

			// http://stackoverflow.com/a/11381730/989439
			function mobilecheck() {
				var check = false;
				(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
				return check;
			}

			function SearchBar($el) {
				this.$el = $el;
				this.$inputEl = $el.find('form > input.sb-search-input');
				this.initEvents();
			}

			SearchBar.prototype = {
				initEvents: function () {
					var self = this,
						initSearchFn = function(e) {
							e.stopPropagation();

							self.$inputEl.val(function() {
								return $(this).val().trim();
							});

							if (! self.$el.hasClass('sb-search-open')) {
								e.preventDefault();
								self.open();
							} else if (self.$el.hasClass('sb-search-open') && self.$inputEl.val() === '') {
								console.log(self.$inputEl.val());
								e.preventDefault();
								self.close();
							}
						};

					// Initialize typeahead plugin
					this.$inputEl.typeahead({
						source : dataset,
						items : 4
					});

					this.$el.on('click touchstart', initSearchFn);
					this.$inputEl.on('click touchstart', function(e) {
						e.stopPropagation();
					});
				},
				open: function() {
					var self = this;
					this.$el.addClass('sb-search-open');

					// close all dropdown menus
					$('.dropdown.open .dropdown-toggle').dropdown('toggle');

					// focus the input
					if( !mobilecheck() ) {
						this.$inputEl.focus();
					}
					// close the search input if body is clicked
					var bodyFn = function(e) {
						self.close();
						$(this).off('click touchstart', bodyFn);
					};

					$(document).on('click touchstart', bodyFn);

					// On transition end, set overflow to visibile and remove event listener
					if (Modernizr.csstransitions) {
						this.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
							self.$el.addClass('sb-search-visible');
							self.$el.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
						});
					} else {
						self.$el.addClass('sb-search-visible');
					}
				},
				close: function() {
					this.$inputEl.blur();
					// Remove both classes
					this.$el.removeClass('sb-search-open sb-search-visible');
				}
			};

			var searchbarSearch = new SearchBar($('#sb-search'));
		}
	};

	var nvveStickyMenu = {
		init: function() {
			// Throttle function from underscore
			function throttle(func, wait, immediate) {
				var context, args, timeout, result;
				var previous = 0;
				var later = function() {
					previous = new Date();
					timeout = null;
					result = func.apply(context, args);
				};
				return function() {
					var now = new Date();
					if (!previous && immediate === false) previous = now;
					var remaining = wait - (now - previous);
					context = this;
					args = arguments;
					if (remaining <= 0) {
						clearTimeout(timeout);
						timeout = null;
						previous = now;
						result = func.apply(context, args);
					} else if (!timeout) {
						timeout = setTimeout(later, remaining);
					}
					return result;
				};
			}

			var menuSticky = false,
				$window = $(window);

			var stickyMenu = throttle(function() {
				var $menu = $('.navbar'),
					$body = $('body');

				// If menu is collapsed
				if ($window.width() < 979) {
					// If menu was still sticky
					if (menuSticky) {
						removeSticky();
					}
					return;
				}

				if ($window.scrollTop() > 190) {
					// Sticky menu
					if (! menuSticky ) {
						$menu.addClass('navbar-fixed-top');
						$body.addClass('padded');
						$('.logo-menu').animate({marginLeft:'0px' }, 200);
						menuSticky = true;
					}
				} else {
					// Unsticky menu
					if (menuSticky) {
						removeSticky();
					}
				}

				function removeSticky() {
					$menu.removeClass('navbar-fixed-top');
					$body.removeClass('padded');
					$('.logo-menu').animate({marginLeft:'-60px' }, 200);
					menuSticky = false;
				}
			}, 100);

			$window.scroll(stickyMenu).trigger('scroll');
		}
	};

	var nvveRegister = {
		sent: false,
		init: function() {
			// Populate select options
			$('#geboortedatum-jaar').append(nvveRegister.createYearOptions());

			// (improved) Stepy form plugin
			$('#form-registration').stepy({
				enter: true,
				description: false,
				validate: true,
				block: true,
				errorImage: true,
				back: function() {
					if (nvveRegister.sent) {
						return false;
					}
				},
				select: function(index) {
					$('#form-response').hide();

					if (index == 4) {
						var $fieldsets = this.steps.slice(0, 3),
							$container = $('#form-overview').empty();

						$fieldsets.each(function(i, e) {
							var $that = $(this),
								title = $that.attr('title'),
								context = nvveRegister.getFieldsetValues($that);

							nvveRegister.createFormOverview(title, context, $container);
						});
					}
				},
				backLabel: 'Vorige stap',
				nextLabel: 'Volgende stap'
			}).validate({
				wrapper: 'li',
				errorContainer: '#form-errors',
				errorLabelContainer: '#error-list',
				submitHandler: function(form) {
					if (nvveRegister.sent) {
						return false;
					}
					var $form = $(form),
						action = $form.attr('action'),
						$response = $('#form-response').empty().removeClass('success failure').hide();

					$.post(action, $form.serialize())
					.done(function(data) {
						if (data.status == 'success') {
							$response.html('<p>' + nvveFormTexts.formMessages.success + '</p>').addClass('success').show();
							nvveRegister.sent = true;
							//$form[0].reset();
							$('.stepy-navigator').hide();
						} else {
							// Server side validation error?
						}
					})
					.fail(function(data) {
						// Server is down or something else went wrong?
						$response.html('<p>' + nvveFormTexts.formMessages.error + '</p>').addClass('error').show();
					});
				},
				rules: nvveFormTexts.validationRules,
				messages: nvveFormTexts.validationMessages
			});
		},
		createFormOverview: function(title, context, $container) {
			var html = '';

			switch(title) {
				case 'Persoonlijk':
					html = NVVE.Templates.persoonsgegevens(context);
					break;
				case 'Contact':
					html = NVVE.Templates.contactgegevens(context);
					break;
				case 'Betaling':
					html = NVVE.Templates.betaalgegevens(context);
					break;
				default:
					html = 'Error displaying form information...';
			}

			$container.append(html);
		},
		getFieldsetValues: function($fieldset) {
			// serializeArray() on fieldset does not work in some browsers... IE
			context = {};

			$fieldset.find('input[type="text"], input[type="radio"]:checked, select option:selected, input[type="checkbox"]:checked').each(function(i, e) {
				var $el = $(this);
				if ($el.is('option')) {
					storeValue($el.parents('select').attr('name'), $el.val());
				} else {
					storeValue($el.attr('name'), $el.val());
				}
			});

			function storeValue(name, value) {
				context[name] = value;
			}

			return context;
		},
		createYearOptions: function(span) {
			var yearSpan = span || 100,
				currentYear = new Date().getFullYear(),
				fromYear = currentYear - 18,
				options = [];

			for (var i = 0; i < yearSpan; i++) {
				options.push('<option>' + (fromYear - i) + '</option>');
			}

			return options.join('');
		}
	};

	var nvveVideo = {
		defaultOptions: {
			'preload': 'auto',
			'autoplay': true,
			'controls': false,
			'loop': true
		},
		playVideo: function(id, options) {
			var videoOptions = $.extend({}, this.defaultOptions, options);

			videojs(id, videoOptions, function() {
				var video = this;

				video.volume(0);
				video.play();
			});
		}
	};

	var nvveFormTexts = {
		validationRules: {
			'voornamen': 'required',
			'voorletters': 'required',
			'achternaam': 'required',
			'geslacht': 'required',
			'geboortedatum-dag': { required: true, number: true},
			'geboortedatum-maand': 'required',
			'geboortedatum-jaar': 'required',
			'geboorteplaats': 'required',
			'postcode': 'required',
			'huisnummer': 'required',
			'telefoon': 'required',
			'email': { required: true, email: true},
			'rekeningnummer': 'required',
			'bijdrage': { number: true }
		},
		validationMessages: {
			'voornamen': { required: 'Het <strong>Voornamen</strong> veld is verplicht!' },
			'voorletters': { required: 'Het <strong>Voorletters</strong> veld is verplicht!' },
			'achternaam': { required: 'Het <strong>Achternaam</strong> veld is verplicht!' },
			'geslacht': { required: 'Het <strong>Geslacht</strong> veld is verplicht!' },
			'geboortedatum-dag': { required: 'Het <strong>Geboortedag</strong> veld is verplicht!', number: 'Het <strong>Geboortedag</strong> veld moet een nummer bevatten!'},
			'geboortedatum-maand': { required: 'Het <strong>Geboortemaand</strong> veld is verplicht!' },
			'geboortedatum-jaar': { required: 'Het <strong>Geboortejaar</strong> veld is verplicht!' },
			'geboorteplaats': { required: 'Het <strong>Geboorteplaats</strong> veld is verplicht!' },
			'postcode': { required: 'Het <strong>Postcode</strong> veld is verplicht!' },
			'huisnummer': { required: 'Het <strong>Huisnummer</strong> veld is verplicht!' },
			'telefoon': { required: 'Het <strong>Telefoon</strong> veld is verplicht!' },
			'email': { required: 'Het <strong>E-mail</strong> veld is verplicht!', email: 'Het <strong>E-mail</strong> veld moet een geldig e-mail adres bevatten!' },
			'rekeningnummer': { required: 'Het <strong>Rekeningnummer</strong> veld is verplicht!' },
			'bijdrage': { number: 'Het <strong>Bijdrage</strong> veld moet een nummer bevatten!' }
		},
		formMessages: {
			success: 'Hartelijk bedankt! Het formulier is succesvol verzonden!',
			error: 'Er ging iets fout, probeer het later nog eens of neem contact op met de NVVE'
		}
	};

	nvveApp.init();
 });

