var interval, timeout, timeoutInitial;

var $featuresNav = $('.features-nav');
var $featuresNavItems = $featuresNav.children();
var featuresNavItemsClassName = 'features-nav-item';

var $featuresList = $('.features-list');
var $featuresListItems = $featuresList.children();
var featuresListItemsClassName = 'features-list-item';

$(document).ready(function() {
	var timeoutInitial = setTimeout(function() {
		$('body').removeClass('preload');
		featureSwitch(0);
		interval = setInterval(intervalFunction, 10500);
	}, 5000);

	var first = true;
	var $video = $('video');

	$video.get(0).oncanplaythrough = function () {
		clearTimeout(timeoutInitial);
		$featuresListItems.addClass(featuresListItemsClassName + '--video');
		if (first) {
			$('body').removeClass('preload');
			featureSwitch(0);
			interval = setInterval(intervalFunction, 10500);
			$video.eq(1).append($('<source>').attr('src', $video.eq(1).data('src')));
			setTimeout(function() {
				$('video:gt(1)').each(function(i, el) {
					$(el).append($('<source>').attr('src', $(el).data('src')));
				});
			}, 2000);
			first = false;
		}
	};
	$video.first().append($('<source>').attr('src', $video.first().data('src')));

	$featuresNavItems.on('click', function(e) {
		e.preventDefault();

		var $currentTarget = $(e.currentTarget);
		if ($currentTarget.hasClass(featuresNavItemsClassName + '--active')) {
			return;
		}

		featureSwitch($currentTarget.index());
		clearInterval(interval);
		interval = setInterval(intervalFunction, 10500);
	});

	$('.feature-link').on('click', function(e) {
		if (!isMobile()) {
			e.preventDefault();

			var $v = $('.modal video');

			if ($v.length) {
				$('.modal').addClass('modal--show');
				$v.get(0).play();
			} else {
				var $source = $('<source>')
					.attr('src', $('.modal-content').find('span[data-video-url]').data('videoUrl'))
					.attr('type', 'video/mp4');

				$('<video>')
					.attr('autoplay', true)
					.attr('loop', true)
					.attr('controls', true)
					.on('loadeddata', function() {
						$('.modal').addClass('modal--show');
					})
					.append($source)
					.appendTo($('.modal-content'));
			}
			$('.' + featuresListItemsClassName + '--active').find('video').get(0).pause();
			$('.' + featuresNavItemsClassName + '--active').find('.features-nav-progress').css({
				'animation-play-state': 'paused'
			});
			clearInterval(interval);
			clearTimeout(timeout);
		}
	});

	$('.modal-close').on('click', function(e) {
		e.preventDefault();
		$('.modal').removeClass('modal--show');

		var video = $('.modal').find('video').get(0);
		setTimeout(function() {
			video.pause();
			video.currentTime = 0;
			$('.' + featuresListItemsClassName + '--active').find('video').get(0).play();

			var $progress = $('.' + featuresNavItemsClassName + '--active').find('.features-nav-progress');
			var played = $progress.width() / $('.' + featuresNavItemsClassName + '--active a span').width();
			$progress.css({
				'animation-play-state': 'running'
			});

			timeout = setTimeout(function() {
				intervalFunction();
				interval = setInterval(intervalFunction, 10500);
			}, 10500 - 10500 * played);
		}, 500);
	});

	var isMobile = function() {
		return $(window).width() <= 768;
	};

	$('html')
		.on('swipeleft', function() {
			$featuresNavItems.get(getNextFeature()).click();
		})
		.on('swiperight', function() {
			$featuresNavItems.get(getPrevFeature()).click();
		});
});

var intervalFunction = function() {
	var index = ($('.' + featuresListItemsClassName + '--active').index() + 1) % $featuresListItems.length;
	featureSwitch(index);
};

var getNextFeature = function(index) {
	index = index || 1;
	return ($('.' + featuresListItemsClassName + '--active').index() + index) % $featuresListItems.length;
};

var getPrevFeature = function() {
	return getNextFeature(-1);
};

var featureSwitch = function(index) {
	var $featureActive = $('.' + featuresListItemsClassName + '--active');
	var previousIndex = $featureActive.index();

	if (previousIndex !== -1) {
		setTimeout(function () {
			var v = $('video')[previousIndex];
			v.pause();
			v.currentTime = 0;
		}, 300);
	}

	$featureActive.removeClass(featuresListItemsClassName + '--active');

	$('.' + featuresNavItemsClassName + '--active')
		.removeClass(featuresNavItemsClassName + '--active');

	$('video')[index].play();

	$($featuresListItems[index])
		.addClass(featuresListItemsClassName + '--active');

	$($('.' + featuresNavItemsClassName)[index])
		.addClass(featuresNavItemsClassName + '--active');

};
