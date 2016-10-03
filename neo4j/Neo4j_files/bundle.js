(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Main site app file
 *
 */

// Requirements
var $ = jQuery; // Enqueued externally with WP, just make sure it uses '$' variable.
var neoNav = require('./components/nav.js');
var neoTabs = require('./components/tabs.js');
// Modules to be used in global space
require('./exports.js');

// Document ready
$(function () {

    // Main Navigation module
    neoNav.init();
    // Custom tabs functions
    neoTabs.init();

});

},{"./components/nav.js":3,"./components/tabs.js":4,"./exports.js":5}],2:[function(require,module,exports){
/**
 * Calculate distances from geoip coords
 *
 */

// Make sure '$' is set
var $ = jQuery;

/**
 * Get local coordinates from geoip response headers
 *
 * Returns object with coords, false if none found
 *
 * @param xhr
 *
 * @returns {*}
 */
var getLocalCoords = function (xhr) {
    var localCoords = {
        lat: null,
        lon: null
    };
    if (xhr.getResponseHeader("X-geo-long")) {
        localCoords.lon = xhr.getResponseHeader("X-geo-long");
    }
    if (xhr.getResponseHeader("X-geo-lat")) {
        localCoords.lat = xhr.getResponseHeader("X-geo-lat");
    }

    if ( localCoords.lat && localCoords.lon ) {
        return localCoords;
    }

    return false;
};

/**
 * Get distance from user browser to event location in Km
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 *
 * @returns {number}
 */
var getDistanceFromLatLonInKm = function (lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return Math.round(d);
};

/**
 * Convert degrees to radius
 *
 * @param deg
 *
 * @returns {number}
 */
var deg2rad = function (deg) {
    return deg * (Math.PI/180)
};

// Functions to reveal
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
exports.getLocalCoords = getLocalCoords;
},{}],3:[function(require,module,exports){
/**
 * Header/Navigation scripts
 *
 */

// Make sure '$' is set
var $ = jQuery;

/**
 * Initialize navigation related code
 *
 */
var init = function () {

    // Set full width for megamenu bg
    megamenuFullWidthContainer('.dropdown-wrapper', '#nav-position');
    // Reset width on window resize
    $(window).on('resize', Foundation.utils.throttle(function () {
        megamenuFullWidthContainer('.dropdown-wrapper', '#nav-position');
    }, 300));
};


/**
 * Breakout nav megamenu to fullwidth of screen
 *
 */
var megamenuFullWidthContainer = function (el, relativeEl, collapse) {

    var windowW = document.documentElement.clientWidth,
        collapse = typeof collapse !== 'undefined' ? collapse : false,
        $el = $(el),
        $relativeEl = $(relativeEl),
        $pos = $relativeEl.position(),
        $gutter = parseFloat($relativeEl.css('padding-left')),
        $offset = $pos.left,
        $prev = $('.testimonial_rotator_prev'),
        $next = $('.testimonial_rotator_next')
        ;

    //disable if not on mobile
    if ($(window).width() > 910) {
        //set wrapper box sizing
        $el.css({
            "width": windowW,
            "left": -$offset,
            "padding-left": $offset,
            "padding-right": $offset
        });

        if (true === collapse) {
            $el.css({
                "margin-left": -$pos,
                "padding-left": 0,
                "padding-right": 0
            });
        }
    } else {
        $el.attr('style', '');
    }
};


// Functions to reveal
exports.init = init;
},{}],4:[function(require,module,exports){
/**
 * Custom Tab scripts
 *
 * Sets up handlers for 2 ways to interact with Foundation tabs script:
 * - Set callback function (called first)
 * - Bind to 'toggled' event (called second, gives access to event as well as tab element)
 *
 * Both options are called after tabs script finishes it's actions of setting active tabs
 *
 * Custom functions:
 * - Enable option for toggling close active tabs if '.toggle' class is added to the tab parent.
 */

// Make sure '$' is set
var $ = jQuery;
var toggleClass = '.tabs-toggle';

/**
 * Initialize
 *
 */
var init = function () {

    // Bind to Foundation tabs callback handler
    //tabsCallbackHandler();

    // Bind to Foundation  tabs 'toggled' event
    tabsToggledHandler();

    // Toggle between tab rows
    toggleBetweenTabRows();
};


/**
 * Bind to Foundation tabs 'toggled' event
 *
 */
var tabsToggledHandler = function () {
    var toggledTags = $('.tabs'+toggleClass);

    // Enable toggling on active tabs
    toggledTags.on('toggled', function (event, tab) {

        toggleActiveTab(tab);
    });
};

/**
 * Bind to Foundation tabs callback function
 *
 */
var tabsCallbackHandler = function () {

    // Add callback function to tabs settings
    $(document).foundation({
        tab: {
            callback : function (tab) {
                // Example
                console.log(tab);
            }
        }
    });
};


/**
 * Toggle active tab content if clicked
 *
 * @param tab anchor element of clicked
 */
var toggleActiveTab = function(tab) {
    var contentParent = tab.parent().next();

    // If tab already opened, close content on click
    if ( tab.hasClass('opened') ) {

        tab.removeClass('opened'); // Reset flag
        tab.removeClass('active'); // Remove active class from tab anchor

        // Remove active class from any content elements.
        contentParent.children().removeClass('active');

    // Set flag that current tab is opened
    } else {
        tab.addClass('opened'); // Set flag on current tab
        tab.siblings().removeClass('opened'); // Remove flags on all other tabs
    }

};

/**
 * Toggle between two rows of tabs
 *
 * @todo refactor into toggleActiveTab function, toggle 'opened' classes correctly
 */
var toggleBetweenTabRows = function() {

    // Toggle tabs-content between the 2 why-neo4j rows
    $(".made-of-row-1 a").click(function() {
        $(".made-of-row-2 .active").removeClass("active")
    });
    $(".made-of-row-2 a").click(function() {
        $(".made-of-row-1 .active").removeClass("active")
    });

};


// Functions to reveal
exports.init = init;
},{}],5:[function(require,module,exports){
(function (global){
/**
 * Add Modules to be used in the global space
 *
 * Appended to parent 'neo' global namespace
 *
 */

// Grab an existing namespace object, or create a blank object
// if it doesn't exist
var neo = global.neo || {};

// Stick on the modules that need to be exported.
// You only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly
neo.geoIP = require('./components/geoip.js');

// Replace/Create the global namespace
global.neo = neo;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/geoip.js":2}]},{},[1]);
