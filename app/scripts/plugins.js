// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);


/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/*! Video.js v4.11.3 Copyright 2014 Brightcove, Inc. https://github.com/videojs/video.js/blob/master/LICENSE */ 
(function() {var b=void 0,f=!0,k=null,l=!1;function m(){return function(){}}function n(a){return function(){return this[a]}}function r(a){return function(){return a}}var s;document.createElement("video");document.createElement("audio");document.createElement("track");function t(a,c,d){if("string"===typeof a){0===a.indexOf("#")&&(a=a.slice(1));if(t.Fa[a])return t.Fa[a];a=t.w(a)}if(!a||!a.nodeName)throw new TypeError("The element or ID supplied is not valid. (videojs)");return a.player||new t.Player(a,c,d)}
var videojs=window.videojs=t;t.Zb="4.11";t.ed="https:"==document.location.protocol?"https://":"http://";
t.options={techOrder:["html5","flash"],html5:{},flash:{},width:300,height:150,defaultVolume:0,playbackRates:[],inactivityTimeout:2E3,children:{mediaLoader:{},posterImage:{},textTrackDisplay:{},loadingSpinner:{},bigPlayButton:{},controlBar:{},errorDisplay:{}},language:document.getElementsByTagName("html")[0].getAttribute("lang")||navigator.languages&&navigator.languages[0]||navigator.Ke||navigator.language||"en",languages:{},notSupportedMessage:"No compatible source was found for this video."};
"GENERATED_CDN_VSN"!==t.Zb&&(videojs.options.flash.swf=t.ed+"vjs.zencdn.net/"+t.Zb+"/video-js.swf");t.sd=function(a,c){t.options.languages[a]=t.options.languages[a]!==b?t.Z.Ea(t.options.languages[a],c):c;return t.options.languages};t.Fa={};"function"===typeof define&&define.amd?define([],function(){return videojs}):"object"===typeof exports&&"object"===typeof module&&(module.exports=videojs);t.ua=t.CoreObject=m();
t.ua.extend=function(a){var c,d;a=a||{};c=a.init||a.i||this.prototype.init||this.prototype.i||m();d=function(){c.apply(this,arguments)};d.prototype=t.h.create(this.prototype);d.prototype.constructor=d;d.extend=t.ua.extend;d.create=t.ua.create;for(var e in a)a.hasOwnProperty(e)&&(d.prototype[e]=a[e]);return d};t.ua.create=function(){var a=t.h.create(this.prototype);this.apply(a,arguments);return a};
t.c=function(a,c,d){if(t.h.isArray(c))return u(t.c,a,c,d);var e=t.getData(a);e.C||(e.C={});e.C[c]||(e.C[c]=[]);d.p||(d.p=t.p++);e.C[c].push(d);e.W||(e.disabled=l,e.W=function(c){if(!e.disabled){c=t.Ac(c);var d=e.C[c.type];if(d)for(var d=d.slice(0),j=0,p=d.length;j<p&&!c.Hc();j++)d[j].call(a,c)}});1==e.C[c].length&&(a.addEventListener?a.addEventListener(c,e.W,l):a.attachEvent&&a.attachEvent("on"+c,e.W))};
t.k=function(a,c,d){if(t.Cc(a)){var e=t.getData(a);if(e.C){if(t.h.isArray(c))return u(t.k,a,c,d);if(c){var g=e.C[c];if(g){if(d){if(d.p)for(e=0;e<g.length;e++)g[e].p===d.p&&g.splice(e--,1)}else e.C[c]=[];t.qc(a,c)}}else for(g in e.C)c=g,e.C[c]=[],t.qc(a,c)}}};t.qc=function(a,c){var d=t.getData(a);0===d.C[c].length&&(delete d.C[c],a.removeEventListener?a.removeEventListener(c,d.W,l):a.detachEvent&&a.detachEvent("on"+c,d.W));t.Lb(d.C)&&(delete d.C,delete d.W,delete d.disabled);t.Lb(d)&&t.Qc(a)};
t.Ac=function(a){function c(){return f}function d(){return l}if(!a||!a.Mb){var e=a||window.event;a={};for(var g in e)"layerX"!==g&&("layerY"!==g&&"keyLocation"!==g)&&("returnValue"==g&&e.preventDefault||(a[g]=e[g]));a.target||(a.target=a.srcElement||document);a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;a.preventDefault=function(){e.preventDefault&&e.preventDefault();a.returnValue=l;a.Nd=c;a.defaultPrevented=f};a.Nd=d;a.defaultPrevented=l;a.stopPropagation=function(){e.stopPropagation&&
e.stopPropagation();a.cancelBubble=f;a.Mb=c};a.Mb=d;a.stopImmediatePropagation=function(){e.stopImmediatePropagation&&e.stopImmediatePropagation();a.Hc=c;a.stopPropagation()};a.Hc=d;if(a.clientX!=k){g=document.documentElement;var h=document.body;a.pageX=a.clientX+(g&&g.scrollLeft||h&&h.scrollLeft||0)-(g&&g.clientLeft||h&&h.clientLeft||0);a.pageY=a.clientY+(g&&g.scrollTop||h&&h.scrollTop||0)-(g&&g.clientTop||h&&h.clientTop||0)}a.which=a.charCode||a.keyCode;a.button!=k&&(a.button=a.button&1?0:a.button&
4?1:a.button&2?2:0)}return a};t.l=function(a,c){var d=t.Cc(a)?t.getData(a):{},e=a.parentNode||a.ownerDocument;"string"===typeof c&&(c={type:c,target:a});c=t.Ac(c);d.W&&d.W.call(a,c);if(e&&!c.Mb()&&c.bubbles!==l)t.l(e,c);else if(!e&&!c.defaultPrevented&&(d=t.getData(c.target),c.target[c.type])){d.disabled=f;if("function"===typeof c.target[c.type])c.target[c.type]();d.disabled=l}return!c.defaultPrevented};
t.Q=function(a,c,d){function e(){t.k(a,c,e);d.apply(this,arguments)}if(t.h.isArray(c))return u(t.Q,a,c,d);e.p=d.p=d.p||t.p++;t.c(a,c,e)};function u(a,c,d,e){t.nc.forEach(d,function(d){a(c,d,e)})}var v=Object.prototype.hasOwnProperty;t.e=function(a,c){var d;c=c||{};d=document.createElement(a||"div");t.h.X(c,function(a,c){-1!==a.indexOf("aria-")||"role"==a?d.setAttribute(a,c):d[a]=c});return d};t.ba=function(a){return a.charAt(0).toUpperCase()+a.slice(1)};t.h={};
t.h.create=Object.create||function(a){function c(){}c.prototype=a;return new c};t.h.X=function(a,c,d){for(var e in a)v.call(a,e)&&c.call(d||this,e,a[e])};t.h.z=function(a,c){if(!c)return a;for(var d in c)v.call(c,d)&&(a[d]=c[d]);return a};t.h.Ad=function(a,c){var d,e,g;a=t.h.copy(a);for(d in c)v.call(c,d)&&(e=a[d],g=c[d],a[d]=t.h.Ya(e)&&t.h.Ya(g)?t.h.Ad(e,g):c[d]);return a};t.h.copy=function(a){return t.h.z({},a)};
t.h.Ya=function(a){return!!a&&"object"===typeof a&&"[object Object]"===a.toString()&&a.constructor===Object};t.h.isArray=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};t.Pd=function(a){return a!==a};t.bind=function(a,c,d){function e(){return c.apply(a,arguments)}c.p||(c.p=t.p++);e.p=d?d+"_"+c.p:c.p;return e};t.xa={};t.p=1;t.expando="vdata"+(new Date).getTime();t.getData=function(a){var c=a[t.expando];c||(c=a[t.expando]=t.p++,t.xa[c]={});return t.xa[c]};
t.Cc=function(a){a=a[t.expando];return!(!a||t.Lb(t.xa[a]))};t.Qc=function(a){var c=a[t.expando];if(c){delete t.xa[c];try{delete a[t.expando]}catch(d){a.removeAttribute?a.removeAttribute(t.expando):a[t.expando]=k}}};t.Lb=function(a){for(var c in a)if(a[c]!==k)return l;return f};t.Xa=function(a,c){return-1!==(" "+a.className+" ").indexOf(" "+c+" ")};t.n=function(a,c){t.Xa(a,c)||(a.className=""===a.className?c:a.className+" "+c)};
t.r=function(a,c){var d,e;if(t.Xa(a,c)){d=a.className.split(" ");for(e=d.length-1;0<=e;e--)d[e]===c&&d.splice(e,1);a.className=d.join(" ")}};t.A=t.e("video");t.N=navigator.userAgent;t.md=/iPhone/i.test(t.N);t.ld=/iPad/i.test(t.N);t.nd=/iPod/i.test(t.N);t.kd=t.md||t.ld||t.nd;var aa=t,x;var y=t.N.match(/OS (\d+)_/i);x=y&&y[1]?y[1]:b;aa.Ae=x;t.hd=/Android/i.test(t.N);var ba=t,z;var A=t.N.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),B,C;
A?(B=A[1]&&parseFloat(A[1]),C=A[2]&&parseFloat(A[2]),z=B&&C?parseFloat(A[1]+"."+A[2]):B?B:k):z=k;ba.Yb=z;t.od=t.hd&&/webkit/i.test(t.N)&&2.3>t.Yb;t.jd=/Firefox/i.test(t.N);t.Be=/Chrome/i.test(t.N);t.jc=!!("ontouchstart"in window||window.gd&&document instanceof window.gd);t.fd="backgroundSize"in t.A.style;t.Tc=function(a,c){t.h.X(c,function(c,e){e===k||"undefined"===typeof e||e===l?a.removeAttribute(c):a.setAttribute(c,e===f?"":e)})};
t.Ca=function(a){var c,d,e,g;c={};if(a&&a.attributes&&0<a.attributes.length){d=a.attributes;for(var h=d.length-1;0<=h;h--){e=d[h].name;g=d[h].value;if("boolean"===typeof a[e]||-1!==",autoplay,controls,loop,muted,default,".indexOf(","+e+","))g=g!==k?f:l;c[e]=g}}return c};
t.He=function(a,c){var d="";document.defaultView&&document.defaultView.getComputedStyle?d=document.defaultView.getComputedStyle(a,"").getPropertyValue(c):a.currentStyle&&(d=a["client"+c.substr(0,1).toUpperCase()+c.substr(1)]+"px");return d};t.Kb=function(a,c){c.firstChild?c.insertBefore(a,c.firstChild):c.appendChild(a)};t.Sa={};t.w=function(a){0===a.indexOf("#")&&(a=a.slice(1));return document.getElementById(a)};
t.Ba=function(a,c){c=c||a;var d=Math.floor(a%60),e=Math.floor(a/60%60),g=Math.floor(a/3600),h=Math.floor(c/60%60),j=Math.floor(c/3600);if(isNaN(a)||Infinity===a)g=e=d="-";g=0<g||0<j?g+":":"";return g+(((g||10<=h)&&10>e?"0"+e:e)+":")+(10>d?"0"+d:d)};t.ud=function(){document.body.focus();document.onselectstart=r(l)};t.ve=function(){document.onselectstart=r(f)};t.trim=function(a){return(a+"").replace(/^\s+|\s+$/g,"")};t.round=function(a,c){c||(c=0);return Math.round(a*Math.pow(10,c))/Math.pow(10,c)};
t.Ab=function(a,c){return{length:1,start:function(){return a},end:function(){return c}}};t.je=function(a){try{var c=window.localStorage||l;c&&(c.volume=a)}catch(d){22==d.code||1014==d.code?t.log("LocalStorage Full (VideoJS)",d):18==d.code?t.log("LocalStorage not allowed (VideoJS)",d):t.log("LocalStorage Error (VideoJS)",d)}};t.Jd=function(a){a.match(/^https?:\/\//)||(a=t.e("div",{innerHTML:'<a href="'+a+'">x</a>'}).firstChild.href);return a};
t.fe=function(a){var c,d,e,g;g="protocol hostname port pathname search hash host".split(" ");d=t.e("a",{href:a});if(e=""===d.host&&"file:"!==d.protocol)c=t.e("div"),c.innerHTML='<a href="'+a+'"></a>',d=c.firstChild,c.setAttribute("style","display:none; position:absolute;"),document.body.appendChild(c);a={};for(var h=0;h<g.length;h++)a[g[h]]=d[g[h]];e&&document.body.removeChild(c);return a};
function D(a,c){var d,e;d=Array.prototype.slice.call(c);e=m();e=window.console||{log:e,warn:e,error:e};a?d.unshift(a.toUpperCase()+":"):a="log";t.log.history.push(d);d.unshift("VIDEOJS:");if(e[a].apply)e[a].apply(e,d);else e[a](d.join(" "))}t.log=function(){D(k,arguments)};t.log.history=[];t.log.error=function(){D("error",arguments)};t.log.warn=function(){D("warn",arguments)};
t.Hd=function(a){var c,d;a.getBoundingClientRect&&a.parentNode&&(c=a.getBoundingClientRect());if(!c)return{left:0,top:0};a=document.documentElement;d=document.body;return{left:t.round(c.left+(window.pageXOffset||d.scrollLeft)-(a.clientLeft||d.clientLeft||0)),top:t.round(c.top+(window.pageYOffset||d.scrollTop)-(a.clientTop||d.clientTop||0))}};t.nc={};t.nc.forEach=function(a,c,d){if(t.h.isArray(a)&&c instanceof Function)for(var e=0,g=a.length;e<g;++e)c.call(d||t,a[e],e,a);return a};
t.ye=function(a,c){var d,e,g,h,j,p,q;"string"===typeof a&&(a={uri:a});videojs.Z.Ea({method:"GET",timeout:45E3},a);c=c||m();p=function(){window.clearTimeout(j);c(k,e,e.response||e.responseText)};q=function(a){window.clearTimeout(j);if(!a||"string"===typeof a)a=Error(a);c(a,e)};d=window.XMLHttpRequest;"undefined"===typeof d&&(d=function(){try{return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(c){}try{return new window.ActiveXObject("Msxml2.XMLHTTP")}catch(d){}throw Error("This browser does not support XMLHttpRequest.");
});e=new d;e.uri=a.uri;d=t.fe(a.uri);g=window.location;d.protocol+d.host!==g.protocol+g.host&&window.XDomainRequest&&!("withCredentials"in e)?(e=new window.XDomainRequest,e.onload=p,e.onerror=q,e.onprogress=m(),e.ontimeout=m()):(h="file:"==d.protocol||"file:"==g.protocol,e.onreadystatechange=function(){if(4===e.readyState){if(e.te)return q("timeout");200===e.status||h&&0===e.status?p():q()}},a.timeout&&(j=window.setTimeout(function(){4!==e.readyState&&(e.te=f,e.abort())},a.timeout)));try{e.open(a.method||
"GET",a.uri,f)}catch(w){q(w);return}a.withCredentials&&(e.withCredentials=f);a.responseType&&(e.responseType=a.responseType);try{e.send()}catch(ja){q(ja)}};t.Z={};t.Z.Ea=function(a,c){var d,e,g;a=t.h.copy(a);for(d in c)c.hasOwnProperty(d)&&(e=a[d],g=c[d],a[d]=t.h.Ya(e)&&t.h.Ya(g)?t.Z.Ea(e,g):c[d]);return a};
t.a=t.ua.extend({i:function(a,c,d){this.d=a;this.m=t.h.copy(this.m);c=this.options(c);this.K=c.id||c.el&&c.el.id;this.K||(this.K=(a.id&&a.id()||"no_player")+"_component_"+t.p++);this.Vd=c.name||k;this.b=c.el||this.e();this.O=[];this.Ua={};this.Va={};this.Ec();this.H(d);if(c.Rc!==l){var e,g;this.j().reportUserActivity&&(e=t.bind(this.j(),this.j().reportUserActivity),this.c("touchstart",function(){e();this.clearInterval(g);g=this.setInterval(e,250)}),a=function(){e();this.clearInterval(g)},this.c("touchmove",
e),this.c("touchend",a),this.c("touchcancel",a))}}});s=t.a.prototype;s.dispose=function(){this.l({type:"dispose",bubbles:l});if(this.O)for(var a=this.O.length-1;0<=a;a--)this.O[a].dispose&&this.O[a].dispose();this.Va=this.Ua=this.O=k;this.k();this.b.parentNode&&this.b.parentNode.removeChild(this.b);t.Qc(this.b);this.b=k};s.d=f;s.j=n("d");s.options=function(a){return a===b?this.m:this.m=t.Z.Ea(this.m,a)};s.e=function(a,c){return t.e(a,c)};
s.t=function(a){var c=this.d.language(),d=this.d.languages();return d&&d[c]&&d[c][a]?d[c][a]:a};s.w=n("b");s.ma=function(){return this.v||this.b};s.id=n("K");s.name=n("Vd");s.children=n("O");s.Kd=function(a){return this.Ua[a]};s.na=function(a){return this.Va[a]};
s.U=function(a,c){var d,e;"string"===typeof a?(e=a,c=c||{},d=c.componentClass||t.ba(e),c.name=e,d=new window.videojs[d](this.d||this,c)):d=a;this.O.push(d);"function"===typeof d.id&&(this.Ua[d.id()]=d);(e=e||d.name&&d.name())&&(this.Va[e]=d);"function"===typeof d.el&&d.el()&&this.ma().appendChild(d.el());return d};
s.removeChild=function(a){"string"===typeof a&&(a=this.na(a));if(a&&this.O){for(var c=l,d=this.O.length-1;0<=d;d--)if(this.O[d]===a){c=f;this.O.splice(d,1);break}c&&(this.Ua[a.id]=k,this.Va[a.name]=k,(c=a.w())&&c.parentNode===this.ma()&&this.ma().removeChild(a.w()))}};
s.Ec=function(){var a,c,d,e,g,h;a=this;c=a.options();if(d=c.children)if(h=function(d,e){c[d]!==b&&(e=c[d]);e!==l&&(a[d]=a.U(d,e))},t.h.isArray(d))for(var j=0;j<d.length;j++)e=d[j],"string"==typeof e?(g=e,e={}):g=e.name,h(g,e);else t.h.X(d,h)};s.S=r("");
s.c=function(a,c,d){var e,g,h;"string"===typeof a||t.h.isArray(a)?t.c(this.b,a,t.bind(this,c)):(e=t.bind(this,d),h=this,g=function(){h.k(a,c,e)},g.p=e.p,this.c("dispose",g),d=function(){h.k("dispose",g)},d.p=e.p,a.nodeName?(t.c(a,c,e),t.c(a,"dispose",d)):"function"===typeof a.c&&(a.c(c,e),a.c("dispose",d)));return this};
s.k=function(a,c,d){!a||"string"===typeof a||t.h.isArray(a)?t.k(this.b,a,c):(d=t.bind(this,d),this.k("dispose",d),a.nodeName?(t.k(a,c,d),t.k(a,"dispose",d)):(a.k(c,d),a.k("dispose",d)));return this};s.Q=function(a,c,d){var e,g,h;"string"===typeof a||t.h.isArray(a)?t.Q(this.b,a,t.bind(this,c)):(e=t.bind(this,d),g=this,h=function(){g.k(a,c,h);e.apply(this,arguments)},h.p=e.p,this.c(a,c,h));return this};s.l=function(a){t.l(this.b,a);return this};
s.H=function(a){a&&(this.oa?a.call(this):(this.eb===b&&(this.eb=[]),this.eb.push(a)));return this};s.Ka=function(){this.oa=f;var a=this.eb;if(a&&0<a.length){for(var c=0,d=a.length;c<d;c++)a[c].call(this);this.eb=[];this.l("ready")}};s.Xa=function(a){return t.Xa(this.b,a)};s.n=function(a){t.n(this.b,a);return this};s.r=function(a){t.r(this.b,a);return this};s.show=function(){this.b.style.display="block";return this};s.Y=function(){this.b.style.display="none";return this};
function E(a){a.r("vjs-lock-showing")}s.disable=function(){this.Y();this.show=m()};s.width=function(a,c){return F(this,"width",a,c)};s.height=function(a,c){return F(this,"height",a,c)};s.Dd=function(a,c){return this.width(a,f).height(c)};
function F(a,c,d,e){if(d!==b){if(d===k||t.Pd(d))d=0;a.b.style[c]=-1!==(""+d).indexOf("%")||-1!==(""+d).indexOf("px")?d:"auto"===d?"":d+"px";e||a.l("resize");return a}if(!a.b)return 0;d=a.b.style[c];e=d.indexOf("px");return-1!==e?parseInt(d.slice(0,e),10):parseInt(a.b["offset"+t.ba(c)],10)}
function G(a){var c,d,e,g,h,j,p,q;c=0;d=k;a.c("touchstart",function(a){1===a.touches.length&&(d=a.touches[0],c=(new Date).getTime(),g=f)});a.c("touchmove",function(a){1<a.touches.length?g=l:d&&(j=a.touches[0].pageX-d.pageX,p=a.touches[0].pageY-d.pageY,q=Math.sqrt(j*j+p*p),22<q&&(g=l))});h=function(){g=l};a.c("touchleave",h);a.c("touchcancel",h);a.c("touchend",function(a){d=k;g===f&&(e=(new Date).getTime()-c,250>e&&(a.preventDefault(),this.l("tap")))})}
s.setTimeout=function(a,c){function d(){this.clearTimeout(e)}a=t.bind(this,a);var e=setTimeout(a,c);d.p="vjs-timeout-"+e;this.c("dispose",d);return e};s.clearTimeout=function(a){function c(){}clearTimeout(a);c.p="vjs-timeout-"+a;this.k("dispose",c);return a};s.setInterval=function(a,c){function d(){this.clearInterval(e)}a=t.bind(this,a);var e=setInterval(a,c);d.p="vjs-interval-"+e;this.c("dispose",d);return e};
s.clearInterval=function(a){function c(){}clearInterval(a);c.p="vjs-interval-"+a;this.k("dispose",c);return a};t.u=t.a.extend({i:function(a,c){t.a.call(this,a,c);G(this);this.c("tap",this.s);this.c("click",this.s);this.c("focus",this.bb);this.c("blur",this.ab)}});s=t.u.prototype;
s.e=function(a,c){var d;c=t.h.z({className:this.S(),role:"button","aria-live":"polite",tabIndex:0},c);d=t.a.prototype.e.call(this,a,c);c.innerHTML||(this.v=t.e("div",{className:"vjs-control-content"}),this.yb=t.e("span",{className:"vjs-control-text",innerHTML:this.t(this.la)||"Need Text"}),this.v.appendChild(this.yb),d.appendChild(this.v));return d};s.S=function(){return"vjs-control "+t.a.prototype.S.call(this)};s.s=m();s.bb=function(){t.c(document,"keydown",t.bind(this,this.ea))};
s.ea=function(a){if(32==a.which||13==a.which)a.preventDefault(),this.s()};s.ab=function(){t.k(document,"keydown",t.bind(this,this.ea))};t.R=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.td=this.na(this.m.barName);this.handle=this.na(this.m.handleName);this.c("mousedown",this.cb);this.c("touchstart",this.cb);this.c("focus",this.bb);this.c("blur",this.ab);this.c("click",this.s);this.c(a,"controlsvisible",this.update);this.c(a,this.Mc,this.update)}});s=t.R.prototype;
s.e=function(a,c){c=c||{};c.className+=" vjs-slider";c=t.h.z({role:"slider","aria-valuenow":0,"aria-valuemin":0,"aria-valuemax":100,tabIndex:0},c);return t.a.prototype.e.call(this,a,c)};s.cb=function(a){a.preventDefault();t.ud();this.n("vjs-sliding");this.c(document,"mousemove",this.fa);this.c(document,"mouseup",this.qa);this.c(document,"touchmove",this.fa);this.c(document,"touchend",this.qa);this.fa(a)};s.fa=m();
s.qa=function(){t.ve();this.r("vjs-sliding");this.k(document,"mousemove",this.fa);this.k(document,"mouseup",this.qa);this.k(document,"touchmove",this.fa);this.k(document,"touchend",this.qa);this.update()};s.update=function(){if(this.b){var a,c=this.Ib(),d=this.handle,e=this.td;isNaN(c)&&(c=0);a=c;if(d){a=this.b.offsetWidth;var g=d.w().offsetWidth;a=g?g/a:0;c*=1-a;a=c+a/2;d.w().style.left=t.round(100*c,2)+"%"}e&&(e.w().style.width=t.round(100*a,2)+"%")}};
function H(a,c){var d,e,g,h;d=a.b;e=t.Hd(d);h=g=d.offsetWidth;d=a.handle;if(a.options().vertical)return h=e.top,e=c.changedTouches?c.changedTouches[0].pageY:c.pageY,d&&(d=d.w().offsetHeight,h+=d/2,g-=d),Math.max(0,Math.min(1,(h-e+g)/g));g=e.left;e=c.changedTouches?c.changedTouches[0].pageX:c.pageX;d&&(d=d.w().offsetWidth,g+=d/2,h-=d);return Math.max(0,Math.min(1,(e-g)/h))}s.bb=function(){this.c(document,"keydown",this.ea)};
s.ea=function(a){if(37==a.which||40==a.which)a.preventDefault(),this.Xc();else if(38==a.which||39==a.which)a.preventDefault(),this.Yc()};s.ab=function(){this.k(document,"keydown",this.ea)};s.s=function(a){a.stopImmediatePropagation();a.preventDefault()};t.$=t.a.extend();t.$.prototype.defaultValue=0;t.$.prototype.e=function(a,c){c=c||{};c.className+=" vjs-slider-handle";c=t.h.z({innerHTML:'<span class="vjs-control-text">'+this.defaultValue+"</span>"},c);return t.a.prototype.e.call(this,"div",c)};
t.ja=t.a.extend();function ca(a,c){a.U(c);c.c("click",t.bind(a,function(){E(this)}))}t.ja.prototype.e=function(){var a=this.options().sc||"ul";this.v=t.e(a,{className:"vjs-menu-content"});a=t.a.prototype.e.call(this,"div",{append:this.v,className:"vjs-menu"});a.appendChild(this.v);t.c(a,"click",function(a){a.preventDefault();a.stopImmediatePropagation()});return a};t.J=t.u.extend({i:function(a,c){t.u.call(this,a,c);this.selected(c.selected)}});
t.J.prototype.e=function(a,c){return t.u.prototype.e.call(this,"li",t.h.z({className:"vjs-menu-item",innerHTML:this.t(this.m.label)},c))};t.J.prototype.s=function(){this.selected(f)};t.J.prototype.selected=function(a){a?(this.n("vjs-selected"),this.b.setAttribute("aria-selected",f)):(this.r("vjs-selected"),this.b.setAttribute("aria-selected",l))};
t.L=t.u.extend({i:function(a,c){t.u.call(this,a,c);this.Da=this.za();this.U(this.Da);this.P&&0===this.P.length&&this.Y();this.c("keydown",this.ea);this.b.setAttribute("aria-haspopup",f);this.b.setAttribute("role","button")}});s=t.L.prototype;s.wa=l;s.za=function(){var a=new t.ja(this.d);this.options().title&&a.ma().appendChild(t.e("li",{className:"vjs-menu-title",innerHTML:t.ba(this.options().title),re:-1}));if(this.P=this.createItems())for(var c=0;c<this.P.length;c++)ca(a,this.P[c]);return a};
s.ya=m();s.S=function(){return this.className+" vjs-menu-button "+t.u.prototype.S.call(this)};s.bb=m();s.ab=m();s.s=function(){this.Q("mouseout",t.bind(this,function(){E(this.Da);this.b.blur()}));this.wa?I(this):J(this)};s.ea=function(a){32==a.which||13==a.which?(this.wa?I(this):J(this),a.preventDefault()):27==a.which&&(this.wa&&I(this),a.preventDefault())};function J(a){a.wa=f;a.Da.n("vjs-lock-showing");a.b.setAttribute("aria-pressed",f);a.P&&0<a.P.length&&a.P[0].w().focus()}
function I(a){a.wa=l;E(a.Da);a.b.setAttribute("aria-pressed",l)}t.D=function(a){"number"===typeof a?this.code=a:"string"===typeof a?this.message=a:"object"===typeof a&&t.h.z(this,a);this.message||(this.message=t.D.Bd[this.code]||"")};t.D.prototype.code=0;t.D.prototype.message="";t.D.prototype.status=k;t.D.Wa="MEDIA_ERR_CUSTOM MEDIA_ERR_ABORTED MEDIA_ERR_NETWORK MEDIA_ERR_DECODE MEDIA_ERR_SRC_NOT_SUPPORTED MEDIA_ERR_ENCRYPTED".split(" ");
t.D.Bd={1:"You aborted the video playback",2:"A network error caused the video download to fail part-way.",3:"The video playback was aborted due to a corruption problem or because the video used features your browser did not support.",4:"The video could not be loaded, either because the server or network failed or because the format is not supported.",5:"The video is encrypted and we do not have the keys to decrypt it."};for(var K=0;K<t.D.Wa.length;K++)t.D[t.D.Wa[K]]=K,t.D.prototype[t.D.Wa[K]]=K;
var L,M,N,O;
L=["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "),"webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "),"webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "),"mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "),"msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")];
M=L[0];for(O=0;O<L.length;O++)if(L[O][1]in document){N=L[O];break}if(N){t.Sa.Hb={};for(O=0;O<N.length;O++)t.Sa.Hb[M[O]]=N[O]}
t.Player=t.a.extend({i:function(a,c,d){this.I=a;a.id=a.id||"vjs_video_"+t.p++;this.se=a&&t.Ca(a);c=t.h.z(da(a),c);this.Za=c.language||t.options.language;this.Td=c.languages||t.options.languages;this.F={};this.Nc=c.poster||"";this.zb=!!c.controls;a.controls=l;c.Rc=l;P(this,"audio"===this.I.nodeName.toLowerCase());t.a.call(this,this,c,d);this.controls()?this.n("vjs-controls-enabled"):this.n("vjs-controls-disabled");P(this)&&this.n("vjs-audio");t.Fa[this.K]=this;c.plugins&&t.h.X(c.plugins,function(a,
c){this[a](c)},this);var e,g,h,j,p;e=t.bind(this,this.reportUserActivity);this.c("mousedown",function(){e();this.clearInterval(g);g=this.setInterval(e,250)});this.c("mousemove",function(a){if(a.screenX!=j||a.screenY!=p)j=a.screenX,p=a.screenY,e()});this.c("mouseup",function(){e();this.clearInterval(g)});this.c("keydown",e);this.c("keyup",e);this.setInterval(function(){if(this.ta){this.ta=l;this.userActive(f);this.clearTimeout(h);var a=this.options().inactivityTimeout;0<a&&(h=this.setTimeout(function(){this.ta||
this.userActive(l)},a))}},250)}});s=t.Player.prototype;s.language=function(a){if(a===b)return this.Za;this.Za=a;return this};s.languages=n("Td");s.m=t.options;s.dispose=function(){this.l("dispose");this.k("dispose");t.Fa[this.K]=k;this.I&&this.I.player&&(this.I.player=k);this.b&&this.b.player&&(this.b.player=k);this.o&&this.o.dispose();t.a.prototype.dispose.call(this)};
function da(a){var c,d,e={sources:[],tracks:[]};c=t.Ca(a);d=c["data-setup"];d!==k&&t.h.z(c,t.JSON.parse(d||"{}"));t.h.z(e,c);if(a.hasChildNodes()){var g,h;a=a.childNodes;g=0;for(h=a.length;g<h;g++)c=a[g],d=c.nodeName.toLowerCase(),"source"===d?e.sources.push(t.Ca(c)):"track"===d&&e.tracks.push(t.Ca(c))}return e}
s.e=function(){var a=this.b=t.a.prototype.e.call(this,"div"),c=this.I,d;c.removeAttribute("width");c.removeAttribute("height");if(c.hasChildNodes()){var e,g,h,j,p;e=c.childNodes;g=e.length;for(p=[];g--;)h=e[g],j=h.nodeName.toLowerCase(),"track"===j&&p.push(h);for(e=0;e<p.length;e++)c.removeChild(p[e])}d=t.Ca(c);t.h.X(d,function(c){"class"==c?a.className=d[c]:a.setAttribute(c,d[c])});c.id+="_html5_api";c.className="vjs-tech";c.player=a.player=this;this.n("vjs-paused");this.width(this.m.width,f);this.height(this.m.height,
f);c.Md=c.networkState;c.parentNode&&c.parentNode.insertBefore(a,c);t.Kb(c,a);this.b=a;this.c("loadstart",this.Zd);this.c("waiting",this.ee);this.c(["canplay","canplaythrough","playing","ended"],this.de);this.c("seeking",this.be);this.c("seeked",this.ae);this.c("ended",this.Wd);this.c("play",this.Qb);this.c("firstplay",this.Xd);this.c("pause",this.Pb);this.c("progress",this.$d);this.c("durationchange",this.Kc);this.c("fullscreenchange",this.Yd);return a};
function Q(a,c,d){a.o&&(a.oa=l,a.o.dispose(),a.o=l);"Html5"!==c&&a.I&&(t.g.Cb(a.I),a.I=k);a.Ia=c;a.oa=l;var e=t.h.z({source:d,parentEl:a.b},a.m[c.toLowerCase()]);d&&(a.vc=d.type,d.src==a.F.src&&0<a.F.currentTime&&(e.startTime=a.F.currentTime),a.F.src=d.src);a.o=new window.videojs[c](a,e);a.o.H(function(){this.d.Ka()})}s.Zd=function(){this.error(k);this.paused()?(R(this,l),this.Q("play",function(){R(this,f)})):this.l("firstplay")};s.Dc=l;
function R(a,c){c!==b&&a.Dc!==c&&((a.Dc=c)?(a.n("vjs-has-started"),a.l("firstplay")):a.r("vjs-has-started"))}s.Qb=function(){this.r("vjs-paused");this.n("vjs-playing")};s.ee=function(){this.n("vjs-waiting")};s.de=function(){this.r("vjs-waiting")};s.be=function(){this.n("vjs-seeking")};s.ae=function(){this.r("vjs-seeking")};s.Xd=function(){this.m.starttime&&this.currentTime(this.m.starttime);this.n("vjs-has-started")};s.Pb=function(){this.r("vjs-playing");this.n("vjs-paused")};
s.$d=function(){1==this.bufferedPercent()&&this.l("loadedalldata")};s.Wd=function(){this.m.loop?(this.currentTime(0),this.play()):this.paused()||this.pause()};s.Kc=function(){var a=S(this,"duration");a&&(0>a&&(a=Infinity),this.duration(a),Infinity===a?this.n("vjs-live"):this.r("vjs-live"))};s.Yd=function(){this.isFullscreen()?this.n("vjs-fullscreen"):this.r("vjs-fullscreen")};function T(a,c,d){if(a.o&&!a.o.oa)a.o.H(function(){this[c](d)});else try{a.o[c](d)}catch(e){throw t.log(e),e;}}
function S(a,c){if(a.o&&a.o.oa)try{return a.o[c]()}catch(d){throw a.o[c]===b?t.log("Video.js: "+c+" method not defined for "+a.Ia+" playback technology.",d):"TypeError"==d.name?(t.log("Video.js: "+c+" unavailable on "+a.Ia+" playback technology element.",d),a.o.oa=l):t.log(d),d;}}s.play=function(){T(this,"play");return this};s.pause=function(){T(this,"pause");return this};s.paused=function(){return S(this,"paused")===l?l:f};
s.currentTime=function(a){return a!==b?(T(this,"setCurrentTime",a),this):this.F.currentTime=S(this,"currentTime")||0};s.duration=function(a){if(a!==b)return this.F.duration=parseFloat(a),this;this.F.duration===b&&this.Kc();return this.F.duration||0};s.remainingTime=function(){return this.duration()-this.currentTime()};s.buffered=function(){var a=S(this,"buffered");if(!a||!a.length)a=t.Ab(0,0);return a};
s.bufferedPercent=function(){var a=this.duration(),c=this.buffered(),d=0,e,g;if(!a)return 0;for(var h=0;h<c.length;h++)e=c.start(h),g=c.end(h),g>a&&(g=a),d+=g-e;return d/a};s.volume=function(a){if(a!==b)return a=Math.max(0,Math.min(1,parseFloat(a))),this.F.volume=a,T(this,"setVolume",a),t.je(a),this;a=parseFloat(S(this,"volume"));return isNaN(a)?1:a};s.muted=function(a){return a!==b?(T(this,"setMuted",a),this):S(this,"muted")||l};s.Ha=function(){return S(this,"supportsFullScreen")||l};s.Gc=l;
s.isFullscreen=function(a){return a!==b?(this.Gc=!!a,this):this.Gc};s.isFullScreen=function(a){t.log.warn('player.isFullScreen() has been deprecated, use player.isFullscreen() with a lowercase "s")');return this.isFullscreen(a)};
s.requestFullscreen=function(){var a=t.Sa.Hb;this.isFullscreen(f);a?(t.c(document,a.fullscreenchange,t.bind(this,function(c){this.isFullscreen(document[a.fullscreenElement]);this.isFullscreen()===l&&t.k(document,a.fullscreenchange,arguments.callee);this.l("fullscreenchange")})),this.b[a.requestFullscreen]()):this.o.Ha()?T(this,"enterFullScreen"):(this.zc(),this.l("fullscreenchange"));return this};
s.requestFullScreen=function(){t.log.warn('player.requestFullScreen() has been deprecated, use player.requestFullscreen() with a lowercase "s")');return this.requestFullscreen()};s.exitFullscreen=function(){var a=t.Sa.Hb;this.isFullscreen(l);if(a)document[a.exitFullscreen]();else this.o.Ha()?T(this,"exitFullScreen"):(this.Eb(),this.l("fullscreenchange"));return this};s.cancelFullScreen=function(){t.log.warn("player.cancelFullScreen() has been deprecated, use player.exitFullscreen()");return this.exitFullscreen()};
s.zc=function(){this.Od=f;this.Ed=document.documentElement.style.overflow;t.c(document,"keydown",t.bind(this,this.Bc));document.documentElement.style.overflow="hidden";t.n(document.body,"vjs-full-window");this.l("enterFullWindow")};s.Bc=function(a){27===a.keyCode&&(this.isFullscreen()===f?this.exitFullscreen():this.Eb())};s.Eb=function(){this.Od=l;t.k(document,"keydown",this.Bc);document.documentElement.style.overflow=this.Ed;t.r(document.body,"vjs-full-window");this.l("exitFullWindow")};
s.selectSource=function(a){for(var c=0,d=this.m.techOrder;c<d.length;c++){var e=t.ba(d[c]),g=window.videojs[e];if(g){if(g.isSupported())for(var h=0,j=a;h<j.length;h++){var p=j[h];if(g.canPlaySource(p))return{source:p,o:e}}}else t.log.error('The "'+e+'" tech is undefined. Skipped browser support check for that tech.')}return l};
s.src=function(a){if(a===b)return S(this,"src");t.h.isArray(a)?U(this,a):"string"===typeof a?this.src({src:a}):a instanceof Object&&(a.type&&!window.videojs[this.Ia].canPlaySource(a)?U(this,[a]):(this.F.src=a.src,this.vc=a.type||"",this.H(function(){window.videojs[this.Ia].prototype.hasOwnProperty("setSource")?T(this,"setSource",a):T(this,"src",a.src);"auto"==this.m.preload&&this.load();this.m.autoplay&&this.play()})));return this};
function U(a,c){var d=a.selectSource(c);d?d.o===a.Ia?a.src(d.source):Q(a,d.o,d.source):(a.setTimeout(function(){this.error({code:4,message:this.t(this.options().notSupportedMessage)})},0),a.Ka())}s.load=function(){T(this,"load");return this};s.currentSrc=function(){return S(this,"currentSrc")||this.F.src||""};s.zd=function(){return this.vc||""};s.Ga=function(a){return a!==b?(T(this,"setPreload",a),this.m.preload=a,this):S(this,"preload")};
s.autoplay=function(a){return a!==b?(T(this,"setAutoplay",a),this.m.autoplay=a,this):S(this,"autoplay")};s.loop=function(a){return a!==b?(T(this,"setLoop",a),this.m.loop=a,this):S(this,"loop")};s.poster=function(a){if(a===b)return this.Nc;a||(a="");this.Nc=a;T(this,"setPoster",a);this.l("posterchange");return this};
s.controls=function(a){return a!==b?(a=!!a,this.zb!==a&&((this.zb=a)?(this.r("vjs-controls-disabled"),this.n("vjs-controls-enabled"),this.l("controlsenabled")):(this.r("vjs-controls-enabled"),this.n("vjs-controls-disabled"),this.l("controlsdisabled"))),this):this.zb};t.Player.prototype.Xb;s=t.Player.prototype;
s.usingNativeControls=function(a){return a!==b?(a=!!a,this.Xb!==a&&((this.Xb=a)?(this.n("vjs-using-native-controls"),this.l("usingnativecontrols")):(this.r("vjs-using-native-controls"),this.l("usingcustomcontrols"))),this):this.Xb};s.da=k;s.error=function(a){if(a===b)return this.da;if(a===k)return this.da=a,this.r("vjs-error"),this;this.da=a instanceof t.D?a:new t.D(a);this.l("error");this.n("vjs-error");t.log.error("(CODE:"+this.da.code+" "+t.D.Wa[this.da.code]+")",this.da.message,this.da);return this};
s.ended=function(){return S(this,"ended")};s.seeking=function(){return S(this,"seeking")};s.ta=f;s.reportUserActivity=function(){this.ta=f};s.Wb=f;s.userActive=function(a){return a!==b?(a=!!a,a!==this.Wb&&((this.Wb=a)?(this.ta=f,this.r("vjs-user-inactive"),this.n("vjs-user-active"),this.l("useractive")):(this.ta=l,this.o&&this.o.Q("mousemove",function(a){a.stopPropagation();a.preventDefault()}),this.r("vjs-user-active"),this.n("vjs-user-inactive"),this.l("userinactive"))),this):this.Wb};
s.playbackRate=function(a){return a!==b?(T(this,"setPlaybackRate",a),this):this.o&&this.o.featuresPlaybackRate?S(this,"playbackRate"):1};s.Fc=l;function P(a,c){return c!==b?(a.Fc=!!c,a):a.Fc}t.Na=t.a.extend();t.Na.prototype.m={Ie:"play",children:{playToggle:{},currentTimeDisplay:{},timeDivider:{},durationDisplay:{},remainingTimeDisplay:{},liveDisplay:{},progressControl:{},fullscreenToggle:{},volumeControl:{},muteToggle:{},playbackRateMenuButton:{}}};t.Na.prototype.e=function(){return t.e("div",{className:"vjs-control-bar"})};
t.bc=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});t.bc.prototype.e=function(){var a=t.a.prototype.e.call(this,"div",{className:"vjs-live-controls vjs-control"});this.v=t.e("div",{className:"vjs-live-display",innerHTML:'<span class="vjs-control-text">'+this.t("Stream Type")+"</span>"+this.t("LIVE"),"aria-live":"off"});a.appendChild(this.v);return a};t.ec=t.u.extend({i:function(a,c){t.u.call(this,a,c);this.c(a,"play",this.Qb);this.c(a,"pause",this.Pb)}});s=t.ec.prototype;s.la="Play";
s.S=function(){return"vjs-play-control "+t.u.prototype.S.call(this)};s.s=function(){this.d.paused()?this.d.play():this.d.pause()};s.Qb=function(){this.r("vjs-paused");this.n("vjs-playing");this.b.children[0].children[0].innerHTML=this.t("Pause")};s.Pb=function(){this.r("vjs-playing");this.n("vjs-paused");this.b.children[0].children[0].innerHTML=this.t("Play")};t.kb=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.c(a,"timeupdate",this.ia)}});
t.kb.prototype.e=function(){var a=t.a.prototype.e.call(this,"div",{className:"vjs-current-time vjs-time-controls vjs-control"});this.v=t.e("div",{className:"vjs-current-time-display",innerHTML:'<span class="vjs-control-text">Current Time </span>0:00',"aria-live":"off"});a.appendChild(this.v);return a};t.kb.prototype.ia=function(){var a=this.d.fb?this.d.F.currentTime:this.d.currentTime();this.v.innerHTML='<span class="vjs-control-text">'+this.t("Current Time")+"</span> "+t.Ba(a,this.d.duration())};
t.lb=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.c(a,"timeupdate",this.ia)}});t.lb.prototype.e=function(){var a=t.a.prototype.e.call(this,"div",{className:"vjs-duration vjs-time-controls vjs-control"});this.v=t.e("div",{className:"vjs-duration-display",innerHTML:'<span class="vjs-control-text">'+this.t("Duration Time")+"</span> 0:00","aria-live":"off"});a.appendChild(this.v);return a};
t.lb.prototype.ia=function(){var a=this.d.duration();a&&(this.v.innerHTML='<span class="vjs-control-text">'+this.t("Duration Time")+"</span> "+t.Ba(a))};t.lc=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});t.lc.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-time-divider",innerHTML:"<div><span>/</span></div>"})};t.sb=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.c(a,"timeupdate",this.ia)}});
t.sb.prototype.e=function(){var a=t.a.prototype.e.call(this,"div",{className:"vjs-remaining-time vjs-time-controls vjs-control"});this.v=t.e("div",{className:"vjs-remaining-time-display",innerHTML:'<span class="vjs-control-text">'+this.t("Remaining Time")+"</span> -0:00","aria-live":"off"});a.appendChild(this.v);return a};t.sb.prototype.ia=function(){this.d.duration()&&(this.v.innerHTML='<span class="vjs-control-text">'+this.t("Remaining Time")+"</span> -"+t.Ba(this.d.remainingTime()))};
t.Oa=t.u.extend({i:function(a,c){t.u.call(this,a,c)}});t.Oa.prototype.la="Fullscreen";t.Oa.prototype.S=function(){return"vjs-fullscreen-control "+t.u.prototype.S.call(this)};t.Oa.prototype.s=function(){this.d.isFullscreen()?(this.d.exitFullscreen(),this.yb.innerHTML=this.t("Fullscreen")):(this.d.requestFullscreen(),this.yb.innerHTML=this.t("Non-Fullscreen"))};t.rb=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});t.rb.prototype.m={children:{seekBar:{}}};
t.rb.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-progress-control vjs-control"})};t.hc=t.R.extend({i:function(a,c){t.R.call(this,a,c);this.c(a,"timeupdate",this.sa);a.H(t.bind(this,this.sa))}});s=t.hc.prototype;s.m={children:{loadProgressBar:{},playProgressBar:{},seekHandle:{}},barName:"playProgressBar",handleName:"seekHandle"};s.Mc="timeupdate";s.e=function(){return t.R.prototype.e.call(this,"div",{className:"vjs-progress-holder","aria-label":"video progress bar"})};
s.sa=function(){var a=this.d.fb?this.d.F.currentTime:this.d.currentTime();this.b.setAttribute("aria-valuenow",t.round(100*this.Ib(),2));this.b.setAttribute("aria-valuetext",t.Ba(a,this.d.duration()))};s.Ib=function(){return this.d.currentTime()/this.d.duration()};s.cb=function(a){t.R.prototype.cb.call(this,a);this.d.fb=f;this.xe=!this.d.paused();this.d.pause()};s.fa=function(a){a=H(this,a)*this.d.duration();a==this.d.duration()&&(a-=0.1);this.d.currentTime(a)};
s.qa=function(a){t.R.prototype.qa.call(this,a);this.d.fb=l;this.xe&&this.d.play()};s.Yc=function(){this.d.currentTime(this.d.currentTime()+5)};s.Xc=function(){this.d.currentTime(this.d.currentTime()-5)};t.ob=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.c(a,"progress",this.update)}});t.ob.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-load-progress",innerHTML:'<span class="vjs-control-text"><span>'+this.t("Loaded")+"</span>: 0%</span>"})};
t.ob.prototype.update=function(){var a,c,d,e,g=this.d.buffered();a=this.d.duration();var h,j=this.d;h=j.buffered();j=j.duration();h=h.end(h.length-1);h>j&&(h=j);j=this.b.children;this.b.style.width=100*(h/a||0)+"%";for(a=0;a<g.length;a++)c=g.start(a),d=g.end(a),(e=j[a])||(e=this.b.appendChild(t.e())),e.style.left=100*(c/h||0)+"%",e.style.width=100*((d-c)/h||0)+"%";for(a=j.length;a>g.length;a--)this.b.removeChild(j[a-1])};t.dc=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});
t.dc.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-play-progress",innerHTML:'<span class="vjs-control-text"><span>'+this.t("Progress")+"</span>: 0%</span>"})};t.Pa=t.$.extend({i:function(a,c){t.$.call(this,a,c);this.c(a,"timeupdate",this.ia)}});t.Pa.prototype.defaultValue="00:00";t.Pa.prototype.e=function(){return t.$.prototype.e.call(this,"div",{className:"vjs-seek-handle","aria-live":"off"})};
t.Pa.prototype.ia=function(){var a=this.d.fb?this.d.F.currentTime:this.d.currentTime();this.b.innerHTML='<span class="vjs-control-text">'+t.Ba(a,this.d.duration())+"</span>"};t.ub=t.a.extend({i:function(a,c){t.a.call(this,a,c);a.o&&a.o.featuresVolumeControl===l&&this.n("vjs-hidden");this.c(a,"loadstart",function(){a.o.featuresVolumeControl===l?this.n("vjs-hidden"):this.r("vjs-hidden")})}});t.ub.prototype.m={children:{volumeBar:{}}};
t.ub.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-volume-control vjs-control"})};t.tb=t.R.extend({i:function(a,c){t.R.call(this,a,c);this.c(a,"volumechange",this.sa);a.H(t.bind(this,this.sa))}});s=t.tb.prototype;s.sa=function(){this.b.setAttribute("aria-valuenow",t.round(100*this.d.volume(),2));this.b.setAttribute("aria-valuetext",t.round(100*this.d.volume(),2)+"%")};s.m={children:{volumeLevel:{},volumeHandle:{}},barName:"volumeLevel",handleName:"volumeHandle"};
s.Mc="volumechange";s.e=function(){return t.R.prototype.e.call(this,"div",{className:"vjs-volume-bar","aria-label":"volume level"})};s.fa=function(a){this.d.muted()&&this.d.muted(l);this.d.volume(H(this,a))};s.Ib=function(){return this.d.muted()?0:this.d.volume()};s.Yc=function(){this.d.volume(this.d.volume()+0.1)};s.Xc=function(){this.d.volume(this.d.volume()-0.1)};t.mc=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});
t.mc.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-volume-level",innerHTML:'<span class="vjs-control-text"></span>'})};t.vb=t.$.extend();t.vb.prototype.defaultValue="00:00";t.vb.prototype.e=function(){return t.$.prototype.e.call(this,"div",{className:"vjs-volume-handle"})};
t.ka=t.u.extend({i:function(a,c){t.u.call(this,a,c);this.c(a,"volumechange",this.update);a.o&&a.o.featuresVolumeControl===l&&this.n("vjs-hidden");this.c(a,"loadstart",function(){a.o.featuresVolumeControl===l?this.n("vjs-hidden"):this.r("vjs-hidden")})}});t.ka.prototype.e=function(){return t.u.prototype.e.call(this,"div",{className:"vjs-mute-control vjs-control",innerHTML:'<div><span class="vjs-control-text">'+this.t("Mute")+"</span></div>"})};
t.ka.prototype.s=function(){this.d.muted(this.d.muted()?l:f)};t.ka.prototype.update=function(){var a=this.d.volume(),c=3;0===a||this.d.muted()?c=0:0.33>a?c=1:0.67>a&&(c=2);this.d.muted()?this.b.children[0].children[0].innerHTML!=this.t("Unmute")&&(this.b.children[0].children[0].innerHTML=this.t("Unmute")):this.b.children[0].children[0].innerHTML!=this.t("Mute")&&(this.b.children[0].children[0].innerHTML=this.t("Mute"));for(a=0;4>a;a++)t.r(this.b,"vjs-vol-"+a);t.n(this.b,"vjs-vol-"+c)};
t.va=t.L.extend({i:function(a,c){t.L.call(this,a,c);this.c(a,"volumechange",this.update);a.o&&a.o.featuresVolumeControl===l&&this.n("vjs-hidden");this.c(a,"loadstart",function(){a.o.featuresVolumeControl===l?this.n("vjs-hidden"):this.r("vjs-hidden")});this.n("vjs-menu-button")}});t.va.prototype.za=function(){var a=new t.ja(this.d,{sc:"div"}),c=new t.tb(this.d,this.m.volumeBar);c.c("focus",function(){a.n("vjs-lock-showing")});c.c("blur",function(){E(a)});a.U(c);return a};
t.va.prototype.s=function(){t.ka.prototype.s.call(this);t.L.prototype.s.call(this)};t.va.prototype.e=function(){return t.u.prototype.e.call(this,"div",{className:"vjs-volume-menu-button vjs-menu-button vjs-control",innerHTML:'<div><span class="vjs-control-text">'+this.t("Mute")+"</span></div>"})};t.va.prototype.update=t.ka.prototype.update;t.fc=t.L.extend({i:function(a,c){t.L.call(this,a,c);this.bd();this.ad();this.c(a,"loadstart",this.bd);this.c(a,"ratechange",this.ad)}});s=t.fc.prototype;s.la="Playback Rate";
s.className="vjs-playback-rate";s.e=function(){var a=t.L.prototype.e.call(this);this.Ic=t.e("div",{className:"vjs-playback-rate-value",innerHTML:1});a.appendChild(this.Ic);return a};s.za=function(){var a=new t.ja(this.j()),c=this.j().options().playbackRates;if(c)for(var d=c.length-1;0<=d;d--)a.U(new t.qb(this.j(),{rate:c[d]+"x"}));return a};s.sa=function(){this.w().setAttribute("aria-valuenow",this.j().playbackRate())};
s.s=function(){for(var a=this.j().playbackRate(),c=this.j().options().playbackRates,d=c[0],e=0;e<c.length;e++)if(c[e]>a){d=c[e];break}this.j().playbackRate(d)};function ea(a){return a.j().o&&a.j().o.featuresPlaybackRate&&a.j().options().playbackRates&&0<a.j().options().playbackRates.length}s.bd=function(){ea(this)?this.r("vjs-hidden"):this.n("vjs-hidden")};s.ad=function(){ea(this)&&(this.Ic.innerHTML=this.j().playbackRate()+"x")};
t.qb=t.J.extend({sc:"button",i:function(a,c){var d=this.label=c.rate,e=this.Pc=parseFloat(d,10);c.label=d;c.selected=1===e;t.J.call(this,a,c);this.c(a,"ratechange",this.update)}});t.qb.prototype.s=function(){t.J.prototype.s.call(this);this.j().playbackRate(this.Pc)};t.qb.prototype.update=function(){this.selected(this.j().playbackRate()==this.Pc)};t.gc=t.u.extend({i:function(a,c){t.u.call(this,a,c);this.update();a.c("posterchange",t.bind(this,this.update))}});s=t.gc.prototype;
s.dispose=function(){this.j().k("posterchange",this.update);t.u.prototype.dispose.call(this)};s.e=function(){var a=t.e("div",{className:"vjs-poster",tabIndex:-1});t.fd||(this.Fb=t.e("img"),a.appendChild(this.Fb));return a};s.update=function(){var a=this.j().poster();this.ga(a);a?this.b.style.display="":this.Y()};s.ga=function(a){var c;this.Fb?this.Fb.src=a:(c="",a&&(c='url("'+a+'")'),this.b.style.backgroundImage=c)};s.s=function(){this.d.play()};t.cc=t.a.extend({i:function(a,c){t.a.call(this,a,c)}});
t.cc.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-loading-spinner"})};t.ib=t.u.extend();t.ib.prototype.e=function(){return t.u.prototype.e.call(this,"div",{className:"vjs-big-play-button",innerHTML:'<span aria-hidden="true"></span>',"aria-label":"play video"})};t.ib.prototype.s=function(){this.d.play()};t.mb=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.update();this.c(a,"error",this.update)}});
t.mb.prototype.e=function(){var a=t.a.prototype.e.call(this,"div",{className:"vjs-error-display"});this.v=t.e("div");a.appendChild(this.v);return a};t.mb.prototype.update=function(){this.j().error()&&(this.v.innerHTML=this.t(this.j().error().message))};
t.q=t.a.extend({i:function(a,c,d){c=c||{};c.Rc=l;t.a.call(this,a,c,d);this.featuresProgressEvents||(this.Jc=f,this.Oc=this.setInterval(function(){var a=this.j().bufferedPercent();this.vd!=a&&this.j().l("progress");this.vd=a;1===a&&this.clearInterval(this.Oc)},500));this.featuresTimeupdateEvents||(a=this.d,this.Ob=f,this.c(a,"play",this.$c),this.c(a,"pause",this.hb),this.Q("timeupdate",function(){this.featuresTimeupdateEvents=f;fa(this)}));var e;e=this.j();a=function(){if(e.controls()&&!e.usingNativeControls()){var a;
this.c("mousedown",this.s);this.c("touchstart",function(){a=this.d.userActive()});this.c("touchmove",function(){a&&this.j().reportUserActivity()});this.c("touchend",function(a){a.preventDefault()});G(this);this.c("tap",this.ce)}};this.H(a);this.c(e,"controlsenabled",a);this.c(e,"controlsdisabled",this.he);this.H(function(){this.networkState&&0<this.networkState()&&this.j().l("loadstart")})}});s=t.q.prototype;
s.he=function(){this.k("tap");this.k("touchstart");this.k("touchmove");this.k("touchleave");this.k("touchcancel");this.k("touchend");this.k("click");this.k("mousedown")};s.s=function(a){0===a.button&&this.j().controls()&&(this.j().paused()?this.j().play():this.j().pause())};s.ce=function(){this.j().userActive(!this.j().userActive())};function fa(a){a.Ob=l;a.hb();a.k("play",a.$c);a.k("pause",a.hb)}s.$c=function(){this.uc&&this.hb();this.uc=this.setInterval(function(){this.j().l("timeupdate")},250)};
s.hb=function(){this.clearInterval(this.uc);this.j().l("timeupdate")};s.dispose=function(){this.Jc&&(this.Jc=l,this.clearInterval(this.Oc));this.Ob&&fa(this);t.a.prototype.dispose.call(this)};s.Ub=function(){this.Ob&&this.j().l("timeupdate")};s.Uc=m();t.q.prototype.featuresVolumeControl=f;t.q.prototype.featuresFullscreenResize=l;t.q.prototype.featuresPlaybackRate=l;t.q.prototype.featuresProgressEvents=l;t.q.prototype.featuresTimeupdateEvents=l;
t.q.dd=function(a){a.Sb=function(c){var d,e=a.Vc;e||(e=a.Vc=[]);d===b&&(d=e.length);e.splice(d,0,c)};a.Sc=function(c){for(var d=a.Vc||[],e,g=0;g<d.length;g++)if(e=d[g].Ta(c))return d[g];return k};a.pc=function(c){var d=a.Sc(c);return d?d.Ta(c):""};a.prototype.gb=function(c){var d=a.Sc(c);this.Db();this.k("dispose",this.Db);this.tc=c;this.Vb=d.Jb(c,this);this.c("dispose",this.Db);return this};a.prototype.Db=function(){this.Vb&&this.Vb.dispose&&this.Vb.dispose()}};
t.g=t.q.extend({i:function(a,c,d){t.q.call(this,a,c,d);for(d=t.g.nb.length-1;0<=d;d--)this.c(t.g.nb[d],this.Fd);(c=c.source)&&(this.b.currentSrc!==c.src||a.I&&3===a.I.Md)&&this.gb(c);if(t.jc&&a.options().nativeControlsForTouch===f){var e,g,h,j;e=this;g=this.j();c=g.controls();e.b.controls=!!c;h=function(){e.b.controls=f};j=function(){e.b.controls=l};g.c("controlsenabled",h);g.c("controlsdisabled",j);c=function(){g.k("controlsenabled",h);g.k("controlsdisabled",j)};e.c("dispose",c);g.c("usingcustomcontrols",
c);g.usingNativeControls(f)}a.H(function(){this.I&&(this.m.autoplay&&this.paused())&&(delete this.I.poster,this.play())});this.Ka()}});s=t.g.prototype;s.dispose=function(){t.g.Cb(this.b);t.q.prototype.dispose.call(this)};
s.e=function(){var a=this.d,c=a.I,d;if(!c||this.movingMediaElementInDOM===l)c?(d=c.cloneNode(l),t.g.Cb(c),c=d,a.I=k):(c=t.e("video"),t.Tc(c,t.h.z(a.se||{},{id:a.id()+"_html5_api","class":"vjs-tech"}))),c.player=a,t.Kb(c,a.w());d=["autoplay","preload","loop","muted"];for(var e=d.length-1;0<=e;e--){var g=d[e],h={};"undefined"!==typeof a.m[g]&&(h[g]=a.m[g]);t.Tc(c,h)}return c};s.Fd=function(a){"error"==a.type&&this.error()?this.j().error(this.error().code):(a.bubbles=l,this.j().l(a))};s.play=function(){this.b.play()};
s.pause=function(){this.b.pause()};s.paused=function(){return this.b.paused};s.currentTime=function(){return this.b.currentTime};s.Ub=function(a){try{this.b.currentTime=a}catch(c){t.log(c,"Video is not ready. (Video.js)")}};s.duration=function(){return this.b.duration||0};s.buffered=function(){return this.b.buffered};s.volume=function(){return this.b.volume};s.oe=function(a){this.b.volume=a};s.muted=function(){return this.b.muted};s.le=function(a){this.b.muted=a};s.width=function(){return this.b.offsetWidth};
s.height=function(){return this.b.offsetHeight};s.Ha=function(){return"function"==typeof this.b.webkitEnterFullScreen&&(/Android/.test(t.N)||!/Chrome|Mac OS X 10.5/.test(t.N))?f:l};
s.yc=function(){var a=this.b;"webkitDisplayingFullscreen"in a&&this.Q("webkitbeginfullscreen",function(){this.d.isFullscreen(f);this.Q("webkitendfullscreen",function(){this.d.isFullscreen(l);this.d.l("fullscreenchange")});this.d.l("fullscreenchange")});a.paused&&a.networkState<=a.ze?(this.b.play(),this.setTimeout(function(){a.pause();a.webkitEnterFullScreen()},0)):a.webkitEnterFullScreen()};s.Gd=function(){this.b.webkitExitFullScreen()};s.src=function(a){if(a===b)return this.b.src;this.ga(a)};
s.ga=function(a){this.b.src=a};s.load=function(){this.b.load()};s.currentSrc=function(){return this.b.currentSrc};s.poster=function(){return this.b.poster};s.Uc=function(a){this.b.poster=a};s.Ga=function(){return this.b.Ga};s.ne=function(a){this.b.Ga=a};s.autoplay=function(){return this.b.autoplay};s.ie=function(a){this.b.autoplay=a};s.controls=function(){return this.b.controls};s.loop=function(){return this.b.loop};s.ke=function(a){this.b.loop=a};s.error=function(){return this.b.error};
s.seeking=function(){return this.b.seeking};s.ended=function(){return this.b.ended};s.playbackRate=function(){return this.b.playbackRate};s.me=function(a){this.b.playbackRate=a};s.networkState=function(){return this.b.networkState};t.g.isSupported=function(){try{t.A.volume=0.5}catch(a){return l}return!!t.A.canPlayType};t.q.dd(t.g);t.g.V={};
t.g.V.Ta=function(a){function c(a){try{return!!t.A.canPlayType(a)}catch(c){return""}}if(a.type)return c(a.type);a=a.src.match(/\.([^\/\?]+)(\?[^\/]+)?$/i)[1];return c("video/"+a)};t.g.V.Jb=function(a,c){c.ga(a.src)};t.g.V.dispose=m();t.g.Sb(t.g.V);t.g.xd=function(){var a=t.A.volume;t.A.volume=a/2+0.1;return a!==t.A.volume};t.g.wd=function(){var a=t.A.playbackRate;t.A.playbackRate=a/2+0.1;return a!==t.A.playbackRate};t.g.prototype.featuresVolumeControl=t.g.xd();t.g.prototype.featuresPlaybackRate=t.g.wd();
t.g.prototype.movingMediaElementInDOM=!t.kd;t.g.prototype.featuresFullscreenResize=f;t.g.prototype.featuresProgressEvents=f;var V,ga=/^application\/(?:x-|vnd\.apple\.)mpegurl/i,ha=/^video\/mp4/i;
t.g.Lc=function(){4<=t.Yb&&(V||(V=t.A.constructor.prototype.canPlayType),t.A.constructor.prototype.canPlayType=function(a){return a&&ga.test(a)?"maybe":V.call(this,a)});t.od&&(V||(V=t.A.constructor.prototype.canPlayType),t.A.constructor.prototype.canPlayType=function(a){return a&&ha.test(a)?"maybe":V.call(this,a)})};t.g.we=function(){var a=t.A.constructor.prototype.canPlayType;t.A.constructor.prototype.canPlayType=V;V=k;return a};t.g.Lc();t.g.nb="loadstart suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate progress play pause ratechange volumechange".split(" ");
t.g.Cb=function(a){if(a){a.player=k;for(a.parentNode&&a.parentNode.removeChild(a);a.hasChildNodes();)a.removeChild(a.firstChild);a.removeAttribute("src");if("function"===typeof a.load)try{a.load()}catch(c){}}};
t.f=t.q.extend({i:function(a,c,d){t.q.call(this,a,c,d);var e=c.source;d=c.parentEl;var g=this.b=t.e("div",{id:a.id()+"_temp_flash"}),h=a.id()+"_flash_api",j=a.m,j=t.h.z({readyFunction:"videojs.Flash.onReady",eventProxyFunction:"videojs.Flash.onEvent",errorEventProxyFunction:"videojs.Flash.onError",autoplay:j.autoplay,preload:j.Ga,loop:j.loop,muted:j.muted},c.flashVars),p=t.h.z({wmode:"opaque",bgcolor:"#000000"},c.params),h=t.h.z({id:h,name:h,"class":"vjs-tech"},c.attributes);e&&this.H(function(){this.gb(e)});
t.Kb(g,d);c.startTime&&this.H(function(){this.load();this.play();this.currentTime(c.startTime)});t.jd&&this.H(function(){this.c("mousemove",function(){this.j().l({type:"mousemove",bubbles:l})})});a.c("stageclick",a.reportUserActivity);this.b=t.f.xc(c.swf,g,j,p,h)}});s=t.f.prototype;s.dispose=function(){t.q.prototype.dispose.call(this)};s.play=function(){this.b.vjs_play()};s.pause=function(){this.b.vjs_pause()};s.src=function(a){return a===b?this.currentSrc():this.ga(a)};
s.ga=function(a){a=t.Jd(a);this.b.vjs_src(a);if(this.d.autoplay()){var c=this;this.setTimeout(function(){c.play()},0)}};t.f.prototype.setCurrentTime=function(a){this.Ud=a;this.b.vjs_setProperty("currentTime",a);t.q.prototype.Ub.call(this)};t.f.prototype.currentTime=function(){return this.seeking()?this.Ud||0:this.b.vjs_getProperty("currentTime")};t.f.prototype.currentSrc=function(){return this.tc?this.tc.src:this.b.vjs_getProperty("currentSrc")};t.f.prototype.load=function(){this.b.vjs_load()};
t.f.prototype.poster=function(){this.b.vjs_getProperty("poster")};t.f.prototype.setPoster=m();t.f.prototype.buffered=function(){return t.Ab(0,this.b.vjs_getProperty("buffered"))};t.f.prototype.Ha=r(l);t.f.prototype.yc=r(l);function ia(){var a=W[X],c=a.charAt(0).toUpperCase()+a.slice(1);ka["set"+c]=function(c){return this.b.vjs_setProperty(a,c)}}function la(a){ka[a]=function(){return this.b.vjs_getProperty(a)}}
var ka=t.f.prototype,W="rtmpConnection rtmpStream preload defaultPlaybackRate playbackRate autoplay loop mediaGroup controller controls volume muted defaultMuted".split(" "),ma="error networkState readyState seeking initialTime duration startOffsetTime paused played seekable ended videoTracks audioTracks videoWidth videoHeight textTracks".split(" "),X;for(X=0;X<W.length;X++)la(W[X]),ia();for(X=0;X<ma.length;X++)la(ma[X]);t.f.isSupported=function(){return 10<=t.f.version()[0]};t.q.dd(t.f);t.f.V={};
t.f.V.Ta=function(a){return!a.type?"":a.type.replace(/;.*/,"").toLowerCase()in t.f.Id?"maybe":""};t.f.V.Jb=function(a,c){c.ga(a.src)};t.f.V.dispose=m();t.f.Sb(t.f.V);t.f.Id={"video/flv":"FLV","video/x-flv":"FLV","video/mp4":"MP4","video/m4v":"MP4"};t.f.onReady=function(a){var c;if(c=(a=t.w(a))&&a.parentNode&&a.parentNode.player)a.player=c,t.f.checkReady(c.o)};t.f.checkReady=function(a){a.w()&&(a.w().vjs_getProperty?a.Ka():this.setTimeout(function(){t.f.checkReady(a)},50))};
t.f.onEvent=function(a,c){t.w(a).player.l(c)};t.f.onError=function(a,c){var d=t.w(a).player,e="FLASH: "+c;"srcnotfound"==c?d.error({code:4,message:e}):d.error(e)};
t.f.version=function(){var a="0,0,0";try{a=(new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}catch(c){try{navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin&&(a=(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,",").match(/^,?(.+),?$/)[1])}catch(d){}}return a.split(",")};
t.f.xc=function(a,c,d,e,g){a=t.f.Ld(a,d,e,g);a=t.e("div",{innerHTML:a}).childNodes[0];d=c.parentNode;c.parentNode.replaceChild(a,c);var h=d.childNodes[0];setTimeout(function(){h.style.display="block"},1E3);return a};
t.f.Ld=function(a,c,d,e){var g="",h="",j="";c&&t.h.X(c,function(a,c){g+=a+"="+c+"&amp;"});d=t.h.z({movie:a,flashvars:g,allowScriptAccess:"always",allowNetworking:"all"},d);t.h.X(d,function(a,c){h+='<param name="'+a+'" value="'+c+'" />'});e=t.h.z({data:a,width:"100%",height:"100%"},e);t.h.X(e,function(a,c){j+=a+'="'+c+'" '});return'<object type="application/x-shockwave-flash" '+j+">"+h+"</object>"};t.f.qe={"rtmp/mp4":"MP4","rtmp/flv":"FLV"};t.f.Je=function(a,c){return a+"&"+c};
t.f.pe=function(a){var c={rc:"",Zc:""};if(!a)return c;var d=a.indexOf("&"),e;-1!==d?e=d+1:(d=e=a.lastIndexOf("/")+1,0===d&&(d=e=a.length));c.rc=a.substring(0,d);c.Zc=a.substring(e,a.length);return c};t.f.Rd=function(a){return a in t.f.qe};t.f.qd=/^rtmp[set]?:\/\//i;t.f.Qd=function(a){return t.f.qd.test(a)};t.f.Tb={};t.f.Tb.Ta=function(a){return t.f.Rd(a.type)||t.f.Qd(a.src)?"maybe":""};t.f.Tb.Jb=function(a,c){var d=t.f.pe(a.src);c.setRtmpConnection(d.rc);c.setRtmpStream(d.Zc)};t.f.Sb(t.f.Tb);
t.pd=t.a.extend({i:function(a,c,d){t.a.call(this,a,c,d);if(!a.m.sources||0===a.m.sources.length){c=0;for(d=a.m.techOrder;c<d.length;c++){var e=t.ba(d[c]),g=window.videojs[e];if(g&&g.isSupported()){Q(a,e);break}}}else a.src(a.m.sources)}});t.Player.prototype.textTracks=function(){return this.Ja=this.Ja||[]};
function na(a,c,d,e,g){var h=a.Ja=a.Ja||[];g=g||{};g.kind=c;g.label=d;g.language=e;c=t.ba(c||"subtitles");var j=new window.videojs[c+"Track"](a,g);h.push(j);j.Bb()&&a.H(function(){this.setTimeout(function(){Y(j.j(),j.id())},0)})}function Y(a,c,d){for(var e=a.Ja,g=0,h=e.length,j,p;g<h;g++)j=e[g],j.id()===c?(j.show(),p=j):d&&(j.M()==d&&0<j.mode())&&j.disable();(c=p?p.M():d?d:l)&&a.l(c+"trackchange")}
t.B=t.a.extend({i:function(a,c){t.a.call(this,a,c);this.K=c.id||"vjs_"+c.kind+"_"+c.language+"_"+t.p++;this.Wc=c.src;this.Cd=c["default"]||c.dflt;this.ue=c.title;this.Za=c.srclang;this.Sd=c.label;this.ca=[];this.wb=[];this.pa=this.ra=0;a.c("dispose",t.bind(this,this.wc,this.K))}});s=t.B.prototype;s.M=n("G");s.src=n("Wc");s.Bb=n("Cd");s.title=n("ue");s.language=n("Za");s.label=n("Sd");s.yd=n("ca");s.rd=n("wb");s.readyState=n("ra");s.mode=n("pa");
s.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-"+this.G+" vjs-text-track"})};s.show=function(){oa(this);this.pa=2;t.a.prototype.show.call(this)};s.Y=function(){oa(this);this.pa=1;t.a.prototype.Y.call(this)};s.disable=function(){2==this.pa&&this.Y();this.wc();this.pa=0};function oa(a){0===a.ra&&a.load();0===a.pa&&(a.d.c("timeupdate",t.bind(a,a.update,a.K)),a.d.c("ended",t.bind(a,a.reset,a.K)),("captions"===a.G||"subtitles"===a.G)&&a.d.na("textTrackDisplay").U(a))}
s.wc=function(){this.d.k("timeupdate",t.bind(this,this.update,this.K));this.d.k("ended",t.bind(this,this.reset,this.K));this.reset();this.d.na("textTrackDisplay").removeChild(this)};
s.load=function(){0===this.ra&&(this.ra=1,t.ye(this.Wc,t.bind(this,function(a,c,d){if(a)this.error=a,this.ra=3,this.l("error");else{var e,g;a=d.split("\n");c="";d=1;for(var h=a.length;d<h;d++)if(c=t.trim(a[d])){-1==c.indexOf("--\x3e")?(e=c,c=t.trim(a[++d])):e=this.ca.length;e={id:e,index:this.ca.length};g=c.split(/[\t ]+/);e.startTime=pa(g[0]);e.Aa=pa(g[2]);for(g=[];a[++d]&&(c=t.trim(a[d]));)g.push(c);e.text=g.join("<br/>");this.ca.push(e)}this.ra=2;this.l("loaded")}})))};
function pa(a){var c=a.split(":");a=0;var d,e,g;3==c.length?(d=c[0],e=c[1],c=c[2]):(d=0,e=c[0],c=c[1]);c=c.split(/\s+/);c=c.splice(0,1)[0];c=c.split(/\.|,/);g=parseFloat(c[1]);c=c[0];a+=3600*parseFloat(d);a+=60*parseFloat(e);a+=parseFloat(c);g&&(a+=g/1E3);return a}
s.update=function(){if(0<this.ca.length){var a=this.d.options().trackTimeOffset||0,a=this.d.currentTime()+a;if(this.Rb===b||a<this.Rb||this.$a<=a){var c=this.ca,d=this.d.duration(),e=0,g=l,h=[],j,p,q,w;a>=this.$a||this.$a===b?w=this.Gb!==b?this.Gb:0:(g=f,w=this.Nb!==b?this.Nb:c.length-1);for(;;){q=c[w];if(q.Aa<=a)e=Math.max(e,q.Aa),q.Ra&&(q.Ra=l);else if(a<q.startTime){if(d=Math.min(d,q.startTime),q.Ra&&(q.Ra=l),!g)break}else g?(h.splice(0,0,q),p===b&&(p=w),j=w):(h.push(q),j===b&&(j=w),p=w),d=Math.min(d,
q.Aa),e=Math.max(e,q.startTime),q.Ra=f;if(g)if(0===w)break;else w--;else if(w===c.length-1)break;else w++}this.wb=h;this.$a=d;this.Rb=e;this.Gb=j;this.Nb=p;j=this.wb;p="";a=0;for(c=j.length;a<c;a++)p+='<span class="vjs-tt-cue">'+j[a].text+"</span>";this.b.innerHTML=p;this.l("cuechange")}}};s.reset=function(){this.$a=0;this.Rb=this.d.duration();this.Nb=this.Gb=0};t.$b=t.B.extend();t.$b.prototype.G="captions";t.ic=t.B.extend();t.ic.prototype.G="subtitles";t.ac=t.B.extend();t.ac.prototype.G="chapters";
t.kc=t.a.extend({i:function(a,c,d){t.a.call(this,a,c,d);if(a.m.tracks&&0<a.m.tracks.length){c=this.d;a=a.m.tracks;for(var e=0;e<a.length;e++)d=a[e],na(c,d.kind,d.label,d.language,d)}}});t.kc.prototype.e=function(){return t.a.prototype.e.call(this,"div",{className:"vjs-text-track-display"})};t.aa=t.J.extend({i:function(a,c){var d=this.ha=c.track;c.label=d.label();c.selected=d.Bb();t.J.call(this,a,c);this.c(a,d.M()+"trackchange",this.update)}});
t.aa.prototype.s=function(){t.J.prototype.s.call(this);Y(this.d,this.ha.K,this.ha.M())};t.aa.prototype.update=function(){this.selected(2==this.ha.mode())};t.pb=t.aa.extend({i:function(a,c){c.track={M:function(){return c.kind},j:a,label:function(){return c.kind+" off"},Bb:r(l),mode:r(l)};t.aa.call(this,a,c);this.selected(f)}});t.pb.prototype.s=function(){t.aa.prototype.s.call(this);Y(this.d,this.ha.K,this.ha.M())};
t.pb.prototype.update=function(){for(var a=this.d.textTracks(),c=0,d=a.length,e,g=f;c<d;c++)e=a[c],e.M()==this.ha.M()&&2==e.mode()&&(g=l);this.selected(g)};t.T=t.L.extend({i:function(a,c){t.L.call(this,a,c);1>=this.P.length&&this.Y()}});t.T.prototype.ya=function(){var a=[],c;a.push(new t.pb(this.d,{kind:this.G}));for(var d=0;d<this.d.textTracks().length;d++)c=this.d.textTracks()[d],c.M()===this.G&&a.push(new t.aa(this.d,{track:c}));return a};
t.La=t.T.extend({i:function(a,c,d){t.T.call(this,a,c,d);this.b.setAttribute("aria-label","Captions Menu")}});t.La.prototype.G="captions";t.La.prototype.la="Captions";t.La.prototype.className="vjs-captions-button";t.Qa=t.T.extend({i:function(a,c,d){t.T.call(this,a,c,d);this.b.setAttribute("aria-label","Subtitles Menu")}});t.Qa.prototype.G="subtitles";t.Qa.prototype.la="Subtitles";t.Qa.prototype.className="vjs-subtitles-button";
t.Ma=t.T.extend({i:function(a,c,d){t.T.call(this,a,c,d);this.b.setAttribute("aria-label","Chapters Menu")}});s=t.Ma.prototype;s.G="chapters";s.la="Chapters";s.className="vjs-chapters-button";s.ya=function(){for(var a=[],c,d=0;d<this.d.textTracks().length;d++)c=this.d.textTracks()[d],c.M()===this.G&&a.push(new t.aa(this.d,{track:c}));return a};
s.za=function(){for(var a=this.d.textTracks(),c=0,d=a.length,e,g,h=this.P=[];c<d;c++)if(e=a[c],e.M()==this.G)if(0===e.readyState())e.load(),e.c("loaded",t.bind(this,this.za));else{g=e;break}a=this.Da;a===b&&(a=new t.ja(this.d),a.ma().appendChild(t.e("li",{className:"vjs-menu-title",innerHTML:t.ba(this.G),re:-1})));if(g){e=g.ca;for(var j,c=0,d=e.length;c<d;c++)j=e[c],j=new t.jb(this.d,{track:g,cue:j}),h.push(j),a.U(j);this.U(a)}0<this.P.length&&this.show();return a};
t.jb=t.J.extend({i:function(a,c){var d=this.ha=c.track,e=this.cue=c.cue,g=a.currentTime();c.label=e.text;c.selected=e.startTime<=g&&g<e.Aa;t.J.call(this,a,c);d.c("cuechange",t.bind(this,this.update))}});t.jb.prototype.s=function(){t.J.prototype.s.call(this);this.d.currentTime(this.cue.startTime);this.update(this.cue.startTime)};t.jb.prototype.update=function(){var a=this.cue,c=this.d.currentTime();this.selected(a.startTime<=c&&c<a.Aa)};
t.h.z(t.Na.prototype.m.children,{subtitlesButton:{},captionsButton:{},chaptersButton:{}});
if("undefined"!==typeof window.JSON&&"function"===typeof window.JSON.parse)t.JSON=window.JSON;else{t.JSON={};var Z=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;t.JSON.parse=function(a,c){function d(a,e){var j,p,q=a[e];if(q&&"object"===typeof q)for(j in q)Object.prototype.hasOwnProperty.call(q,j)&&(p=d(q,j),p!==b?q[j]=p:delete q[j]);return c.call(a,e,q)}var e;a=String(a);Z.lastIndex=0;Z.test(a)&&(a=a.replace(Z,function(a){return"\\u"+("0000"+
a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return e=eval("("+a+")"),"function"===typeof c?d({"":e},""):e;throw new SyntaxError("JSON.parse(): invalid or malformed JSON data");}}
t.oc=function(){var a,c,d,e;a=document.getElementsByTagName("video");c=document.getElementsByTagName("audio");var g=[];if(a&&0<a.length){d=0;for(e=a.length;d<e;d++)g.push(a[d])}if(c&&0<c.length){d=0;for(e=c.length;d<e;d++)g.push(c[d])}if(g&&0<g.length){d=0;for(e=g.length;d<e;d++)if((c=g[d])&&c.getAttribute)c.player===b&&(a=c.getAttribute("data-setup"),a!==k&&videojs(c));else{t.xb();break}}else t.cd||t.xb()};t.xb=function(){setTimeout(t.oc,1)};
"complete"===document.readyState?t.cd=f:t.Q(window,"load",function(){t.cd=f});t.xb();t.ge=function(a,c){t.Player.prototype[a]=c};var qa=this;function $(a,c){var d=a.split("."),e=qa;!(d[0]in e)&&e.execScript&&e.execScript("var "+d[0]);for(var g;d.length&&(g=d.shift());)!d.length&&c!==b?e[g]=c:e=e[g]?e[g]:e[g]={}};$("videojs",t);$("_V_",t);$("videojs.options",t.options);$("videojs.players",t.Fa);$("videojs.TOUCH_ENABLED",t.jc);$("videojs.cache",t.xa);$("videojs.Component",t.a);t.a.prototype.player=t.a.prototype.j;t.a.prototype.options=t.a.prototype.options;t.a.prototype.init=t.a.prototype.i;t.a.prototype.dispose=t.a.prototype.dispose;t.a.prototype.createEl=t.a.prototype.e;t.a.prototype.contentEl=t.a.prototype.ma;t.a.prototype.el=t.a.prototype.w;t.a.prototype.addChild=t.a.prototype.U;
t.a.prototype.getChild=t.a.prototype.na;t.a.prototype.getChildById=t.a.prototype.Kd;t.a.prototype.children=t.a.prototype.children;t.a.prototype.initChildren=t.a.prototype.Ec;t.a.prototype.removeChild=t.a.prototype.removeChild;t.a.prototype.on=t.a.prototype.c;t.a.prototype.off=t.a.prototype.k;t.a.prototype.one=t.a.prototype.Q;t.a.prototype.trigger=t.a.prototype.l;t.a.prototype.triggerReady=t.a.prototype.Ka;t.a.prototype.show=t.a.prototype.show;t.a.prototype.hide=t.a.prototype.Y;
t.a.prototype.width=t.a.prototype.width;t.a.prototype.height=t.a.prototype.height;t.a.prototype.dimensions=t.a.prototype.Dd;t.a.prototype.ready=t.a.prototype.H;t.a.prototype.addClass=t.a.prototype.n;t.a.prototype.removeClass=t.a.prototype.r;t.a.prototype.buildCSSClass=t.a.prototype.S;t.a.prototype.localize=t.a.prototype.t;t.a.prototype.setInterval=t.a.prototype.setInterval;t.a.prototype.setTimeout=t.a.prototype.setTimeout;t.Player.prototype.ended=t.Player.prototype.ended;
t.Player.prototype.enterFullWindow=t.Player.prototype.zc;t.Player.prototype.exitFullWindow=t.Player.prototype.Eb;t.Player.prototype.preload=t.Player.prototype.Ga;t.Player.prototype.remainingTime=t.Player.prototype.remainingTime;t.Player.prototype.supportsFullScreen=t.Player.prototype.Ha;t.Player.prototype.currentType=t.Player.prototype.zd;t.Player.prototype.requestFullScreen=t.Player.prototype.requestFullScreen;t.Player.prototype.requestFullscreen=t.Player.prototype.requestFullscreen;
t.Player.prototype.cancelFullScreen=t.Player.prototype.cancelFullScreen;t.Player.prototype.exitFullscreen=t.Player.prototype.exitFullscreen;t.Player.prototype.isFullScreen=t.Player.prototype.isFullScreen;t.Player.prototype.isFullscreen=t.Player.prototype.isFullscreen;$("videojs.MediaLoader",t.pd);$("videojs.TextTrackDisplay",t.kc);$("videojs.ControlBar",t.Na);$("videojs.Button",t.u);$("videojs.PlayToggle",t.ec);$("videojs.FullscreenToggle",t.Oa);$("videojs.BigPlayButton",t.ib);
$("videojs.LoadingSpinner",t.cc);$("videojs.CurrentTimeDisplay",t.kb);$("videojs.DurationDisplay",t.lb);$("videojs.TimeDivider",t.lc);$("videojs.RemainingTimeDisplay",t.sb);$("videojs.LiveDisplay",t.bc);$("videojs.ErrorDisplay",t.mb);$("videojs.Slider",t.R);$("videojs.ProgressControl",t.rb);$("videojs.SeekBar",t.hc);$("videojs.LoadProgressBar",t.ob);$("videojs.PlayProgressBar",t.dc);$("videojs.SeekHandle",t.Pa);$("videojs.VolumeControl",t.ub);$("videojs.VolumeBar",t.tb);$("videojs.VolumeLevel",t.mc);
$("videojs.VolumeMenuButton",t.va);$("videojs.VolumeHandle",t.vb);$("videojs.MuteToggle",t.ka);$("videojs.PosterImage",t.gc);$("videojs.Menu",t.ja);$("videojs.MenuItem",t.J);$("videojs.MenuButton",t.L);$("videojs.PlaybackRateMenuButton",t.fc);t.L.prototype.createItems=t.L.prototype.ya;t.T.prototype.createItems=t.T.prototype.ya;t.Ma.prototype.createItems=t.Ma.prototype.ya;$("videojs.SubtitlesButton",t.Qa);$("videojs.CaptionsButton",t.La);$("videojs.ChaptersButton",t.Ma);
$("videojs.MediaTechController",t.q);t.q.prototype.featuresVolumeControl=t.q.prototype.Ge;t.q.prototype.featuresFullscreenResize=t.q.prototype.Ce;t.q.prototype.featuresPlaybackRate=t.q.prototype.De;t.q.prototype.featuresProgressEvents=t.q.prototype.Ee;t.q.prototype.featuresTimeupdateEvents=t.q.prototype.Fe;t.q.prototype.setPoster=t.q.prototype.Uc;$("videojs.Html5",t.g);t.g.Events=t.g.nb;t.g.isSupported=t.g.isSupported;t.g.canPlaySource=t.g.pc;t.g.patchCanPlayType=t.g.Lc;t.g.unpatchCanPlayType=t.g.we;
t.g.prototype.setCurrentTime=t.g.prototype.Ub;t.g.prototype.setVolume=t.g.prototype.oe;t.g.prototype.setMuted=t.g.prototype.le;t.g.prototype.setPreload=t.g.prototype.ne;t.g.prototype.setAutoplay=t.g.prototype.ie;t.g.prototype.setLoop=t.g.prototype.ke;t.g.prototype.enterFullScreen=t.g.prototype.yc;t.g.prototype.exitFullScreen=t.g.prototype.Gd;t.g.prototype.playbackRate=t.g.prototype.playbackRate;t.g.prototype.setPlaybackRate=t.g.prototype.me;t.g.prototype.setSource=t.g.prototype.gb;
$("videojs.Flash",t.f);t.f.isSupported=t.f.isSupported;t.f.canPlaySource=t.f.pc;t.f.onReady=t.f.onReady;t.f.embed=t.f.xc;t.f.version=t.f.version;t.f.prototype.setSource=t.f.prototype.gb;$("videojs.TextTrack",t.B);t.B.prototype.label=t.B.prototype.label;t.B.prototype.kind=t.B.prototype.M;t.B.prototype.mode=t.B.prototype.mode;t.B.prototype.cues=t.B.prototype.yd;t.B.prototype.activeCues=t.B.prototype.rd;$("videojs.CaptionsTrack",t.$b);$("videojs.SubtitlesTrack",t.ic);$("videojs.ChaptersTrack",t.ac);
$("videojs.autoSetup",t.oc);$("videojs.plugin",t.ge);$("videojs.createTimeRange",t.Ab);$("videojs.util",t.Z);t.Z.mergeOptions=t.Z.Ea;t.addLanguage=t.sd;})();

/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/*
 *  jQuery OwlCarousel v1.3.3
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199, 1],
        itemsDesktopSmall : [979, 1],
        itemsTablet : [768, 1],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : true,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : true,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : true,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));