// Project Bindings
(function(opui, $, riot, undefined){

	opui.bindings = {

		init: function(){
			opui.console.log('Module initialized: Bindings');
			// ------------------------------------------------------------
//  Replace touch events for standard UI buttons
// ------------------------------------------------------------
			$('body').hammer().on('touch', '.button', function(e){
				e.preventDefault();
				$(this).addClass('touch');
			});

			$('body').hammer().on('release', '.button', function(e){
				e.preventDefault();
				$(this).removeClass('touch');
			});

// ------------------------------------------------------------
//  Replace touch events for input fields
// -----------------------------------------------------------
			$('body').hammer().on('tap', 'input', function(e){
				e.preventDefault();
				$(this).focus();
				if(opui.config && opui.config.platform != 'opux'){
					window.location = 'cellcast://action/keyboard';
				}
			});

// ------------------------------------------------------------
//  Replace touch events for 'selectable' items
// ------------------------------------------------------------
			$('body').hammer().on('touch', '.selectable', function(){
				$(this).addClass('inverse');
			});

			$('body').hammer().on('release', '.selectable', function(){
				$(this).removeClass('inverse');
			});

// ------------------------------------------------------------
//  Handler for self assignment
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='assign']", function(){
				// e.preventDefault();
				var scurl = $(this).data('url');

				var r = confirm('Would you like to view the selection now?');
				if(r == true){
					window.location = scurl+'/true';
				} else {
					window.location = scurl+'/false';
				}
			});

// ------------------------------------------------------------
//  Replace touch events for 'CellCast' items
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='cellcast']", function(e){
				e.preventDefault();
				opui.console.log('A CellCast item has been launched.');
				var scurl = $(this).data('url');
				if(opui.config && opui.config.platform === 'opux'){
					return opui.scurl.run(scurl);
				} else {
					window.location = scurl;
				}
			});

// ------------------------------------------------------------
//  Replace touch events for 'CellCast' items
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='launch']", function(e){
				e.preventDefault();
				opui.console.log('A CellCast item has been launched.');
				var type = $(this).data('type');
				var id = $(this).data('id');
				var details = $(this).data('details');

				var status = opui.tools.checkAssignStatus(type, id);
				if(opui.config && opui.config.platform === 'opux'){
					if(opui.config.launch_target === 'opmcv'){
						if(details === 'show'){
							opui.events.publish('opmcv:fullscreen', {
								title: "Player",
								url: '/opmcv/'+type+'?id='+id+'&hide_menu=true'
							});
						} else {
							opui.events.publish('opmcv:fullscreen', {
								title: "Player",
								url: '/opmcv/'+type+'?id='+id+'&hide_menu=true'
							});
						}
					} else {
						var s_width = screen.availWidth / 0.9;
						var s_height = screen.availHeight / 0.9;
						if (s_width > 1200)
							s_width = 1200;
						if (s_height > 1024)
							s_height = 1024;
						var s_left = parseInt((screen.availWidth/2) - (s_width/2));
						var s_top = parseInt((screen.availHeight/2) - (s_height/2));
						var windowFeatures = "width=" + s_width + ",height=" + s_height + ",scrollbars=yes, resizable=yes, toolbar=no, minimize=no, menubar=no, status=yes ,left=" + s_left + ",top=" + s_top + "screenX=" + s_left + ",screenY=" + s_top;
						if(type === 'test_set')
						{
							type = 'testset';
						}
						if(type === 'ievent' || type === 'wevent')
						{
							type = 'event';
						}
						window.open('/opportal/CustomUiLauncher?type='+ type +'&id=' + id, "opls", windowFeatures);
					}
				} else {
					if(status === 'assigned') {

						if(details === 'show'){
							window.location = 'cellcast://'+type+'/'+id+'/false';
						} else {
							window.location = 'cellcast://'+type+'/'+id+'/true';
						}

					} else if (status === 'unassigned') {

						window.location = 'cellcast://action/assign/'+type+'/'+id+'/true';

					} else {
						return true;
					}

				}
			});

			$('body').hammer().on('tap', '[data-breadcrumb-back]', function (e){
				e.preventDefault();

				var index = $(this).data('breadcrumb-back');
				var entry = opui.breadcrumb.entries[index];

				var level = opui.breadcrumb.entries.length - index - 1;


				opui.console.log(level);
				opui.history.stepBack(level);
				opui.breadcrumb.removeEntry(level);

			});

// ------------------------------------------------------------
//  Replace touch events for 'CellCast' items
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='external']", function(e){
				e.preventDefault();
				opui.console.log('A CellCast item has been launched.');
				var url = $(this).data('url');
				if(platform === 'android'){
					url = encodeURIComponent(url);
				}
				window.location = 'cellcast://action/newbrowser/'+url;
			});

// ------------------------------------------------------------
//  Replace touch events for 'CellCast' items
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='avatar']", function(e){
				e.stopPropagation();
				window.location = 'cellcast://action/updateavatar';
			});

// ------------------------------------------------------------
//  Replace touch events for 'Content' items
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='content']", function(e){
				e.preventDefault();
				var scurl = $(this).data('url');
				opui.update(scurl)
			});

			// Launch bindings for OPMCV
			$('body').hammer().on('tap', "[data-role='launch-opmcv']", function(e){
				e.preventDefault();

				var type = $(this).data('type');
				var id = $(this).data('id');
				var details = $(this).data('details');
				opui.console.log(type + ':' + id + ' has been launched.');

				//window.location = '/opmcv/'+type+'?id='+id+'&mode=3&action=browse';

				var width = $(document).width();
				var height = $(document).height();
				var player = $('<iframe/>').attr({
					height: height,
					width: width,
					src: '/opmcv/'+type+'?id='+id+'&mode=3&action=browse'
				});

				$('<div/>').attr('id', 'opmcv')
					.append('<div>CLOSE</div>')
					.append(player)
					.css({
						'z-index': 10000,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						position: 'absolute',
						'background-color': '#333'
					})
					.appendTo('body');
			});


//// ------------------------------------------------------------
////  Replace touch event for AJAX targets
//// ------------------------------------------------------------
//			$('body').hammer().on('tap', "[data-role='ajax']", function(e){
//				e.preventDefault();
//				var item   = $(this);
//				var target = item.data('url');
//				var navPos = item.data('nav');
//				var obj  = item.data();
//				opui.history.publish('page:change', obj);
//
//				//opui.history.stepPush(obj.url,obj.nav,clone);
//				//opui.history.hideCurrent(target,navPos,clone);
//			});

// ------------------------------------------------------------
//  Binding for list filtering
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='link-filter']", function(e){
				e.preventDefault();
				// update button selected class
				$('[data-role="link-filter"]').removeClass('selected');
				$(this).addClass('selected');

				var target = $(this).data('target');
				var base = $.parseJSON(JSON.stringify($(target).data()));
				var options = $.parseJSON(JSON.stringify($(this).data()));
				var settings = $.extend(base, options);

				console.log('Link Filter', settings);
				if($(target).hasClass('enhance')){
					$(target).listItems(settings);
				}
				if($(target).hasClass('render')){
					$(target).render(settings);
				}
			});

// ------------------------------------------------------------
//  Binding for list filtering
// ------------------------------------------------------------
			$('body').on('change', '[data-role="select-filter"]', function(e){
				e.preventDefault();

				var target = $(this).data('target');
				var base = $.parseJSON(JSON.stringify($(target).data()));

				var baseOptions = $.parseJSON(JSON.stringify($(this).data()));
				var specificOptions = $.parseJSON(JSON.stringify($("option:selected", this).data()));

				var options = $.extend(baseOptions, specificOptions);
				var settings = $.extend(base, options);

				$(target).listItems(settings)

			});

// ------------------------------------------------------------
//  Replace touch event for TAG targets
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='tags']", function(e){
				e.preventDefault();
				var item   = $(this);
				var obj = item.data();

				opui.history.stepPush('pgs/assignments/tags.html','',obj);
				opui.history.hideCurrent('pgs/assignments/tags.html','',obj);
			});

// ------------------------------------------------------------
//  Replace touch event for TAG targets
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='node']", function(e){
				e.preventDefault();
				var item   = $(this);
				var nodeId = item.data('node');
				var node = opui.hierarchy.nodesArray.filter(function(node){
					return (node.node_id === nodeId);
				})[0];

				var url = item.data('url')?item.data('url'):null;

				if(url){
					opui.history.stepPush(url,'',node);
					opui.history.hideCurrent(url,'',node);
				} else {
					opui.history.stepPush('pgs/hierarchy/node.html','',node);
					opui.history.hideCurrent('pgs/hierarchy/node.html','',node);
				}


			});

// ------------------------------------------------------------
//  Replace touch event for UI back button
// ------------------------------------------------------------
			$('body').hammer().on('touch', "[data-trigger='back']", function(){
				$('#back-btn').addClass('touch');
			});

			$('body').hammer().on('release', "[data-trigger='back']", function(){
				$('#back-btn').removeClass('touch');
				//opui.breadcrumb.removeEntry(2);
				//opui.history.stepBack(1);
				opui.history.publish('page:back');

			});


// ------------------------------------------------------------
//  Replace touch events for Filtered lists
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='filterlink']", function(e){
				e.preventDefault();
				var filterObj = $(this).data('filter');
				opui.update(scurl)
			});



// ------------------------------------------------------------
//  Replace touch events for 'Demo' pages
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='demo']", function(e){
				e.preventDefault();
				alert('This function is coming soon.')
			});

// ------------------------------------------------------------
//  Logout Prompt
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-trigger='logout']", function(e){
				e.preventDefault();
				var scurl = $(this).data('url');
				logout = function(){
					var conf = confirm('If you are not on a shared device, press cancel to close this prompt. Otherwise, press OK to proceed with logging out.');
					if(conf == true){
						window.location = scurl;
					} else {
						// close prompt
					}
				};
				logout();
			});

// ------------------------------------------------------------
//  Replace touch events for slide navigation toggle
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-trigger='menu']", function(e){
				console.log('DATA TRIGGER MENU');
				e.preventDefault();
				opui.nav.toggleNav();
			});

// ------------------------------------------------------------
//  Replace touch events for 'Debug'
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-role='debug']", function(e){
				e.preventDefault();

				var ip = prompt('Enter your IP:PORT Address here');

				$('head').prepend('<script src="http://'+ip+'/target/target-script-min.js"></script>');
			});

			// ------------------------------------------------------------
//  Replace touch events for 'Debug'
// ------------------------------------------------------------
			$('body').hammer().on('tap', "[data-url]", function(e){
				e.preventDefault();

				var url = $(this).data('url');
				var params = $(this).data();
				delete params.url;
				//var paramString = $.param(params);

				var parts = [];
				for (var i in params) {
					if (params.hasOwnProperty(i)) {
						parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
					}
				}
				var paramString = parts.join("&");

				if(url.indexOf('cellcast://') > -1){
					window.location = url;
				} else {

					riot.route(url+'?'+paramString);
					window.scrollTo(0,0);
					//opui.events.publish('page:change', {url:url, params:params});
				}

			});
		}
	};



}(window.opui = window.opui || {}, jQuery, riot, undefined));
;/**
 * OPUI Bootstrap Module
 * For loading and initial setup
 * Author: Joshua Brown, OnPoint Digital, Inc.
 */
(function(opui, $, undefined){

    //legacy requirement for platforms that call setpaths directly (ios)
    window.setpaths = function(){
        //do nothing
        if(arguments.length == 3) {
            opui.bootstrap.setpaths(arguments[0], arguments[1], arguments[2]);
        }
        if(arguments.length == 2){
            opui.bootstrap.setpaths(arguments[0], arguments[1]);
        }
    };

    /**
     * @namespace bootstrap
     * @memberof opui
     */
    opui.bootstrap = {

        /**
         * SCURL to request paths to JSON documents, Images, and value for platform constant
         * @function getPaths
         * @memberof! opui.bootstrap
         */
        getPaths: function(){
            opui.console.log('BOOTSTRAP: getPaths called');
            window.location = "cellcast://data/getpaths/setpaths";
        },

        /**
         * Callback for {@link opui.bootstrap.getPaths} method
         * @param one
         * @param two
         * @param three
         */
        setpaths: function (){
            opui.console.log('BOOTSTRAP: setpaths called');
            opui.console.log(arguments);
            opui.config.jsonpath = 'path/to/json';
            opui.config.imgpath = 'path/to/img';

            if(arguments.length == 3){
                opui.console.log('Bootstrap: arguments length is 3');
                opui.config.jsonpath = arguments[0];
                opui.config.imgpath = arguments[1];
                opui.config.platform = arguments[2];
            }
            if(arguments.length == 2){
                opui.console.log('Bootstrap: arguments length is 2');
                opui.config.imgpath = arguments[0];
                opui.config.platform = arguments[1];
            }

            if(opui.config.platform == 'bb10'){
                //listen for messages from BB10
                navigator.cascades.onmessage = function onmessage(message) {
                    opui.data.processReturn(message);
                }
            }
            opui.console.log("JSON path: "+opui.config.jsonpath+" | image path: "+opui.config.imgpath+" | Platform: "+opui.config.platform);

            //run data requests
            opui.data.initialRequests();

        },

        /**
         *
         */
        start: function(){
            riot.mount('*');
            riot.route.start();
            riot.route(opui.config.home);

            if(opui.config && opui.config.offline){

                if(opui.offline){
                    opui.offline.load('offline.json');
                } else {
                    console.error('----------------- OFFLINE DATA NOT FOUND: Please temporarily update package to use opui.js (development) library version');
                    alert('OFFLINE DATA NOT FOUND: Please temporarily update package to use opui.js (development) library version');
                }


            } else if (opui.config && !opui.config.offline && opui.config.platform === 'opux'){
                opui.data.initialRequests();
            } else {
                opui.bootstrap.getPaths();
            }
        },
        
        init: function(){
            opui.console.log('Module initialized: Bootstrap');
        }
    };


}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

	/**
	 * @namespace breadcrumb
	 * @memberof opui
	 */
	opui.breadcrumb = {

		/**
		 * Entries list
		 * @type {Array}
		 */
		entries: [],

		/**
		 * Add entry to the list
		 * @function addEntry
		 * @memberof! opui.breadcrumb
		 * @param {String} text Display text of breadcrumb entry
		 */
		addEntry: function (text) {
			opui.breadcrumb.entries.push(text);
		},

		/**
		 * Remove last entry from the list
		 * @function removeLastEntry
         * @memberof! opui.breadcrumb
		 */
		removeLastEntry: function () {
			opui.breadcrumb.entries.pop();
		},

		/**
		 * Remove a specified number of entries from the list
         * @function removeEntry
         * @memberof! opui.breadcrumb
		 * @param {Number} level Number of entries to remove
		 */
		removeEntry: function (level) {
			opui.breadcrumb.entries = opui.breadcrumb.entries.slice(0, (-level)-1);
		},

		/**
		 * Limit the number of entries displayed in the breadcrumb
         * @function renderLimit
         * @memberof! opui.breadcrumb
		 * @param {Number} level Number of entries to display
		 */
		renderLimit: function (level) {
			
		},

		/**
		 * Remove all entries from the list
         * @function reset
         * @memberof! opui.breadcrumb
		 */
		reset: function(){
			opui.breadcrumb.entries = [];
		},

        init: function(){
            opui.events.installTo(opui.breadcrumb);
            opui.console.log('Module initialized: Breadcrumb');

			//
			opui.breadcrumb.subscribe('page:change', function(obj){
				opui.breadcrumb.addEntry(obj.nav);
			});
        }

	};
}(window.opui = window.opui || {}, jQuery, undefined));;// PROJECT FUNCTIONS CONFIGURATION

(function (opui, $, undefined){

	/**
	 * @namespace config
	 * @memberof opui
	 * @type {{}}
	 */
    opui.config = {};

	/**
	 * Default configuration values
	 * @member {Object} defaults
	 * @memberof opui.config
	 */
    var defaults = {
		"name": "unnamed-project",
		"branding": "css",
		"debug": true,
		"offline": true,
		"development": true,
		"home": "pgs/home/home.html",
		"translated": false,
		"style-src": "master.css",
		"platform": "cellcast",
		"styles": {},
		"features":{
			"forums": false,
			"blogs": false,
			"my_media": false,
			"video": false,
			"photo": false,
			"audio": false,
			"gamification": false,
			"search": true,
			"environment": true,
			"hierarchy": false,
			"curricula":false
		},
		"tiles": [
			{
				"background-image": "url(img/tiles/tile-assignments.png)",
				"title": "Content",
				"page": "pgs/assignments/selections.html",
				"navigation-indicator": "content",
				"key": "poem_assignments"
			},
			{
				"background-image": "url(img/tiles/tile-search.png)",
				"title": "Search",
				"page": "pgs/search/search-term.html",
				"navigation-indicator": "search",
				"key": "main_search"
			},
			{
				"background-image": "url(img/tiles/tile-networks.png)",
				"title": "Networks",
				"page": "pgs/networks/selections.html",
				"navigation-indicator": "networks",
				"key": "menu_networks"
			},
			{
				"background-image": "url(img/tiles/tile-games.png)",
				"title": "Games",
				"page": "pgs/games/profiles.html",
				"navigation-indicator": "games",
				"key": "menu_gamification"
			}

		],
		"menu":[
			{
				"icon": "home",
				"title": "Home",
				"page": "pgs/home/home.html",
				"navigation-indicator": "home",
				"key": "menu_home"
			},
			{
				"icon": "pencil",
				"title": "Content",
				"page": "pgs/assignments/selections.html",
				"navigation-indicator": "content",
				"key": "poem_assignments"
			},
			{
				"icon": "search",
				"title": "Search",
				"page": "pgs/search/search-term.html",
				"navigation-indicator": "search",
				"key": "main_search"
			},
			{
				"icon": "trophy",
				"title": "Games",
				"page": "pgs/games/profiles.html",
				"navigation-indicator": "games",
				"key": "menu_gamification"
			},
			{
				"icon": "chat",
				"title": "My Networks",
				"page": "pgs/networks/selections.html",
				"navigation-indicator": "my networks",
				"key": "menu_networks"
			},
			{
				"icon": "cog",
				"title": "Utilities",
				"page": "pgs/utilities/selections.html",
				"navigation-indicator": "utilities",
				"key": "menu_utilities"
			}
		]
    };

	/**
	 * Gets package "config.json" file and extends default values
	 * @function getConfig
	 * @memberof! opui
	 * @returns {Object} configuration values
	 */
	opui.getConfig = function(){
		//var def = $.Deferred();
		return $.ajax({
			url: 'config.json',
			async: false,
			dataType: 'json',
			success: function (data){
				opui.config = $.extend(defaults, data);
			},
			error: function(jqXHR){
				opui.config = defaults;
			}
		});
		//return def;
	};



}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

    /**
     * @namespace console
     * @memberof opui
     * @type {{history: Array, log: Function, getHistory: Function}}
     */
    opui.console = {


        /**
         * List of history entries
         * @memberof! opui.console
         */
        history: [],

        /**
         * log
         * @function log
         * @memberof! opui.console
         * @param {*} msg
         * @returns {boolean}
         */
        log: function(){

            if(opui.config.debug && window.console){

                var args = Array.prototype.slice.call(arguments);
                var temp = new Date();
                temp = temp.getHours()+':'+temp.getMinutes()+':'+temp.getSeconds()+':'+temp.getMilliseconds();
                args.unshift(temp);

                if (window.hasOwnProperty('air')) {

                    air.Introspector.Console.log(temp+': '+msg);
                    if(typeof(msg) != 'string'){
                        air.Introspector.Console.log(msg);
                    }

                } else {
                    console.trace.apply(console, args);
                }
            } else {
                return true;
            }
        },

        /**
         * Reruns the logging entries in the console
         * @function getHistory
         * @memberof! opui.console
         */
        getHistory: function(){
            for (var i=0; i < opui.console.history.length; i++){
                console.log(opui.console.history[i]);
            }
        }
    }

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

    /**
     * Event mediator for pub/sub
     * @namespace events
     * @memberof opui
     */
    opui.events = (function(){

        /**
         * Subscribe to a channel or create one if it doesn't exist
         * @function subscribe
         * @memberof! opui.events
         * @param {String} channel Name of channel
         * @param {Function} fn Subscription callback
         * @returns {subscribe}
         */
        var subscribe = function(channel, fn){
                if(!opui.events.channels[channel]){
                   opui.events.channels[channel] = [];
                }
                opui.events.channels[channel].push({
                   context: this,
                   callback: fn
                });
                return this;
            },

            /**
             * Publish to a channel or create one if it doesn't exist
             * @function publish
             * @memberof! opui.events
             * @param {String} channel Name of channel
             * @returns {publish}
             */
            publish = function(channel){
                if(!opui.events.channels[channel]){
                    opui.events.channels[channel] = [];
                }
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0, l = opui.events.channels[channel].length; i < l; i++){
                    var subscription = opui.events.channels[channel][i];
                    subscription.callback.apply(subscription.context, args);
                }
                return this;
            };

        return {
            channels: {},
            publish: publish,
            subscribe: subscribe,
            installTo: function(obj){
                obj.subscribe = subscribe;
                obj.publish = publish;
            }
        };
    }());

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, Handlebars, undefined){



	/**
	 * @function Helper: ifGtZero
	 * @param {Number} prop value to be tested
	 * @param {Object} options Handlebars template object
	 */
	Handlebars.registerHelper('ifGtZero', function(prop, options){
		if(prop > 0){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	/**
	 * @function Helper: ifeq
	 * @param {String|Number} key comparison property
	 * @param {String|Number} value comparison value
	 * @param {Object} options Handlebars template object
	 * @example
	 * {{#ifeq 3 3}}
	 *   true
	 * {{else}}
	 *   false
	 * {{/ifeq}}
	 * ---------------
	 * true
	 */
	Handlebars.registerHelper('ifeq', function(key, value, options){
		if(key === value){
			return options.fn(this);
		} else {
			return options.inverse(this)
		}
	});

	/**
	 * @function Helper: i18n
	 * @description language translation
	 * @param {String} key phrase key
	 * @param {String} def default phrase value
	 * @param {Object} options Handlebars template object
	 * @example
	 * {{i18n 'general_menu' 'Menu'}}
	 */
	Handlebars.registerHelper('i18n', function(key, def, options){

		if(opui.config.translated && key){
			if(translate[key]){
				return translate[key];
			} else {
				return '???'+key+'???';
			}
		} else {
			return def;
		}

	});

	/**
	 * @function Helper: stats
	 * @description General stat info about assignments and notifications
	 * @param {String} keyword predefined options
	 * @param {Object} options Handlebars template object
	 * @example
	 * Usage
	 * {{stats 'assignmentsCount'}}
	 *
	 * Values
	 * assignmentsCount
	 * newAssignments
	 * unreadAnnouncements
	 * unreadNotifications
	 * attempted
	 * incomplete
	 * complete
	 * totalHours
	 * completedHours
	 */
	Handlebars.registerHelper('stats', function(keyword, options){
		switch (keyword) {
			case 'assignmentsCount':
				return opui.store.getStore('assignments').length;
				break;
			case 'unreadAnnouncements':
				return opui.store.getStore('announcements').filter(function(e){
					return (e.viewed === false);
				}).length;
				break;
			case 'unreadNotifications':
				return opui.store.getStore('notifications').filter(function(e){
					return (e.viewed === false);
				}).length;
				break;
			case 'not-attempted':
				return opui.store.getStore('assignments').filter(function(e){
					return (e.status >= 6 || e.status === 'Pending');
				}).length;
				break;
			case 'incomplete':
				return opui.store.getStore('assignments').filter(function(e){
					return ((e.status > 2 && e.status < 6) || e.status === 'Pending');
				}).length;
				break;
			case 'complete':
				return opui.store.getStore('assignments').filter(function(e){
					return (e.status <= 2 || e.status === 'Complete');
				}).length;
				break;
			case 'totalHours':
				return (function(){
					var hours = 0;
					opui.store.getStore('assignments').forEach(function(e){
						if(e.duration){
							hours += e.duration;
						}
					});
					return Math.round(hours/60);
				})();
				break;
			case 'completedHours':
				return (function(){
					var hours = 0;
					opui.store.getStore('assignments').forEach(function(e){
						if(e.status <= 2 && e.duration){
							hours += e.duration;
						}
					});
					return Math.round(hours / 60);
				})();
			default:
				return 'stats';
		}
	});

	Handlebars.registerHelper('length', function(collection, options){
		return collection.length;
	});

	// {{skillprofileCollectionProgress tag}}   e.g. {{skillprofileCollectionProgress 'banana'}}
	Handlebars.registerHelper('skillprofileCollectionProgress', function(tag, options){

		var items = opui.store.getStore('assignments').filter(function(item){
			return (item.metatags.search(tag) > -1 && item.assignType === 'skillprofile');
		});

		if(items.length < 1){
			return '0%';
		}

		var progress = 0;
		items.forEach(function(item){
			// get skillprofile
			var sp = $.parseJSON(JSON.stringify(item));

			// get skillprofile items
			var totalItems = sp.items.length;


			var spCompletedItems = 0;

			sp.items.forEach(function(item){
				opui.console.log('type: ' + item.type + ' id: ' + item.id + ' mobile? ' + item.mobile);
				if(item.mobile){
					var i = opui.store.getStore('assignments').filter(function(e){
						return (e.id === item.id && e.assignType === item.type);
					});
					// console.log(i[0])

					if(i.length > 0 && (i[0].status < 3 || i[0].sco_status < 3 || i[0].status === 'Completed')){
						spCompletedItems++;
					}
				}
			});

			progress += Math.round((spCompletedItems / totalItems) * 100);

		});
		return Math.round((progress / (items.length * 100))*100) + '%';

	});


	// {{skillProgress ID}}   e.g. {{skillProgress 123}}
	Handlebars.registerHelper('skillProgress', function(skillprofile, options){
		opui.console.log(skillprofile);
		if(skillprofile.items.length > 0){
			var count = 0;
			skillprofile.items.forEach(function(e){
				var item = opui.store.getStore('assignments').filter(function(x){
					return (x.id === e.id && x.assignType === e.type);
				})[0];
				if(!item){
					return true;
				} else {
					if(item.status <= 3 || item.sco_status <= 3 || item.status === 'Complete'){
						count++;
					}
				}
			});
			var progress = Math.round((count / skillprofile.items.length) * 100);
			if(progress < 1){
				progress = 0;
			}
			return progress + '%';
		} else {
			return '0%';
		}
	});

	// {{tagProgress tag}}   e.g. {{tagProgress 'banana'}}
	Handlebars.registerHelper('tagProgress', function(tag, options){

		var items = catalog.filter(function(item){
			return (item.metatags.search(tag) > -1);
		});

		if(items.length < 1){
			return '0%';
		}

		var completedItemCount = items.filter(function(item){
			return (item.status === 2 || item.sco_status === 2 || item.status === 'Complete');
		}).length;

		var progress = Math.round((completedItemCount / items.length) * 100);

		return progress + '%';
	});

	Handlebars.registerHelper('gameProgress', function(id, options){

		var user_points = 0;
		var user_accel = 0;
		var game_points = 0;

		if(id === 'all'){
			opui.console.log('NO GAME ID GIVEN');
			var items = opui.store.getStore('games');
			items.forEach(function(game){
				user_points += parseInt(game.user_points);
				user_accel += parseInt(game.user_accel ? game.user_accel : 0);
				game_points += parseInt(game.game_points);
			});

		} else {
			var items = opui.store.getStore('games').filter(function (item){
				return(item.game_id === id);
			});

			user_points = parseInt(items[0].user_points ? items[0].user_points : 0);
			user_accel = parseInt(items[0].user_accel ? items[0].user_accel : 0);
			game_points = parseInt(items[0].game_points ? items[0].game_points : 0);
		}


		var progress = Math.floor(((user_points + user_accel) / game_points) * 100);


		return progress ? progress : 0;
	});

	Handlebars.registerHelper('status', function(status, options){
		switch (status) {
			case 1:
				return 'passed';
			case 2:
				return 'completed';
			case 3:
				return 'failed';
			case 4:
				return 'incomplete';
			case 5:
				return 'browsed';
			case 6:
				return 'not_attempted';
			case 8:
				return 'provisionally-complete';
			case 'Pending':
				return 'incomplete';
			case 'Completed':
				return 'completed';
			default:
				return 'provisionally-complete';
		}
	});
    
    Handlebars.registerHelper('feature_check', function(feature, options){
        if(opui.config && opui.config.features){
            if(opui.config.features[feature] || opui.config.features[feature] === undefined){
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    });

	Handlebars.registerHelper('img', function(image, options){
		if(image.length > 0) {
			return opui.config.imgpath + image;
		} else {
			return 'img/thumbs/sample.png';
		}
	});


}(window.opui = window.opui || {},jQuery, Handlebars, undefined));
;(function (opui, $, undefined){

    /**
     * @namespace hierarchy
     * @memberof opui
     */
	opui.hierarchy = (function(){


		var that  = this;


        /**
         * Sort comparison by id
         * @memberof opui.hierarchy
         * @private
         * @returns {Number}
         */
		function compareId(a,b){
			if (a.node_id < b.node_id){
				return -1;
			}
			if (a.node_id > b.node_id){
				return 1;
			}
			return 0;
		}



		return {

            /**
             * @memberof! opui.hierarchy
             */
			model: {},

            /**
             * Recurse through nested node structure and create flat
             * list of nodes in {@link opui.hierarchy.nodesArray} with references to parent nodes
             * @function flattenNodes
             * @memberof! opui.hierarchy
             * @param {Object} node
             * @param {Object} parent
             */
			flattenNodes: function(node, parent){

				// create object
				var n = $.parseJSON(JSON.stringify(node));
				delete n.children;

				opui.hierarchy.nodesArray.push(n);

				if(node.children !== undefined && node.children.length > 0){
					node.children.forEach(function(child){
						opui.hierarchy.flattenNodes(child, node);
					});
				}

			},

            /**
             * Requests hierarchy data from native app and store returned data in {@link opui.hierarchy.model}
             * @function getNodes
             * @memberof! opui.hierarchy
             * @returns {Object} promise A promise object
             */
			getNodes: function(){
				var def = $.Deferred();
				opui.hierarchy.nodesArray = [];
				if(opui.config.offline){
					opui.hierarchy.model = hierarchy.nodes;
					opui.hierarchy.model.forEach(function(node){
						opui.hierarchy.flattenNodes(node);
						opui.hierarchy.nodesArray.sort(compareId);
						opui.store.setStore('nodes', 'node', 'node_id', opui.hierarchy.nodesArray);
					});
					def.resolve();
				} else {
					getData('hierarchy', 'hierarchy.json', 'cellcast://data/hierarchies', true)
					.done(function(data){
						opui.console.log('hierarchy returned');
						opui.hierarchy.model = data.nodes;
						opui.hierarchy.model.forEach(function(node){
							opui.hierarchy.flattenNodes(node);
							opui.hierarchy.nodesArray.sort(compareId);
							opui.store.setStore('nodes', 'node', 'node_id', opui.hierarchy.nodesArray);
						});
						def.resolve();
					})
				}
				return def;
			},

			/**
			 * Get Content items associated with a specific node
			 * @function getNodeContent
			 * @memberof! opui.hierarchy
			 * @param nodeId
			 * @returns {Array}
			 */
			getNodeContent: function(nodeId){
				var content = [];
				var node = opui.store.getContent('node', nodeId);
				if(node){
					node.items.forEach(function(item){
						var t = JSON.parse(JSON.stringify(opui.store.getItem(item.item_type, item.item_id)));
						t.sequence = item.sequence;
						content.push(item);
					});
				}
				return content;
			},

            /**
             * Flattened list of nodes
             * @member
             * @memberof! opui.hierarchy
             */
			nodesArray:[]

		}

	})();


}(window.opui  = window.opui || {}, jQuery, undefined));;// OPUI.HISTORY.JS - v1.0.1 - 04/18/2013
(function (opui, $, undefined) {

// ------------------------------------------------------------
//  Set default variables
// ------------------------------------------------------------
	var wrapper 	= $('[data-role="wrapper-content"]'),
		content 	= $('[data-role="load-content"]'),
		navigation  = $('[data-role="load-navigation"]'),
		bodyScroll,
		navItem 	= $('.nav-list li div'),
		navClass 	= 'selected',
		backBtn     = $('[data-role="back-btn"]'),
		errorPg 	= 'pgs/error/error.html',
		timeoutPg	= 'pgs/error/timeout.html',
		homePg      = opui.config.home ? opui.config.home : 'pgs/home/home.html',
		_historyUrl	= [], // stores the url for each history entry
		_historyNav = [], // stores the nav item target for each history entry
		_historyObj = []; // stores the cloned content of the touched object

// ------------------------------------------------------------
//  Push url and nav position into respective arrays
// ------------------------------------------------------------

	/**
	 * @namespace history
	 * @memberof opui
	 */
	opui.history = {

        /**
        * Push history objects into stored lists
        * @function stepPush
        * @memberof! opui.history
        * @param {Object} url
        * @param {Object} nav
        * @param {Object} obj
        */
		stepPush : function(url,nav,obj){
			opui.console.log(':: Pushing current states to their respective arrays');
			_historyUrl.push(url);
			_historyNav.push(nav);
			_historyObj.push(obj);

			var urlLength 	= _historyUrl.length;
			var navLength  	= _historyNav.length;
			var objLength 	= _historyObj.length;

			if(urlLength >= 2){
				var indexEnd = _historyUrl[urlLength - 1]; // Last entry in the array
				var indexStl = _historyUrl[urlLength - 2]; // Second to last entry in the array
				// if(indexStl == indexEnd){
					// Remove duplicate entry
					// indexRemove = _historyUrl.length - 1;
					// _historyUrl.splice(indexRemove, 1);
				// }
			}
		},

		stepBack : function(count){
			opui.console.log(':: Stepping back '+count+' entry(s) in the history');
			if(!count){
				var count = 0;
			}
			for (var i = 0 ; i < count; i++){
				opui.history.removeLast();
			}
			
			var urlTarget = _historyUrl.length - 1;
			var navTarget = _historyNav.length - 1;
			var objTarget = _historyObj.length - 1;
			if(urlTarget >= 0){
				opui.history.hideCurrent(_historyUrl[urlTarget], _historyNav[navTarget], _historyObj[objTarget]);
				//riot.route(_historyUrl[urlTarget], _historyObj[objTarget]);
			} else {
			
			}
		},

		hideCurrent : function(url,nav,obj){
			opui.console.log(':: Hiding visible content in the loading area');
			opui.console.log(url);
			$('article', content).fadeTo(100,0,function(){
				//startSpinner();
				navPos = navigation.find('.'+navClass).parent().data('nav');
				if(navPos != nav){
					$('.nav-list li div').removeClass(navClass);
					var toSelect = navigation.find("[data-nav='" + nav + "']").children('div').addClass(navClass);
				} else {
					// do nothing
				}
				opui.history.loadTarget(url,obj);

			});
			// opui.history.refreshBackButton(url)
		},

		loadTarget : function(url,obj){
			var def = $.Deferred();
			var file 	 	= url.substring(url.lastIndexOf('/')+1),
				getParts 	= file.split(/[.]+/),
				filename 	= getParts[0];


			if(filename == 'paths-detail'){
				opui.history.loadPathDetail(url,obj)
			} else {
				opui.history.loadPage(url, obj, def);
			}
			return def;
		},

		loadPage : function(url,obj,def){
			window.pageLoad = $.Deferred();
			opui.console.log(':: Loading content from target url');
			content.html('').load(url, "", function(responseText, textStatus, XMLHttpRequest){
				opui.console.log('Load status: '+textStatus);
				if(textStatus == 'error' || textStatus == 'abort' || textStatus == 'parseerror'){
					content.html('').load(errorPg)
				} else if(textStatus == 'timeout'){
					content.html('').load(timeoutPg)
				} else if(textStatus == 'success' || textStatus == 'notmodified'){
					if(opui.config.platform != 'opair'){
						opui.console.log('NOT opair');
						var render = content.clone();
						render.find('script').remove();
						var template = Handlebars.compile(render.html());
						content.html(template(obj));



						content.find('.render').render();
						opui.console.log('render done')
					}
					
					content.find('.enhance').listItems();
					opui.console.log('enhance done');
					
					$('[data-key]').language();
					opui.console.log('language done');

					if(content.find('article').data('breadcrumb') === 'reset'){
						opui.breadcrumb.reset();
					} else if (content.find('article').data('title')) {
						var entry = {
							text: content.find('article').data('title'),
							target: url,
							data: obj
						};
						// var pageTitle = content.find('article').data('title');
						if(entry.text.length > 0){
							opui.breadcrumb.addEntry(entry);
						}
						
					} else {}
					
					pageLoad.resolve();
					pageLoad.resolve();
					def.resolve();
					opui.console.log('ABOUT TO REFRESH BACK BUTTON');
					var pageType = content.find('article').data('page-type');
					opui.console.log('Page Type: ' + pageType);
					opui.history.refreshBackButton(url, pageType);
// 					opui.history.iScrollRefresh();

				}
			}).fadeTo(200, 1, function(){
				//stopSpinner();
				// opui.console.log('ABOUT TO REFRESH BACK BUTTON');
				// var pageType = content.find('article').data('page-type');
				// opui.history.refreshBackButton(url, pageType);
				// opui.history.iScrollRefresh();
			});



		},

		removeLast : function(){
			opui.console.log('Removing last item in history');
			if(_historyUrl.length > 1){
				urlIndexRemove = _historyUrl.length - 1;
				navIndexRemove = _historyNav.length - 1;
				objIndexRemove = _historyObj.length - 1;
				_historyUrl.splice(urlIndexRemove, 1);
				_historyNav.splice(navIndexRemove, 1);
				_historyObj.splice(objIndexRemove, 1)
			} else {
				// do nothing
			}
		},

		clearAll : function(){
			opui.console.log('Removing all items in history');
			_historyUrl = [];
			_historyNav = [];
			_historyObj = [];
		},

		iScrollRefresh : function(){
			opui.console.log('starting iScroll Refresh method...');
			bodyScroll.destroy();
			bodyScroll = null;
			bodyScroll = new iScroll('wrapper-content', { 
				bounce:true, 
				momentum:true, 
				preventGhostClick:true,
				onBeforeScrollStart: function (e) 
                {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'OPTION')
                        e.preventDefault();
                }
			});

			navScroll.destroy();
			navScroll = null;
			navScroll = new iScroll('wrapper-navigation', { 
				bounce:true, 
				momentum:true, 
				preventGhostClick:true,
				onBeforeScrollStart: function (e) 
                {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'OPTION')
                        e.preventDefault();
                }
			});

			setTimeout(function() {
				bodyScroll.refresh();
				navScroll.refresh();
				opui.console.log('iScroll should have refreshed')
			},0);
		},

		refreshBackButton: function(url, type){
			if(_historyUrl.length > 1 && url != homePg && type != 'node') {

				// Show back button but only if it is hidden
				if(!backBtn.hasClass('show')){

					backBtn.addClass('show');

				}

			} else if (_historyUrl.length == 1){

				opui.console.log('-----------HIDING BACK BUTTON-------------');
				backBtn.removeClass('show');
			} else {

				// Hide back button but only if it is showing
				if (backBtn.hasClass('show')){
					backBtn.removeClass('show');
				}
			}
		},

		iScrollInitiate: function(){
			bodyScroll = new iScroll('wrapper-content', {
				bounce:true,
				momentum:true,
				preventGhostClick:true,
				onBeforeScrollStart: function (e)
				{
					var target = e.target;
					while (target.nodeType != 1) target = target.parentNode;
					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'OPTION')
						e.preventDefault();
				}
			});
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},

		init: function(){
			opui.console.log('Module initialized: History');
			opui.events.installTo(opui.history);
           

            ////listen for page change
			//opui.history.subscribe('page:change', function(obj){
             //   opui.history.stepPush(obj.url, obj.nav, obj);
             //   opui.history.loadTarget(obj.url, obj)
			//});
            //
			//opui.history.subscribe('page:back', function(obj){
			//	opui.history.stepBack(1);
			//})
		}
	};
    

    //$(function(){
    //    opui.history.stepPush(opui.config.home, 'home', null);
    //    opui.history.loadTarget(opui.config.home, null);
    //});

	

}(window.opui = window.opui || {}, jQuery, undefined));;// OPUI.LANGUAGE.JS - v1.0.0 - 05/16/2013
(function (opui, $, undefined){

	// ------------------------------------------------------------
	//  Get UI Language Based on File Name
	// ------------------------------------------------------------
	// var url     = window.location.pathname,
	//   filename  = url.substring(url.lastIndexOf('/')+1),
	//   getParts  = filename.split(/[_.]+/);
	//   getLang   = getParts[1]

	// if(getLang == 'index'){
	//   getLang == 'en';
	// }

	var currentLang = $('html').attr('lang');

	if(currentLang === 'ar'){
	$('body').addClass('rtl')
	} else {
	$('body').addClass('ltr')
	}

	/**
	 * Convert keys to phrases
	 * @param {Object} collection language object from index file that contains server-translated values
	 * @param {String} key        language key
	 * @return {String} phrase associated with key
	 */
	function KeyToText (collection, key) {
		return collection[key];
	};

	/**
	 * Plugin to replace the text of each element with [data-key] attribute
	 */
	$.fn.language = function(){
		if(!opui.config.translated){
			return true;
		}
		var defaults;
		
		return this.each(function(){
			var $this = $(this),
				options = $this.data(),
				settings = $.extend(defaults, options),
				key = options.key,
				text = KeyToText(translate, key);

			if(text != 'undefined'){
				if($this.data('phrase-type')){
					if($this.data('phrase-type') == 'input-placeholder'){
						$this.attr('placeholder', text);
					}
					if($this.data('phrase-type') == 'input-value'){
						$this.attr('value', text);
					}
					if($this.data('phrase-type') == 'link'){
						$this.attr('data-url', text);
					}
				} else{
					$this.html(text);
				}
			}

		});
	};

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

	function render(collection, template, target, settings){
		opui.console.log(collection);
		opui.console.log(settings);
		if(collection.length < 1){
			return true;
		}
		$(target).html('');
		var that = this;
		$.each(collection, function(){

			if(typeof(settings.template) == 'object'){
				//get template id based on template map
				if(this.assignType){
					switch(this.assignType){
						case 'nugget':
							var current_tmpl = settings.template.nuggets ? settings.template.nuggets : settings.template.dflt;
							break;
						case 'course':
							var current_tmpl = settings.template.courses ? settings.template.courses : settings.template.dflt;
							break;
						case 'assessment':
							var current_tmpl = settings.template.assessments ? settings.template.assessments : settings.template.dflt;
							break;
						case 'activity':
							var current_tmpl = settings.template.activities ? settings.template.activities : settings.template.dflt;
							break;
						case 'scorm':
							var current_tmpl = settings.template.scorm ? settings.template.scorm : settings.template.dflt;
							break;
						case 'skillprofile':
							var current_tmpl = settings.template.skillprofiles ? settings.template.skillprofiles : settings.template.dflt;
							break;
						case 'announcement':
							var current_tmpl = settings.template.announcements ? settings.template.announcements : settings.template.dflt;
							break;
						case 'notification':
							var current_tmpl = settings.template.notification ? settings.template.notification : settings.template.dflt;
							break;
						default:
							var current_tmpl = settings.template.dflt;
							break;
					}
				}
				if(this.selectionType){
					var current_tmpl = settings.template.unassigned ? settings.template.unassigned : settings.template.dflt;
				}

				var listItem = $(current_tmpl).clone();
			} else {
				var listItem = $(settings.template).clone();
			}


			// var listItem = $(settings).clone();

			listItem.find('[data-scurl="assignment"]').attr('href', "cellcast://"+this.assignType+"/"+this.id+"/false");
			listItem.find('[data-scurl="announcement"]').attr('href', "cellcast://announcement/"+this.id);
			listItem.find('[data-scurl="notification"]').attr('href', "cellcast://notification/"+this.id);
			listItem.find('[data-scurl="assignment-li"]').attr('data-url', "cellcast://"+this.assignType+"/"+this.id+"/true");
			listItem.find('[data-scurl="assignment-false"]').attr('data-url', "cellcast://"+this.assignType+"/"+this.id+"/false");
			listItem.find('[data-scurl="assignment-true"]').attr('data-url', "cellcast://"+this.assignType+"/"+this.id+"/true");
			listItem.find('[data-scurl="announcement-li"]').attr('data-url', "cellcast://announcement/"+this.id);
			listItem.find('[data-scurl="notification-li"]').attr('data-url', "cellcast://notification/"+this.id);
			listItem.find('[data-scurl="gameprofile-li"]').attr('data-url', "cellcast://menu/gameprofiles"+this.id);
			listItem.find('[data-scurl="library"]').attr('href', "cellcast://action/assign/"+this.selectionType+"/"+this.id+"/true");
			listItem.find('[data-scurl="gameprofile"]').attr('href', 'cellcast://menu/gameprofiles/'+this.id);

			//listItem.find('[data-tmpl="launchBtn"]').attr('onclick', 'selectionLaunch('+this.id+')');

			if(listItem.find('[data-tmpl="action"]')){
				if(this.assignType){
					//assume this is an assignment
					listItem.find('[data-tmpl="action"]').attr({
						'data-url':'cellcast://'+this.assignType+'/'+this.id+'/true',
						'data-role':'cellcast'
					});
					listItem.find('[data-tmpl="actionTitle"]').html('View');
				}
				if (this.selectionType) {
					//assume this is a catalog item
					// listItem.find('[data-tmpl="action"]').attr('onclick', 'selectionLaunch('+this.id+')');
					// listItem.find('[data-tmpl="action"]').hammer().on('tap', selectionLaunch(this.id));
					listItem.find('[data-tmpl="action"]').attr({
						'data-url':'cellcast://action/assign/'+this.selectionType+'/'+this.id,
						'data-role':'assign'
					});
					listItem.find('[data-tmpl="actionTitle"]').html('Assign');
				}
			}

			listItem.find('[data-id]').attr('data-id', this.id);

			if(listItem.find('[data-tmpl="thumb"]').length > 0){
				if(this.image && this.image.length > 0){
					listItem.find('[data-tmpl="thumb"]').attr('src', imgpath+this.image);
				} else {
					if(this.assignType){
						if(this.assignType == 'nugget'){
							if(this.type == 'video'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
							if(this.type == 'audio'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
							if(this.type == 'powerpoint'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
							if(this.type == 'cellcast'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
							if(this.type == 'html'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
							if(this.type == 'pdf'){
								listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
							}
						}
						if(this.assignType == 'testset'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
						}
						if(this.assignType == 'course'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
						}
						if(this.assignType == 'scorm'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
						}
						if(this.assignType == 'skillprofile'){
							listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
						}
					}
					listItem.find('[data-tmpl="thumb"]').attr('src', 'img/thumbs/sample.png');
				}
			}

			listItem.find('[data-tmpl="game_title"]').html(this.game_name);
			listItem.find('[data-tmpl="game_description"]').html(this.game_description);
			listItem.find('[data-tmpl="game_total_points"]').html(this.game_points);
			listItem.find('[data-tmpl="game_earned_points"]').html(this.user_points);
			listItem.find('[data-tmpl="game_progress"]').html((Math.floor(this.user_points/this.game_points)*100)+'%');

			listItem.find('[data-tmpl="title"]').html(this.name);
			listItem.find('[data-tmpl="description"]').html(this.description);
			listItem.find('[data-tmpl="status"]').html(this.status);
			listItem.find('[data-tmpl="duration"]').html(this.duration);
			listItem.find('[data-tmpl="text"]').html(this.text);
			if(this.metatags){
				listItem.find('[data-tmpl="metatags"]').html(this.metatags);
			}

			if(listItem.find('[data-tmpl="type_icon"]')){
				if(this.type){
					listItem.find('[data-tmpl="type"]').html(this.type);
					if(this.type == 'video'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.type == 'audio'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.type == 'powerpoint'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.type == 'cellcast'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.type == 'html'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
					if(this.type == 'pdf'){
						listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
					}
				} else {
					listItem.find('[data-tmpl="type_icon"]').attr('src', 'lib/img/thumbs/sample.png');
				}
			}

			if(listItem.find('[data-tmpl="category"]')){
				if(this.metatags){
					listItem.find('[data-tmpl="category"]').html(this.metatags[0]);
				}
			}

			if(this.assignType == 'activity'){
				listItem.find('[data-tmpl="title"]').html(this.activity_name);
				listItem.find('[data-tmpl="description"]').html(this.activity_desc);
				listItem.find('[data-tmpl="status"]').html(this.user_status);
			}

			//If this is a message
			listItem.find('[data-tmpl="msg_title"]').html(this.title);
			if(this.viewed){
				if(this.viewed == true){
					listItem.find('[data-tmpl="msg_status"]').attr('src', 'img/icons/message_read.png');
				} else {
					listItem.find('[data-tmpl="msg_status"]').attr('src', 'img/icons/message_unread.png');
				}
			}

			//if this is a completion status item
			if(this.status == 1 || this.sco_status == 1){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_true.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('passed');
			}
			if(this.status == 2 || this.sco_status == 2){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_true.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('complete');
			}
			if(this.status == 3 || this.sco_status == 3){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_ip.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('failed');
			}
			if(this.status == 4 || this.sco_status == 4){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_ip.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('incomplete');
			}
			if(this.status == 5 || this.sco_status == 5){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('browsed');
			}
			if(this.status == 6 || this.sco_status == 6){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('not_attempted');
			}
			if(this.status == 7 || this.sco_status == 7){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('declined');
			}
			if(this.status == 8 || this.sco_status == 8){
				// listItem.find('[data-tmpl="status-completion"]').attr('src', 'img/stdicons/complete_false.png');
				listItem.find('[data-tmpl="status-completion"]').addClass('provisional');
			}

			//if this item has an associated test
			if(listItem.find('[data-tmpl="status-test"]')){
				if(this.tests){
					if(this.tests.length > 0){
						listItem.find('[data-tmpl="status-test"]').addClass('test_associated');
						if(this.status == 1 || this.sco_status == 1){
							listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
							listItem.find('[data-tmpl="status-test"]').addClass('test_passed');
						}
						if(this.status == 2 || this.sco_status == 2){
							listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
							listItem.find('[data-tmpl="status-test"]').addClass('test_passed');
						}
						if(this.status == 3 || this.sco_status == 3){
							listItem.find('[data-tmpl="status-test"]').removeClass('test_associated');
							listItem.find('[data-tmpl="status-test"]').addClass('test_failed');
						}
					}else{
						listItem.find('[data-tmpl="status-test"]').remove();
					}
				}else{
					listItem.find('[data-tmpl="status-test"]').remove();
				}
			}

			if(this.assignType == 'skillprofile'){
				if(listItem.find('[data-tmpl="spItems"]').length > 0){
					opui.console.log('Skillprofile with subitem template:');
					opui.console.log(this);
					var spItems = this.items;
					$.each(spItems, function(){
						opui.console.log('Subitem Processing:');
						var temp = itemsByAttribute(assignments.assignments, 'id', this.id);
						if(temp.length > 0){
							var spItem = temp[0];
							opui.console.log('subitem id ['+spItem.id+']');
							opui.console.log('subitem template ['+settings.itemtemplate+']');
							var spTmpl = $(settings.itemtemplate).clone();

							spTmpl.find('[data-scurl="assignment"]').attr('href', "cellcast://"+spItem.assignType+"/"+spItem.id+"/false");
							spTmpl.find('[data-tmpl="title"]').html(spItem.name);
							spTmpl.find('[data-tmpl="description"]').html(spItem.description);
							spTmpl.find('[data-tmpl="status"]').html(spItem.status);
							spTmpl.find('[data-tmpl="duration"]').html(spItem.duration);

							//if this is a completion status item
							opui.console.log('item id ['+spItem.id+'] status ['+spItem.status+']');
							if(spTmpl.find('[data-tmpl="status-completion"]')){
								/*if(spItem.status){
								 opui.console.log('item id ['+spItem.id+'] status ['+spItem.status+']')
								 if(spItem.status == 1){
								 listItem.find('[data-tmpl="sco_status"]').addClass('sco_status_complete');
								 listItem.find('[data-tmpl="test_status"]').removeClass('test_associated');
								 listItem.find('[data-tmpl="test_status"]').addClass('test_passed');
								 }
								 if(spItem.status == 2){
								 spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_complete');
								 }
								 if(spItem.status == 4){
								 spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_incomplete');
								 }
								 if(spItem.status == 6){
								 spTmpl.find('[data-tmpl="sco_status"]').addClass('sco_status_notattempted');
								 }
								 }*/

								if(spItem.status || spItem.sco_status){
									if(spItem.status == 2 || spItem.sco_status == 2){
										spTmpl.find('[data-tmpl="status-completion"]').addClass('complete');
									}
									if(spItem.status == 4 || spItem.sco_status == 4){
										spTmpl.find('[data-tmpl="status-completion"]').addClass('incomplete');
									}
									if(spItem.status == 6 || spItem.sco_status == 6){
										spTmpl.find('[data-tmpl="status-completion"]').addClass('not_attempted');
									}
								}
								if(spItem.tests){
									if(spItem.tests.length > 0){
										spTmpl.find('[data-tmpl="status-test"]').addClass('test_associated');
										if(spItem.status == 1 || spItem.sco_status == 1){
											spTmpl.find('[data-tmpl="status-completion"]').addClass('complete');
											spTmpl.find('[data-tmpl="status-test"]').removeClass('test_associated');
											spTmpl.find('[data-tmpl="status-test"]').addClass('test_passed');
										}
										if(spItem.status == 3 || spItem.sco_status == 3){
											spTmpl.find('[data-tmpl="status-completion"]').addClass('incomplete');
											spTmpl.find('[data-tmpl="status-test"]').removeClass('test_associated');
											spTmpl.find('[data-tmpl="status-test"]').addClass('test_failed');
										}
									} else {
										spTmpl.find('[data-tmpl="status-test"]').remove();
									}
								}
								else {
									spTmpl.find('[data-tmpl="status-test"]').remove();
								}
							}

							if(spItem.image != null){
								spTmpl.find('[data-tmpl="thumb"]').attr('src', imgpath+"/"+spItem.image);
							} else {
								spTmpl.find('[data-tmpl="thumb"]').attr('src', "lib/img/thumbs/sample.png");
							}
							listItem.find('[data-tmpl="spItems"]').append(spTmpl.children());
						}

					});
				}
			}

			listItem.children().appendTo(target);
		});
	}

	opui.listItems = {

		init: function(){
			opui.console.log('Module initialized: ListItems');

			opui.events.installTo(opui.listItems);


		}
	};

	(function ($) {

		$.fn.listItems = function(override){
			opui.console.log('Enhance items running');

			var defaults;


			return this.each(function(override){
				var $this = $(this);

				var options = override ? override : $this.data();
				var settings = $.extend(defaults, options);
				var collection = opui.tools.process(settings);
				if(collection == null || collection.length < 1){
					opui.console.log('collection is null');
					return true;
				}

				collection = opui.tools.filter(settings, collection);
				if(collection == null || collection.length < 1){
					opui.console.log('collection is null');
					return true;
				}
				collection = opui.tools.sorting(settings, collection);

				render(collection, settings.template, $this, settings);
			});

		};

	}(jQuery));

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, riot, undefined){
    //TODO Add riot mount limited to the load dom element after each load event
    /**
     * @namespace opui.load
     * @memberof opui
     */
    opui.load = {

        /**
         * Load all partials based on selectors and attributes
         * @function exec
         * @memberof! opui.load
         */
        exec: function(){
            $('[data-load]').each(function(){
                var self = $(this);
                self.load(self.data('load'), '', function(data){
                    //var template = Handlebars.compile(data);
                    //self.html(template());
                    //self.find('.enhance').listItems();
                    //self.find('.render').render();
                    opui.load.publish('load:partials');
                    //riot.mount('*', {});
                });
            });
        },

        /**
         * Initialization
         * @function init
         * @memberof! opui.load
         */
        init: function(){
            opui.events.installTo(opui.load);
            opui.load.exec();
            opui.console.log('Module initialized: Load');
        }
    };

}(window.opui = window.opui || {}, jQuery, riot, undefined));;// OPUI.NAV.JS - v1.0.0 - 04/18/2013
(function (opui, $, undefined) {

// ------------------------------------------------------------
//  Set default variables
// ------------------------------------------------------------
	var docWidth,
		docHeight,
		navigation,
		loadNavigation,
		content,
		set,
		landscapePos,
		portraitPos;

// ------------------------------------------------------------
//  Load Navigation Dynamically
// ------------------------------------------------------------

	opui.nav = {
		loadNav : function(url){
			var def = $.Deferred();
			loadNavigation.html('').load(url, function(){
				window.navScroll = new iScroll('wrapper-navigation', { bounce:true, momentum:true, preventGhostClick:true});
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				opui.nav.setNav();
				if(opui.config.platform != 'opair'){
					loadNavigation.find('.render').render();
				}
				$('[data-key]').language();
				def.resolve();
			}).fadeTo(200, 1, function(){
				
			});
			return def;
		},

		showNav : function(){
			content.addClass('open')
		},

		hideNav : function(){
			content.removeClass('open');
		},

		setNav : function(){
			if(docWidth < docHeight) {
				$('[data-trigger="nav"]').css('display', 'table');

			} else if(docWidth === docHeight){
				$('[data-trigger="nav"]').css('display', 'table');
			}
			set = true;
		},

		toggleNav : function(){
			if(content.hasClass('open')){
				opui.nav.hideNav();
			} else {
				opui.nav.showNav();
			}
		},
        
        init: function(){
            opui.events.installTo(opui.nav);
            opui.console.log('Module initialized: Nav');
            
            
        }

	};

	//  Determine What To Do When Window is Resized
	$(window).resize(function(){
		docWidth	= $(document).width();
		docHeight 	= $(document).height();

		if(docWidth > docHeight){
			if(docHeight > 550){

			} else {
				$('[data-trigger="nav"]').css('display', 'table')

			}
		} else if(docWidth < docHeight) {

		} else if(docWidth == docHeight){

		}
	});

	$(function(){
		docWidth 		= $(document).width(),
		docHeight 		= $(document).height(),
		navigation		= $('[data-role="wrapper-navigation"]'),
		loadNavigation  = $('[data-role="load-navigation"]'),
		content			= $('[data-role="wrapper-container"]'),
		set 			= false,
		landscapePos	= 'left',
		portraitPos		= 'right';
        
        opui.nav.loadNav('pgs/navigation/navigation.html');

		$('body').hammer().on('tap', "[data-trigger='nav']", function(e){
			e.preventDefault();
			// console.log( "you clicked a the nav trigger!!!!!!! BLLLLEEEHHHHH!!!!!" );

			opui.nav.toggleNav();
		});

		$('body').hammer().on('tap', "#wrapper-navigation", function(e){
			e.preventDefault();
			opui.nav.toggleNav();
		});
	});
}(window.opui = window.opui || {}, jQuery, undefined));;(function(opui, $, undefined){

    /**
     *
     * @namespace normalize
     * @memberof opui
     */
    opui.normalize = {

        /**
         * Normalize nuggets from various sources
         * @function nuggets
         * @memberof! opui.normalize
         * @param {Array} nuggets collection of nugget items
         */
        nuggets: function(nuggets){
            if(!nuggets){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    nuggets = nuggets.data;
                    nuggets.forEach(function(nugget){
                        nugget.assignType = 'nugget';
                        nugget.assigned = true;
                        nugget.tags = nugget.metatags ? nugget.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                case 'ios':
                    nuggets = nuggets.nuggets;
                    nuggets.forEach(function(nugget){
                        nugget.assignType = 'nugget';
                        nugget.assigned = true;
                        nugget.image = opui.config.imgpath+nugget.image;
                        var t = nugget.metatags ? nugget.metatags.split('|') : [];
                        nugget.category = t[0];
                        var tags = [];
                        t.forEach(function(tag, i){
                            if(i > 0){
                                tags.push(tag);
                            }
                        });
                        nugget.tags = tags;
                    });
                    break;
                case 'bb10':
                case 'default':
                    nuggets.forEach(function(nugget){
                        nugget.assignType = 'nugget';
                        nugget.assigned = true;
                        nugget.image = opui.config.imgpath+nugget.image;
                        var t = nugget.metatags ? nugget.metatags.split('|') : [];
                        nugget.category = t[0];
                        var tags = [];
                        t.forEach(function(tag, i){
                            if(i > 0){
                                tags.push(tag);
                            }
                        });
                        nugget.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments','nugget', nuggets);
        },

        /**
         * Normalize courses from various sources
         * @function courses
         * @memberof! opui.normalize
         * @param {Array} courses collection of course items
         */
        courses: function(courses) {
            if(!courses){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    courses = courses.data;
                    courses.forEach(function(course){
                        course.assignType = 'course';
                        course.assigned = true;
                        course.tags = course.metatags ? course.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                case 'ios':
                    courses = courses.courses
                    courses.forEach(function (course) {
                        course.assignType = 'course';
                        course.assigned = true;
                        course.image = opui.config.imgpath + course.image;
                        var t = course.metatags ? course.metatags.split('|') : [];
                        course.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        course.tags = tags;
                    });
                    break;
                case 'bb10':
                case 'default':
                    courses.forEach(function (course) {
                        course.assignType = 'course';
                        course.assigned = true;
                        course.image = opui.config.imgpath + course.image;
                        var t = course.metatags ? course.metatags.split('|') : [];
                        course.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        course.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments', 'course', courses);
        },

        /**
         * Normalize scorm courses from various sources
         * @function scorm
         * @memberof! opui.normalize
         * @param {Array} courses collection of scorm course items
         */
        scorm: function(courses) {
            if(!courses){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    courses = courses.data;
                    courses.forEach(function(course){
                        course.assignType = 'course';
                        course.assigned = true;
                        course.tags = course.metatags ? course.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                case 'ios':
                    courses = courses.courses;
                    courses.forEach(function (course) {
                        course.assignType = 'scorm';
                        course.assigned = true;
                        course.image = opui.config.imgpath + course.image;
                        var t = course.metatags ? course.metatags.split('|') : [];
                        course.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        course.tags = tags;
                    });
                    break;
                case 'bb10':
                case 'default':
                    courses.forEach(function (course) {
                        course.assignType = 'scorm';
                        course.assigned = true;
                        course.image = opui.config.imgpath + course.image;
                        var t = course.metatags ? course.metatags.split('|') : [];
                        course.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        course.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments', 'scorm', courses);
        },

        /**
         * Normalize testsets from various sources
         * @function testsets
         * @memberof! opui.normalize
         * @param {Array} testsets collection of testset items
         */
        testsets: function(testsets) {
            if(!testsets){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    testsets = testsets.data;
                    testsets.forEach(function(testset){
                        testset.assignType = 'testset';
                        testset.assigned = true;
                        testset.tags = testset.metatags ? testset.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                case 'ios':
                    testsets = testsets.testsets;
                    testsets.forEach(function (testset) {
                        testset.assignType = 'testset';
                        testset.assigned = true;
                        testset.image = opui.config.imgpath + testset.image;
                        var t = testset.metatags ? testset.metatags.split('|') : [];
                        testset.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        testset.tags = tags;
                    });
                    break;

                case 'bb10':
                case 'default':
                    testsets.forEach(function (testset) {
                        testset.assignType = 'testset';
                        testset.assigned = true;
                        testset.image = opui.config.imgpath + testset.image;
                        var t = testset.metatags ? testset.metatags.split('|') : [];
                        testset.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        testset.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments', 'testset', testsets);
        },

        /**
         * Normalize activities from various sources
         * @function activities
         * @memberof! opui.normalize
         * @param {Array} activities collection of activity items
         */
        activities: function(activities) {
            if(!activities){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    activities = activities.data;
                    activities.forEach(function (activity) {
                        activity.assignType = 'activity';
                        activity.name = activity.activity_name;
                        activity.description = activity.activity_desc;
                        activity.status = activity.user_status;
                        activity.assigned = true;
                        activity.tags = activity.metatags ? activity.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                case 'ios':
                    activities = activities.activities;
                    activities.forEach(function (activity) {
                        activity.assignType = 'activity';
                        activity.name = activity.activity_name;
                        activity.description = activity.activity_desc;
                        activity.status = activity.user_activity_status;
                        activity.assigned = true;
                        activity.image = opui.config.imgpath + activity.image;
                        var t = activity.metatags ? activity.metatags.split('|') : [];
                        activity.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        activity.tags = tags;
                    });
                    break;
                case 'bb10':
                case 'default':
                    activities.forEach(function (activity) {
                        activity.assignType = 'activity';
                        activity.name = activity.activity_name;
                        activity.description = activity.activity_desc;
                        activity.status = activity.user_activity_status;
                        activity.assigned = true;
                        activity.image = opui.config.imgpath + activity.image;
                        var t = activity.metatags ? activity.metatags.split('|') : [];
                        activity.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        activity.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments', 'activity', activities);
        },

        /**
         * Normalize events from various sources
         * @function events
         * @memberof! opui.normalize
         * @param {Array} events collection of event items
         */
        events: function(events) {
            if(!events){
                return false;
            }
            var assigned = [];
            var unassigned = [];
            switch (opui.config.platform){
                case 'opux':
                    events = events.data;
                    events.forEach(function (event) {

                        event.image = opui.config.imgpath + event.image;
                        var t = event.metatags ? event.metatags.split('|') : [];
                        event.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        event.tags = tags;
                        if(event.assigned){
                            event.assignType = 'event';
                            assigned.push(event);
                        } else {
                            event.selectionType = 'event';
                            unassigned.push(event);
                        }
                    });
                    break;
                case 'portal':
                    events.forEach(function (event) {
                        event.assignType = 'event';
                        event.assigned = true;
                        event.image = opui.config.imgpath + event.image;
                        var t = event.metatags ? event.metatags.split('|') : [];
                        event.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        event.tags = tags;
                    });
                    break;
                case 'android':
                case 'ios':
                case 'bb10':
                case 'default':
                    break;
            }

            opui.store.setAssignments('assignments', 'event', assigned);
            opui.store.setAssignments('library', 'event', unassigned);
        },

        /**
         * Normalize skillprofiles from various sources
         * @function skillprofiles
         * @memberof! opui.normalize
         * @param {Array} skillprofiles collection of skillprofile items
         */
        skillprofiles: function(skillprofiles) {
            if(!skillprofiles){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    skillprofiles = skillprofiles.data;
                    skillprofiles.forEach(function (skillprofile) {
                        skillprofile.assignType = 'skillprofile';
                        skillprofile.assigned = true;
                        skillprofile.tags = skillprofile.metatags ? skillprofile.metatags.split('|') : [];
                    });
                    break;
                case 'android':
                    skillprofiles.forEach(function (skillprofile) {
                        skillprofile.assignType = 'skillprofile';
                        skillprofile.assigned = true;
                        skillprofile.image = opui.config.imgpath + skillprofile.image;
                        var t = skillprofile.metatags ? skillprofile.metatags.split('|') : [];
                        skillprofile.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        skillprofile.tags = tags;
                    });
                    break;
                case 'ios':
                    skillprofiles = skillprofiles.skillprofiles;
                    skillprofiles.forEach(function (skillprofile) {
                        skillprofile.assignType = 'skillprofile';
                        skillprofile.assigned = true;
                        skillprofile.image = opui.config.imgpath + skillprofile.image;
                        var t = skillprofile.metatags ? skillprofile.metatags.split('|') : [];
                        skillprofile.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        skillprofile.tags = tags;
                    });
                    break;
                case 'bb10':
                case 'default':
                    skillprofiles.forEach(function (skillprofile) {
                        skillprofile.assignType = 'skillprofile';
                        skillprofile.assigned = true;
                        skillprofile.image = opui.config.imgpath + skillprofile.image;
                        var t = skillprofile.metatags ? skillprofile.metatags.split('|') : [];
                        skillprofile.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        skillprofile.tags = tags;
                    });
                    break;
            }

            opui.store.setAssignments('assignments', 'skillprofile', skillprofiles);
        },

        /**
         * Normalize curricula from various sources
         * @function curricula
         * @memberof! opui.normalize
         * @param {Array} curricula collection of curriculum items
         */
        curricula: function(curricula) {
            if(!curricula){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    curricula = curricula.data;
                    var assigned = [];
                    var unassigned = [];
                    curricula.forEach(function (curriculum) {
                        curriculum.tags = curriculum.metatags ? curriculum.metatags.split('|') : [];
                        if(curriculum.assigned){
                            curriculum.assignType = 'curriculum';
                            assigned.push(curriculum);
                        } else {
                            curriculum.selectionType = 'curriculum';
                            unassigned.push(curriculum);
                        }
                    });
                    opui.store.setAssignments('assignments', 'curriculum', assigned);
                    opui.store.setAssignments('library', 'curriculum', unassigned);
                    break;
                case 'android':
                    curricula.forEach(function (curriculum) {
                        curriculum.assignType = 'curriculum';
                        curriculum.assigned = true;
                        curriculum.image = opui.config.imgpath + curriculum.image;
                        var t = curriculum.metatags ? curriculum.metatags.split('|') : [];
                        curriculum.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        curriculum.tags = tags;
                    });
                    opui.store.setAssignments('assignments', 'curriculum', curricula);
                    break;
                case 'ios':
                    curricula = curricula.curricula;
                    curricula.forEach(function (curriculum) {
                        curriculum.assignType = 'curriculum';
                        curriculum.assigned = true;
                        curriculum.image = opui.config.imgpath + curriculum.image;
                        var t = curriculum.metatags ? curriculum.metatags.split('|') : [];
                        curriculum.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        curriculum.tags = tags;
                    });
                    opui.store.setAssignments('assignments', 'curriculum', curricula);
                    break;
                case 'bb10':
                case 'default':
                    curricula.forEach(function (curriculum) {
                        curriculum.assignType = 'curriculum';
                        curriculum.assigned = true;
                        curriculum.image = opui.config.imgpath + curriculum.image;
                        var t = curriculum.metatags ? curriculum.metatags.split('|') : [];
                        curriculum.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        curriculum.tags = tags;
                    });
                    opui.store.setAssignments('assignments', 'curriculum', curricula);
                    break;
            }


        },

        /**
         * Normalize game info from various sources
         * @function games
         * @memberof! opui.normalize
         * @param {Object} gameObject Object containing game profile and game list
         */
        games: function(gameObject){
            if(!gameObject){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    if(gameObject.name && gameObject.name === 'gamelist'){
                        opui.store.setStore('games', 'game', 'game_id', gameObject.data);
                    }
                    if(gameObject.name && gameObject.name === 'gameprofile'){
                        opui.store.setItem('profile', gameObject.data[0]);
                    }

                    break;
                case 'android':
                    var d = gameObject;
                    d.profile.avatar = opui.config.imgpath + 'gravatar' + d.profile.user_id + "?" + d.profile.avatar_hash;
                    for (var i = 0; i < d.games.length; i++) {
                        for (var n = 0; n < d.games[i].badges.length; n++) {
                            if (opui.config.platform === 'ios') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            } else if (opui.config.platform === 'android') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + 'badge' + d.games[i].badges[n].badge_id;
                            } else {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            }
                        }
                    }

                    opui.store.setStore('games', 'game', 'game_id', d.games);
                    opui.store.setItem('profile', d.profile);
                    break;
                case 'ios':
                    var d = gameObject;
                    d.profile.avatar = opui.config.imgpath + d.profile.avatar;
                    for (var i = 0; i < d.games.length; i++) {
                        for (var n = 0; n < d.games[i].badges.length; n++) {
                            if (opui.config.platform === 'ios') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            } else if (opui.config.platform === 'android') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + 'badge' + d.games[i].badges[n].badge_id;
                            } else {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            }
                        }
                    }

                    opui.store.setStore('games', 'game', 'game_id', d.games);
                    opui.store.setItem('profile', d.profile);
                    break;
                case 'bb10':
                case 'default':
                    var d = gameObject;
                    if (opui.config.platform === 'android') {
                        d.profile.avatar = opui.config.imgpath + 'gravatar' + d.profile.user_id + "?" + d.profile.avatar_hash;
                    } else {
                        d.profile.avatar = opui.config.imgpath + d.profile.avatar;
                    }
                    for (var i = 0; i < d.games.length; i++) {
                        for (var n = 0; n < d.games[i].badges.length; n++) {
                            if (opui.config.platform === 'ios') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            } else if (opui.config.platform === 'android') {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + 'badge' + d.games[i].badges[n].badge_id;
                            } else {
                                d.games[i].badges[n].badge_file = opui.config.imgpath + d.games[i].badges[n].badge_file;
                            }
                        }
                    }

                    opui.store.setStore('games', 'game', 'game_id', d.games);
                    opui.store.setItem('profile', d.profile);
                    break;
            }
        },

        /**
         * Normalize library items from various sources
         * @function library
         * @memberof! opui.normalize
         * @param {Object} data Object containing sections of content items
         */
        library: function(data){
            if(!data){
                return false;
            }
            if(opui.config.platform !== 'portal'){
                var courses = [];
                data.courses.forEach(function(course){
                    course.selectionType = "course";
                    var t = course.metatags ? course.metatags.split('|') : [];
                    course.category = t[0];
                    var tags = [];
                    t.forEach(function (tag, i) {
                        if (i > 0) {
                            tags.push(tag);
                        }
                    });
                    course.tags = tags;
                    courses.push(course);
                });
                opui.store.setAssignments('library', 'course', courses);

                var nuggets = [];
                data.nuggets.forEach(function(nugget){
                    nugget.selectionType = "nugget";
                    var t = nugget.metatags ? nugget.metatags.split('|') : [];
                    nugget.category = t[0];
                    var tags = [];
                    t.forEach(function (tag, i) {
                        if (i > 0) {
                            tags.push(tag);
                        }
                    });
                    nugget.tags = tags;
                    nuggets.push(nugget)
                });
                opui.store.setAssignments('library', 'nugget', nuggets);

                var testsets = [];
                data.testsets.forEach(function(testset){
                    testset.selectionType = "testset";
                    var t = testset.metatags ? testset.metatags.split('|') : [];
                    testset.category = t[0];
                    var tags = [];
                    t.forEach(function (tag, i) {
                        if (i > 0) {
                            tags.push(tag);
                        }
                    });
                    testset.tags = tags;
                    testsets.push(testset)
                });
                opui.store.setAssignments('library', 'testset', testsets);

                var skillprofiles = [];
                data.skillprofiles.forEach(function(skillprofile){
                    if(skillprofile.type != 'curriculum'){
                        skillprofile.selectionType = "skillprofile";
                        var t = skillprofile.metatags ? skillprofile.metatags.split('|') : [];
                        skillprofile.category = t[0];
                        var tags = [];
                        t.forEach(function (tag, i) {
                            if (i > 0) {
                                tags.push(tag);
                            }
                        });
                        skillprofile.tags = tags;
                        skillprofiles.push(skillprofile)
                    }
                });
                opui.store.setAssignments('library', 'skillprofile', skillprofiles);
            }
        },

        hierarchy: function(data){
            if(!data){
                return false;
            }
            var nodes = data.data;
            nodes.forEach(function(node){
                opui.hierarchy.flattenNodes(node);
                opui.hierarchy.nodesArray.sort(function(a,b){
                    if (a.node_id < b.node_id){
                        return -1;
                    }
                    if (a.node_id > b.node_id){
                        return 1;
                    }
                    return 0;
                });
                opui.store.setStore('nodes', 'node', 'node_id', opui.hierarchy.nodesArray);
            });
        },

        announcements: function(data){
            if(!data){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    opui.store.setStore('announcements', 'announcement', 'id', data.data);
                    break;
                case 'android':
                case 'ios':
                    opui.store.setStore('announcements', 'announcement', 'id', data.messages);
                    break;
                case 'bb10':
                case 'default':
                    opui.store.setStore('announcements', 'announcement', 'id', data.messages);
                    break;
            }
        },

        notifications: function(data){
            if(!data){
                return false;
            }

            switch (opui.config.platform){
                case 'opux':
                    opui.store.setStore('notifications', 'notification', 'id', data.data);
                    break;
                case 'android':
                case 'ios':
                    opui.store.setStore('notifications', 'notification', 'id', data.messages);
                    break;
                case 'bb10':
                case 'default':
                    opui.store.setStore('notifications', 'notification', 'id', data.messages);
                    break;
            }
        },

        environment: function(data){
            if(!data){
                return false;
            }

            switch(opui.config.platform){
                case 'opux':
                    opui.console.log('ENVIRONMENT DATA', data);
                    opui.store.clearOtherUserData(data.data[0].user_id.toString());
                    opui.store.setSecureID(data.data[0].user_id.toString());
                    opui.store.setItem('environment', data.data[0]);
                    break;
                case 'android':
                case 'ios':
                    opui.store.clearOtherUserData(data.user_id.toString());
                    opui.store.setSecureID(data.user_id.toString());
                    opui.store.setItem('environment', data);
                    break;
                case 'bb10':
                case 'default':
                    opui.store.clearOtherUserData(data.user_id.toString());
                    opui.store.setSecureID(data.user_id.toString());
                    opui.store.setItem('environment', data);
                    break;
            }
        }

    };

}(window.opui = window.opui || {}, jQuery, undefined));;/**
 * OPUI Offline Module
 * For managing offline data for use in Development
 * Author: Joshua Brown, OnPoint Digital, Inc.
 */
(function (opui, $, undefined){

    /**
     * @namespace offline
     * @memberof opui
     */
    opui.offline = {

        /**
         * Method for capturing and downloading data for offline use in development only!
         * @function download
         * @memberof! opui.offline
         * @param filename Name of JSON file for download
         * @param data For this argument, pass in the entire localStorage
         */
        download: function(data, filename){

            if(!data) {
                console.error('Console.save: No data')
                return;
            }

            if(!filename) filename = 'console.json'

            if(typeof data === "object"){
                data = JSON.stringify(data, undefined, 4)
            }

            var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        },

        /**
         * Method for loading captured JSON into localStorage; file must be present in package root
         * @function load
         * @memberof! opui.offline
         * @param {String} filename Name of file
         */
        load: function(filename){
            var fileName = filename ? filename : 'offline.json';
            $.ajax({
                url: fileName,
                dataType: 'json'
            }).done(function(data){
                if(!data){
                    console.error('Offline: No data to load');
                    return;
                }
                if(Object.keys(data).length < 1) {
                    console.error('Offline: No data to load');
                    return;
                }
                localStorage.clear();
                Object.keys(data).forEach(function(key){
                    var newKey = key.split('|');
                    newKey[0] = 'offline';
                    newKey = newKey.join('|');
					//opui.console.log(data[key]);
                    localStorage.setItem(newKey, data[key]);
                });
            }).fail(function(e){
                console.error('Offline: ' + e.statusText);
            });
        },

        init: function(){
            opui.console.log('Module Initialized: Offline');
        }
    }

}(window.opui = window.opui || {}, jQuery, undefined));;/**
 * Render methods
 *
 * Copyright (c) 2002-2013, OnPoint Digital, Inc. All rights reserved
 *
 * Created By: Josh Brown & Matt Black
 * Modfied for OPUI framework: James Whitwell
 *
 * Date: 29/04/13
 */



(function (opui, $, undefined) {

    /**
     * Render
     * @param collection
     * @param target
     * @param settings
     */
    function render(collection, target, settings) {
        //opui.console.log('Collection: ');
        opui.console.log(collection);

        //opui.console.log('Target: ');
        opui.console.log(target);

        //opui.console.log('Settings: ');
        opui.console.log(settings);

        var t;
        if (settings.template) {
            t = Handlebars.compile($(settings.template).html());
        } else {
            if(settings['templateCompiled']){
                t = settings['templateCompiled'];
            } else {
                t = Handlebars.compile($(target).html());
                $(target).data('templateCompiled', t);
            }
        }

        $(target).html('');

        $(target).html(t(collection));
        if(!$(target).is(':visible')){
        	$(target).fadeIn();
        }
    }

    opui.render = {
        init: function(){
            opui.console.log('Module initialized: Render');
            opui.events.installTo(opui.render);



        }
    };


    (function ($) {

        /**
         * The jQuery plugin namespace.
         * @external "jQuery.fn"
         * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
         */

        /**
         * Render items inside of configured HTML elements
         * @function external:"jQuery.fn".render
         * @param {Object} override Settings object for overriding options set as data- attributes on HTML element
         * @return {*}
         */
        $.fn.render = function (override) {
            opui.console.log('Render items running');

            var defaults;
            

            return this.each(function () {
                var $this = $(this);

                var options = override ? override : $this.data();
                var settings = $.extend(defaults, options);
                var collection = opui.tools.process(settings);
                // opui.console.log(collection)
                collection = opui.tools.filter(settings, collection);
                if (collection === null || collection.length < 1) {
                    opui.console.log('collection is null');
                    return true;
                }
                collection = opui.tools.sorting(settings, collection);
                render(collection, $this, settings);

            });

        };

    }(jQuery));

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

	opui.data = {
		request : function (request) {
			var parsedRequest = $.parseJSON(request);
			opui.console.log("data Request method: ["+parsedRequest.name+"]");
			var def = $.Deferred(function(dfd){

				if(opui.config.platform === 'ios'){
					if(parsedRequest.file){
						$.ajax({
							url: opui.config.jsonpath+parsedRequest.file,
							dataType: 'json',
							async: true,
							success: function(data){
								//opui.console.log("Courses Successful");
								window[parsedRequest.name].model = data;
								dfd.resolve(data);
							},
							timeout: 3000
						});
					} else {
						window.location = parsedRequest.scurl+'/'+parsedRequest.name+'.request.resolve';
					}
				}
				opui.console.log("opui.config.platform = " + opui.config.platform);
				if(opui.config.platform === 'android'){
					window[parsedRequest.name].model = $.parseJSON(CellCast.scurl(parsedRequest.scurl));
					dfd.resolve(window[parsedRequest.name].model);
				}
				if(opui.config.platform === 'android_blackberry'){
					window[parsedRequest.name].model = $.parseJSON(prompt(parsedRequest.scurl));
					dfd.resolve();
				}
				if(opui.config.platform === 'opair'){
					window[parsedRequest.name].model = $.parseJSON(window.scurl(parsedRequest.scurl));
						dfd.resolve();
				}
				if(opui.config.platform === 'bb10'){
					// window[request.name].dfd = dfd;
					navigator.cascades.postMessage(request, window.location.origin);
				}
				if(opui.config.platform === 'portal'){
					$.ajax({
						url: '/juix/'+parsedRequest.name,
						dataType: 'json',
						async: true,
						success: function (data){
							window[parsedRequest.name].model = data;
							dfd.resolve(data);
						},
						error: function (jqXHR, textStatus, errorThrown) {
							window[parsedRequest.name].model = null;
							dfd.resolve();
						}
					});
				}

				if(opui.config.platform === 'opux'){
					$.ajax({
						url: '/opux/api/'+parsedRequest.opuxTarget,
						dataType: 'json',
						async: true,
						success: function(data){
							window[parsedRequest.name].model = data;
							dfd.resolve(data);
						},
						error: function (jqXHR, textStatus, errorThrown){
							window[parsedRequest.name].model = null;
							dfd.resolve();
						}
					});
				}
			});
			return def;
		},

		/**
		 *
		 * @param $text
		 * @returns {string|XML|*}
		 */
		preProcess: function($text){
			// Damn pesky carriage returns...
			$text = $text.replace("\r\n", "<br>");
			$text = $text.replace("\r", "<br>");

			// JSON requires new line characters be escaped
			//$text = str_replace("\n", "\\n", $text);
			return $text;
		},

		/**
		 *
		 * @param payload
		 */
		processReturn: function(payload){
			var payload = opui.data.preProcess(payload);
			opui.console.log(payload);
			try {
				opui.console.log('trying to parse json');
				payload = $.parseJSON(payload);
				opui.console.log('parse successful for ['+payload.name+']');
				if(!$.isEmptyObject(payload.data)){
					opui.console.log('saving payload data to model');
					window[payload.name].model = payload.data;
					opui.console.log('resolving');
					window[payload.name].request.resolve(payload.data);
				} else {
					opui.console.log('saving model as empty');
					if(payload.name === 'skillprofiles'){
						window[payload.name].model = [];
						opui.console.log('resolving with no data');
						window[name].request.resolve();
					} else {
						window[payload.name].model = {};
						opui.console.log('resolving with no data');
						window[name].request.resolve();
					}
				}

			} catch (err) {
				opui.console.log('parse UNsuccessful');
				opui.console.log(err.message);
				opui.console.log('getting name of return');
				var name = payload.split('"')[3];
				opui.console.log('saving model for ['+name+'] as empty');
				if(name === 'skillprofiles'){
					window[name].model = [];
				} else {
					window[name].model = {};
				}
				opui.console.log('resolving with no data');
				window[name].request.resolve();
				return;
			}
			opui.console.log('resolving');
			window[payload.name].request.resolve();
		},

		getData: function (name, file, scurl, opuxTarget, featureCheck){
			//TODO: Decide what happens to the data call when the feature is not configured in the package
			if(!featureCheck){
				var def = $.Deferred();
				def.resolve(null);
				return def;
			} else {
				window[name] = {model:{}};
				window[name].request = opui.data.request('{"name":"'+name+'", "file":"'+file+'", "scurl":"'+scurl+'", "opuxTarget":"'+opuxTarget+'"}');
				return window[name].request;
			}
		},

		/**
		 * 
		 */
		initialRequests: function(){
			window['opuiReady'] = $.Deferred();
			$.when(
				opui.data.getData('environment', 'environment.json', 'cellcast://data/environment', 'section/environment', true)
					.done(function(data){
						opui.normalize.environment(data);
					})
			).then(function(){
				$.when(
					opui.data.getData('nuggets', 'nugget_assignments.json', 'cellcast://data/nuggets', 'section/nuggets', true)
						.done(function(data){
							opui.normalize.nuggets(data);
						}),
					opui.data.getData('courses', 'course_assignments.json', 'cellcast://data/courses', 'section/courses', true)
						.done(function(data){
							opui.normalize.courses(data);
						}),
					opui.data.getData('assessments', 'testset_assignments.json', 'cellcast://data/testsets', 'section/testsets', true)
						.done(function(data){
							opui.normalize.testsets(data);
						}),
					opui.data.getData('scorm', 'scorm_courses.json', 'cellcast://data/scorm', 'section/scorm_courses', true)
						.done(function(data){
							opui.normalize.scorm(data);
						}),
					opui.data.getData('skillprofiles', 'skillprofiles.json', 'cellcast://data/skillprofiles', 'section/skillprofiles', true)
						.done(function(data){
							opui.normalize.skillprofiles(data);
						}),
					opui.data.getData('curricula', 'curricula.json', 'cellcast://data/curricula', 'section/curricula', opui.config.features.curricula)
						.done(function(data){
							opui.normalize.curricula(data);
						}),
					opui.data.getData('activities', 'activity_assignments.json', 'cellcast://data/activities', 'section/activities', true)
						.done(function(data){
							opui.normalize.activities(data);
						}),
					opui.data.getData('events', 'events.json', 'cellcast://data/events', 'event/list', (opui.config.platform === 'opux' && opui.config.features.events))
						.done(function(data){
							opui.normalize.events(data);
						}),
					opui.data.getData('announcements', 'announcements.json', 'cellcast://data/announcements', 'section/announcements', true)
						.done(function(data){
							opui.normalize.announcements(data);
						}),
					opui.data.getData('notifications', 'notifications.json', 'cellcast://data/notifications', 'section/notifications/all', true)
						.done(function(data){
							opui.normalize.notifications(data);
						}),
					opui.data.getData('games', '', 'cellcast://data/games', '', (opui.config.features.gamification && opui.config.platform !== 'opux'))
						.done(function(data){
							opui.normalize.games(data);
						}),
					opui.data.getData('games', '', 'cellcast://data/games', 'gamelist', (opui.config.features.gamification && opui.config.platform === 'opux'))
						.done(function(data){
							opui.normalize.games(data);
						}),
					opui.data.getData('games', '', 'cellcast://data/games', 'gameprofile', (opui.config.features.gamification && opui.config.platform === 'opux'))
						.done(function(data){
							opui.normalize.games(data);
						}),
					opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
						.done(function(data){
							opui.normalize.library(data);
						}),
					opui.data.getData('hierarchy', 'hierarchy.json', 'cellcast://data/hierarchies', 'hierarchy', opui.config.features.hierarchy)
						.done(function(data){
							opui.normalize.hierarchy(data);
						})
				).then(function(){
					opuiReady.resolve();
					opui.console.log('ALL DATA HAS BEEN RETURNED');
					opui.data.publish('refresh', {});
				});
			});
            return opuiReady;
		},
		/**
		 * Method for requesting the minimum set of new data based on type (type plus library at the moment)
		 * @method typeRequests
		 * @param type nugget|course|scorm|testset|event|activity|skillprofile
		 * @returns promise
		 */
		typeRequests: function(type){
            //console.log("typeRequests",type);
			var def = $.Deferred();
			switch(type){
				case 'nugget':
					$.when(
						opui.data.getData('nuggets', 'nugget_assignments.json', 'cellcast://data/nuggets', 'section/nuggets', true)
							.done(function(data){
								opui.normalize.nuggets(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and Library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'course':
					$.when(
						opui.data.getData('courses', 'course_assignments.json', 'cellcast://data/courses', 'section/courses', true)
							.done(function(data){
								opui.normalize.courses(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'scorm':
					$.when(
						opui.data.getData('scorm', 'scorm_courses.json', 'cellcast://data/scorm', 'section/scorm_courses', true)
							.done(function(data){
								opui.normalize.scorm(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'testset':
					$.when(
						opui.data.getData('assessments', 'testset_assignments.json', 'cellcast://data/testsets', 'section/testsets', true)
							.done(function(data){
								opui.normalize.testsets(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'skillprofile':
					$.when(
						opui.data.getData('skillprofiles', 'skillprofiles.json', 'cellcast://data/skillprofiles', 'section/skillprofiles', true)
							.done(function(data){
								opui.normalize.skillprofiles(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'curriculum':
					$.when(
						opui.data.getData('curricula', 'curricula.json', 'cellcast://data/curricula', 'section/curricula', opui.config.features.curricula)
							.done(function(data){
								opui.normalize.curricula(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'activity':
					$.when(
						opui.data.getData('activities', 'activity_assignments.json', 'cellcast://data/activities', 'section/activities', true)
							.done(function(data){
								opui.normalize.activities(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
				case 'event':
					$.when(
						opui.data.getData('events', 'events.json', 'cellcast://data/events', 'event/list', opui.config.platform === 'opux')
							.done(function(data){
								opui.normalize.events(data);
							}),
						opui.data.getData('library', '', 'cellcast://data/library', 'library', (opui.config.features.search))
							.done(function(data){
								opui.normalize.library(data);
							})
					).then(function(){
						def.resolve();
						opui.console.log('typeRequests: '+type+' and library returned');
                        opui.data.publish('refresh', {});
					});
					break;
			}
			return def;
		},
        
        init: function(){
			opui.events.installTo(opui.data);
			opui.console.log('Module initialized: Data');
            
		}
	};

}(window.opui = window.opui || {}, jQuery, undefined));;(function(opui, $, riot, undefined){

    /**
     * Route management
     * @namespace routes
     * @memberof opui
     */
    opui.router = {

        routes: [],

        to: function(url, params){
            history.pushState({params:params}, 'title', '#'+url);
        },

        init: function(){
            opui.events.installTo(opui.router);
            opui.console.log('Module initialized: Routes');

            riot.route.parser(function(path) {
                var raw = path.split('?'),
                    uri = raw[0],
                    qs = raw[1],
                    params = {};

                if (qs) {
                    qs.split('&').forEach(function(v) {
                        var c = v.split('=');
                        params[decodeURIComponent(c[0])] = decodeURIComponent(c[1]);
                    });
                }

                //opui.console.log([uri, params]);
                return [uri, params, path];
            });

            riot.route(function(url, params, path){
                //opui.console.log(url);
                //opui.console.log(params);
                opui.router.routes.push({
                    url:url,
                    params:params,
                    path:path
                });
                opui.events.publish('page:change', {
                    url:url,
                    params:params,
                    path:path
                })
            });

        }
    };

}(window.opui = window.opui || {}, jQuery, riot, undefined));;(function(opui, $, undefined){
    //TODO: Write handler for scurls when running in OPUX mode.
    //TODO: Decide what to


    /**
     *
     * @namespace scurl
     * @memberof opui
     */
    opui.scurl = (function(){


        return {
            run: function(scurl){
                console.log('SCURL TO RUN', scurl);

                //Menu SCURLS
                if(scurl.indexOf('cellcast://menu') > -1){
                    switch (scurl){
                        case 'cellcast://menu/forums':

                    }
                }

                //Action SCURLS
                else if(scurl.indexOf('cellcast://action') > -1){
                    switch (scurl){
                        case 'cellcast://action/logout':
                            var general_logoutrusure2 = "Are you sure you want to logout?";
                            var ans = confirm(general_logoutrusure2);
                            opui.console.log(ans);
                            if (ans) {
                                opui.console.log('change location');
                                setTimeout(function(){
                                    window.location = "/opportal/logout.do";
                                }, 0);
                            }
                            else {
                                return false;
                            }
                            break;
                        case 'cellcast://action/sync':
                            opui.data.initialRequests();
                            break;
                        case 'cellcast://action/openapp/opcv/opcv_certificates':
                            window.open('/opux/viewer/certificates','OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/opcv_courses':
                            window.open('/opux/viewer/courses', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/opcv_catalog':
                            window.open('/opux/viewer/courses/catalog', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/event_calendar':
                            window.open('/opux/viewer/events/calendar', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/event_catalog':
                            window.open('/opux/viewer/events/catalog', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/nuggets':
                            window.open('/opux/viewer/nuggets', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/nugget_catalog':
                            window.open('/opux/viewer/nuggets/catalog', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/mystatus':
                            window.open('/opux/viewer/status', 'OPLS');
                            break;
                        case 'cellcast://action/openapp/opcv/testsets_catalog':
                            window.open('/opux/viewer/testsets/catalog', 'OPLS');
                            break;
                    }
                }

                // Assume all non-'action' and non-'menu' scurls are Launch SCURLS
                else {
                    var parts = scurl.substring('cellcast://'.length).split('/');
                    var type = parts[0];
                    var id = parts[1];
                    var skip = parts[2];
                    var destination = parts[3];

                    if(opui.config && opui.config.launch_target === 'opcv'){
                        // Launch using normal portal method
                        var url='/opportal/CustomUiLauncher?type='+type+'&id='+id; //target: course|nugget|testset|etc
                        window.open(url, "opls", "height=750, width=1000, scrollbars=yes, resizable=yes, toolbar=no, minimize=no, menubar=no, status=yes");
                    } else {
                        // Launch using OPMCV
                        riot.route('/opmcv/'+type+'?id='+id+'&external');
                    }
                }

            },

            init: function(){

            }
        };
    }());


}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

opui.search = {

	queryName: function(collection, query) {
		return (collection.filter(function(element, index, array){
			if(element.assignType === 'activity' || element.selectionType === 'activity'){
				console.log(element);
				return (element.activity_name.toLowerCase().search(query) != -1)
			} else {
				return (element.name.toLowerCase().search(query) != -1)
			}
		}));
	},


	queryTags: function(collection, query){
		return(collection.filter(function(element, index, array){
			return (element.metatags.toLowerCase().search(query) != -1)
		}));
	},

	queryDescription: function(collection, query) {
		return (collection.filter(function(element, index, array){
			if(element.assignType === 'activity' || element.selectionType === 'activity'){
				return (element.activity_desc.toLowerCase().search(query) != -1)
			} else {
				return (element.description.toLowerCase().search(query) != -1)
			}
		}));
	},

	containsObject: function(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].id === obj.id) {
	            return true;
	        }
	    }
	    return false;
	},

	processQuery: function(query){
		var query = query.toLowerCase();
		// var re = /\W/g;
		var re = /\s*(\s|,|=>)\s*/g;
		var q = [];
		q.push(query);
		query.split(re).forEach(function(e,i,a){
			q.push(e)
		});
		q = $.grep(q, function(e){
			return (e != 'and' && e != 'or' && e != '' && e != ',' && e != ' ');
		});
		q = $.unique(q);
		return(q)	
	},

	addOrRank: function(staged, results){
		staged.forEach(function(e,i,a){
			if(!e.rank){
				e.rank = 1;
			}
			if(opui.search.containsObject(e, results)){
				e.rank++ 
			} else {
				results.push(e);
			}
		});
		return results;
	},

	sortByRank: function(collection){
		return (collection.sort(function(a,b){
				var rankA = a.rank, rankB = b.rank;
				if(rankA > rankB) //sort string descending
					return -1;
				if (rankA < rankB)
					return 1;
				return 0; //default return value (no sorting)
		}))
	},

	term: function(collection, query){
		var set;
		if(collection == 'assignments'){
			set = opui.store.getStore('assignments');
		}
		if(collection == 'catalog'){
			set = opui.store.getStore('assignments').concat(opui.store.getStore('library'));
		}
		if(collection == 'library'){
			set = opui.store.getStore('library');
		}
		if(query === '' || query === 'all'){
			set = opui.tools.sortName(set);
			return set;
		}
		if(collection === 'single-items'){
			var set = opui.store.getStore('assignments').concat(opui.store.getStore('library')).filter(function(item){
				return ((item.assignType && item.assignType != 'skillprofile') || (item.selectionType && item.selectionType != 'skillprofile'));
			});
		}
		var q = opui.search.processQuery(query);
		opui.console.log(q);
		var results = [];
		for (var i=0; i < q.length; i++){
			opui.console.log(q[i]);
			opui.console.log(results);
			results = opui.search.addOrRank(opui.search.queryName(set, q[i]), results);
			results = opui.search.addOrRank(opui.search.queryTags(set, q[i]), results);
			results = opui.search.addOrRank(opui.search.queryDescription(set, q[i]), results);
		}
		results = opui.search.sortByRank(results);
		return results;
	},

	tags: function(collection, query){
		var results;
		if(typeof(query) == 'string'){
			var q = [query];
			results = opui.tools.queryByTags(collection, q, 'inclusive');
			return results;
		} else {
			results = opui.tools.queryByTags(collection, query, 'inclusive');
			return results;
		}
	},

	category: function(collection, query){
		return opui.tools.queryByCategory(collection, query);
	},

	init: function(){
		opui.console.log('Module Initialized: Search');
	}

};

}(window.opui = window.opui || {}, jQuery, undefined));;/**
 * @namespace opui
 */
(function (opui, $, undefined){

    /**
     * @namespace store
     * @memberof opui
     */
    opui.store = (function(){
        //TODO create method for retrieving single non-content item from localstorage

        /**
         * @member stores
         * @memberof opui.store
         */
        var stores = ['assignments', 'library', 'announcements', 'notifications', 'games', 'hierarchy', 'environment'];

        var secureID = 'offline';

        return {

            /**
             * Create a store specifically of assigned objects
             * @function setAssignments
             * @memberof! opui.store
             * @returns {Boolean} Successful or not
             * @param {String} collection Name of stored collection
             * @param {Array | String} data Array of items to be stored
             * @example
             * opui.store.setStore('catalog', [*catalog items*]) //returns true|false
             */
            setAssignments: function(collection, type, data){
                opui.console.log('SETTING STORE:', collection)
                if(!data){
                    opui.console.log('store data is undefined');
                    return true;
                }
                opui.store.clearType(collection, type);
                //console.log ("setAssignments: ",type)
                data.forEach(function(item){
                    item.store = collection;
                    var t = secureID + '|' + (item.assignType?item.assignType:item.selectionType) + item.id;
                    localStorage.setItem(t, JSON.stringify(item));
                    //console.log ("setAssignments data: ",t);
                });
                opui.events.publish('update:store', collection);
                return true;
            },

            /**
             * Create a store for a generic collection of items
             * @function setStore
             * @memberof! opui.store
             * @returns {Boolean} Successful or not
             * @param {String} collectionName Name of stored collection
             * @param {String} instanceName Name of stored item
             * @param {String} idProp Property name of id value
             * @param {Array | String} data Array of items to be stored
             * @example
             * opui.store.setStore('games', 'game', 'game_id', [*games list*]) //returns true|false
             */
            setStore: function(collectionName, instanceName, idProp, data){
                opui.console.log('setting store ['+collectionName+']', data)
                opui.store.clearStore(collectionName);
                data.forEach(function(item){
                    item.store = collectionName;
                    var t = secureID + '|' + instanceName + item[idProp];
                    localStorage.setItem(t, JSON.stringify(item));
                });
                opui.events.publish('update:store', collectionName);
                return true;
            },

            /**
             * Sync new with old assignment data
             * @function syncAssignments
             * @memberof! opui.store
             * @param collection assignments | library | catalog
             * @param newData array of new items
             */
            syncAssignments: function(collection, newData){
                //determine which items should be removed
                //by comparing existing keys to new keys
                var oldItems = _.map(opui.store.getStore(collection), function(item){
                    return secureID + '|' + (item.assignType ? item.assignType : item.selectionType) + item.id;
                });
                var newItems = _.map(newData, function(item){
                    return secureID + '|' + (item.assignType ? item.assignType : item.selectionType) + item.id;
                });
                //get difference between arrays and remove items with the returned keys
                var clearItems = _.difference(oldItems, newItems);

                opui.store.setAssignments(collection, newData);
                clearItems.forEach(function(key){
                    localStorage.removeItem(key);
                });
            },

            /**
             * Delete store items
             * @function clearStore
             * @memberof! opui.store
             * @param storeName
             */
            clearStore: function(storeName){
                Object.keys(localStorage).forEach(function(key){
                    if(localStorage.hasOwnProperty(key) && localStorage[key] !== 'undefined'){
                        var item = JSON.parse(localStorage[key]);
                        if(item && item.store === storeName){
                            localStorage.removeItem(key);
                        }
                    }

                });
            },

            /**
             * Delete all items of type
             * @function clearType
             * @memberof! opui.store
             * @param type
             */
            clearType: function(store, type){
                Object.keys(localStorage).forEach(function(key){
                    if(key.indexOf(type) != -1){
                        var item = JSON.parse(localStorage[key]);
                        if(item && item.store === store){
                            opui.console.log('Type ['+type+'] and Store ['+store+'] match: deleting from storage');
                            localStorage.removeItem(key);
                        }
                    }
                });
            },

            /**
             * Delete all library items
             * @function clearLibrary
             * @memberof! opui.store
             */
            clearLibrary: function(){
                Object.keys(localStorage).forEach(function(key){
                    var item = JSON.parse(localStorage[key]);
                    if(item && item.store === 'library'){
                        localStorage.removeItem(key);
                    }
                });
            },

            /**
             * Delete single items from storage
             * @function clearItem
             * @memberof! opui.store
             */
            clearItem: function(key){
                localStorage.removeItem(secureID + '|' + key);
            },

            /**
             * Remove stored items from other users
             * @function clearOtherUserData
             * @memberof! opui.store
             * @param id user id of current user
             */
            clearOtherUserData: function(id){
                Object.keys(localStorage).forEach(function(key){
                    if(key.indexOf(id) < 0){
                        localStorage.removeItem(key);
                    }
                });
            },

            /**
             * Create a store for a single item
             * @function setItem
             * @memberof! opui.store
             * @returns {boolean} Successful or not
             * @param {String} key Name of stored item
             * @param {Array | String} data Data to be stored
             * @example
             * opui.store.setItem('profile', {*user profile data*}) //returns true|false
             */
            setItem: function(key, data){
                //console.log('Setting ['+key+'] ', data);
                opui.store.clearItem(key);
                localStorage.removeItem(secureID + '|' + key);
                localStorage.setItem(secureID + '|' + key, JSON.stringify(data));
                opui.events.publish('update:store', key);
                return true;
            },

            setSecureID: function(id){
                secureID = id;
            },

            checkSecureID: function(){
                return secureID;
            },

            /**
             * Get an individual piece of content
             * @function getContent
             * @memberof! opui.store
             * @returns {Object} Matching item or Null if not found
             * @param {String} type course|nugget|testset|activity|skillprofile
             * @param {Number} id ID of matching item
             */
            getContent: function(type, id){
                if (localStorage.hasOwnProperty(secureID + '|' + type + id)){
                    return JSON.parse(localStorage.getItem(secureID + '|' + type + id));
                } else {
                    return null;
                }
            },

            /**
             * Set an individual piece of content
             * @function setContent
             * @memberof! opui.store
             * @returns {Object} Matching item
             * @param {String} type course|nugget|testset|activity|skillprofile
             * @param {Number} id ID of matching item
             * @param {Object} data New content data
             */
            setContent: function(type, id, data){
                return JSON.parse(localStorage.setItem(secureID + '|' + type + id, data));
            },

            /**
             * Get an individual item
             * @function getItem
             * @memberof! opui.store
             * @returns {Object} Mathing item
             * @param {String} key item key
             */
            getItem: function(key){
                return JSON.parse(localStorage.getItem(secureID + '|' + key));
            },

            /**
             * Get all items from a specified stored collection
             * @function getStore
             * @memberof! opui.store
             * @param {String} storeName Name of stored collection
             * @returns {Array} items in stored collection
             */
            getStore: function(storeName){
                var items = [];
                Object.keys(localStorage).forEach(function(key){
                    if(key.split('|')[0] === secureID){
                        var item = JSON.parse(localStorage[key]);
                        if(item && item.store === storeName){
							//console.log(item);
                            items.push(item);
                        }
                    }
                });
                return items;
            },

            /**
             * Query store for items that match ALL query values
             * @function query
             * @memberof! opui.store
             * @param {String} storeName Name of stored collection
             * @param {Object} query Object of Query properties their values
             * @return {Array.<T>}
             * @param {Boolean} rule Match all query properties
             */
            query: function(storeName, query, rule){
                var store = opui.store.getStore(storeName);

                return (store.filter(function(item){
                    var count = 0;
                    var total = Object.keys(query).length;
                    for(key in query){
                        if(item[key] === query[key] && rule){
                            count++;
                            if(count === total && rule){
                                return true;
                            }
                        } else if(item[key] === query[key]) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }));
            },


            /**
             * Update a single item with new information
             * @function updateItem
             * @memberof! opui.store
             * @param {String} type course|nugget|testset|activity|skillprofile
             * @param {Number} id ID of item
             * @param {Object} update Object of update properties their values
             * @returns {Object} updated item
             */
            updateItem: function(type, id, update){
                var item = opui.store.getContent(type, id);
                for (prop in update){
                    item[prop] = update[prop];
                }
                localStorage[secureID + '|' + type + id] = JSON.stringify(item);
                opui.store.publish('update:item', item);
                return(item);
            },

            replaceItem: function(type, id, update){
                localStorage.removeItem(secureID + '|' + type + id);
                opui.store.setContent(type, id, update);
            },

            /**
             * Any module bootstrapping goes here
             * @function init
             * @memberof! opui.store
             */
            init: function(){
                opui.events.installTo(opui.store);
                opui.console.log('Module initialized: Store');

            }
        };
    }());



}(window.opui = window.opui || {}, jQuery, undefined));;// PROJECT FUNCTIONS CONFIGURATION

(function (opui, $, undefined){

if(!opui.config['style-src']){
	if(opui.config['style-src'] === 'less'){

		// Create object to hold modification key/values
		var modifiers = {};

		// iterate over the config key/values
		// and add them to the modifiers object
		for(var name in opui.config.styles) {
			modifiers[name.toString()] = opui.config.styles[name];
			// console.log(name+': '+opui.config.modifiers[name])
		};
		// opui.console.log(modifiers)
		less.modifyVars(modifiers);
		// opui.console.log('finished modification')

	}
} else {
    // Append Master CSS file to document head
    $('head').append('<link rel="stylesheet" href="stylesheets/'+opui.config['style-src']+'" />');
}

}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){

    /**
     * Wraps actions that occur when app notifies UI of a completed sync event
     * @function syncComplete
	 * @memberof! opui
     */
	opui.syncComplete = function(){
		opui.sync.syncComplete();
	};

	opui.sync = {

		syncComplete: function(){
			opui.sync.publish('sync:background');
		},

		init: function(){
			opui.console.log('Module initialized: Sync');

			opui.events.installTo(opui.sync);
		}
	};

}(window.opui = window.opui || {}, jQuery, undefined));;/**
 * OPUI Templates Module
 * Author: Joshua Brown, OnPoint Digital, Inc.
 */
(function (opui, $, undefined){

    /**
     *
     * @type {{load: Function}}
     */
    opui.templates = {

        load: function(){
            $.get('pgs/templates/templates.html').done(function(data){
                $('[data-role="templates"]').html(data);
            });
        }
    }


}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){
    "use strict";

    /**
     * @namespace tools
     * @memberof opui
     */
    opui.tools = {

        /**
         *
         * @param {Array} collection
         * @param {String} term
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        queryByCategory: function (collection, term) {
            return (collection.filter(function (element, index, array) {
                return (element.category === term);
            }));
        },

        /**
         *
         * @param collection
         * @param terms
         * @param method
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        queryByTags: function (collection, terms, method) {
            switch (method) {
                case 'inclusive':
                    return(collection.filter(function (element, index, array) {
                        if (element.tags) {
                            if (element.tags.length > 0) {
                                //console.log(element.name);
                                if (terms.some(function (e, i, a) {
                                        if ($.inArray(e, element.tags) > -1) {
                                            //console.log(e+" found");
                                            return true;
                                        } else {
                                            //console.log(e+" NOT found");
                                            return false;
                                        }
                                    })) {
                                    //console.log('Element has passed test as true');
                                    return element;
                                }
                            }
                        }
                    }));
                case 'exclusive':
                    return(collection.filter(function (element, index, array) {
                        //console.log(element);
                        if (element.tags) {
                            if (element.tags.length > 0) {
                                //console.log(element.name);
                                if (terms.every(function (e, i, a) {
                                        if ($.inArray(e, element.tags) > -1) {
                                            //console.log(e+" found");
                                            return true;
                                        } else {
                                            //console.log(e+" NOT found");
                                            return false;
                                        }
                                    })) {
                                    //console.log('Element has passed test as true');
                                    return element;
                                }
                            }
                        }

                    }));
            }
        },

        /**
         *
         * @param collection
         * @param terms
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        filterByTags: function (collection, terms){
            return(collection.filter(function(element, index, array){

                // check for tags property
                if(element.tags){

                    // check to see if there are any tags in tag array
                    if(element.tags.length > 0){

                        opui.console.log(element.name);
                        //
                        if(terms.some(function(e,i,a){
                                opui.console.log(e);
                                //
                                if($.inArray(e, element.tags) > -1){
                                    opui.console.log(e+" found");
                                    return false;
                                }else{
                                    opui.console.log(e+" NOT found");
                                    return true;
                                }
                            })){
                            opui.console.log('Element has passed test as true');
                            return element;
                        }
                    } else {

                        return element;
                    }

                } else {

                    return element;
                }
            }));
        },

        /**
         * @method filterByTypes
         * @param collection Array of items to be filtered
         * @param types Array of types to include in returned array
         * @returns {*} Returned array of filtered items
         */
        filterByTypes: function (collection, types){
            return(collection.filter(function(element, index, array){
                var itemType = element.assignType ? element.assignType : element.selectionType;
                opui.console.log(element.name);

                return (types.indexOf(itemType) > -1);
            }));
        },

        /**
         * @method filterByAttributes
         * @param collection
         * @param attributes
         * @returns {*}
         */
        filterByAttributes: function(collection, attributes, rule){
            switch (rule){
                case 'inclusive':
                    return (collection.filter(function(item){
                        if(attributes.some(function(e,i,a){
                                opui.console.log('Inclusive', e, item[e]);
                                //
                                if(item[e]){
                                    return true;
                                } else {
                                    return false;
                                }
                                //if($.inArray(e, element.tags) > -1){
                                //    opui.console.log(e+" found");
                                //    return false;
                                //}else{
                                //    opui.console.log(e+" NOT found");
                                //    return true;
                                //}
                            })){
                            opui.console.log('Item has at least one attribute as true');
                            return item;
                        }
                    }));
                    break;
                case 'exclusive':
                    return (collection.filter(function(item){
                        if(attributes.every(function(e,i,a){
                                opui.console.log('Exclusive', e, item[e]);
                            //
                            if(item[e]){
                                return true;
                            } else {
                                return false;
                            }
                            //if($.inArray(e, element.tags) > -1){
                            //    opui.console.log(e+" found");
                            //    return false;
                            //}else{
                            //    opui.console.log(e+" NOT found");
                            //    return true;
                            //}
                        })){
                            opui.console.log('Item has all attributes as true');
                            return item;
                        }
                    }));
                    break;
            }
        },

        /**
         *
         * @param collection
         * @returns {Array.<T>|*}
         */
        sortName: function (collection) {
            return (collection.sort(function (a, b) {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
                //sort string ascending
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0; //default return value (no sorting)
            }));
        },

        /**
         * Method for sorting an array of objects according to the sequence property
         * @method sortBySequence
         * @param collection
         * @returns {*|Array.<T>}
         */
		sortBySequence: function (collection){
			return (collection.sort(function(a,b){
				var sequenceA = a.sequence, statusB = b.sequence;
				//sort string ascending
				if (sequenceA < statusB) {
					return -1;
				}
				if (sequenceA > statusB) {
					return 1;
				}
				return 0; //default return value (no sorting)
			}));
		},

        /**
         *
         * @param collection
         * @returns {Array.<T>|*}
         */
        sortStatusAscending: function (collection){
            return (collection.sort(function(a,b){
                var statusA = a.status, statusB = b.status;
                //sort string ascending
                if (statusA < statusB) {
                    return -1;
                }
                if (statusA > statusB) {
                    return 1;
                }
                return 0; //default return value (no sorting)
            }));
        },


    /**
         *
         * @param collection
         * @returns {Array.<T>|*}
         */
        sortDate: function (collection){
            return (collection.sort(function(a,b){
                var dateA = a.date, dateB = b.date;
                //sort string descending
                if(dateA < dateB){
                    return 1;
                }
                if (dateA > dateB){
                    return -1;
                }
                return 0; //default return value (no sorting)
            }));
        },

        /**
         *
         * @param collection
         * @returns {Array.<T>|*}
         */
        sortAlpha: function (collection) {
            return (collection.sort());
        },

        /**
         *
         * @param property
         * @returns {Function}
         */
        compareByProperty: function (property){
            var sortOrder = 1;

            if(property[0] === '-'){
                sortOrder = -1;
                property = property.substr(1);
            }

            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            };
        },

        /**
         *
         * @param collection
         * @param attribute
         * @param value
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        itemsByAttribute: function (collection, attribute, value) {
            return(collection.filter(function (element, index, array) {
                if (element[attribute] === value) {
                    return element;
                }
            }));
        },

        /**
         *
         * @param collection
         * @param type
         * @param id
         * @returns {*|T}
         */
        itemById: function (collection, type, id) {
            return collection.filter(function (e,i,a){
                return (e.type === type && e.id === id);
            })[0];
        },

        indexByTag: function (collection, tag){
            var i;
            collection.forEach(function(element, index, array){
                if(element.indexOf(tag) > -1){
                    i = index;
                }
            });
            if(i !== 'undefined'){
                return i;
            } else {
                return -1;
            }
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        optionalItems: function (collection) {
            return (collection.filter(function (element, index, array) {
                return (element.optional === true || element.activity_type === "Optional");
            }));
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        requiredItems: function (collection) {
            return (collection.filter(function (element, index, array) {
                return (element.optional === false || element.activity_type === "Required");
            }));
        },

        /**
         *
         * @param {Number} skillprofileId ID of Skillprofile
         * @returns {Array}
         */
        getSkillList: function (skillprofileId) {
            var skillProfile = opui.store.getContent('skillprofile', skillprofileId);
            opui.console.log(skillProfile.items);
            var collection = [];
            for (var i = 0; i < skillProfile.items.length; i++) {
                var temp = opui.store.getContent(skillProfile.items[i].type, skillProfile.items[i].id);
                if(temp){
                    collection.push(temp);
                }
            }
            return collection;
        },

        /**
         *
         * @param id
         * @return {boolean}
         */
        selectionLaunch: function (type, id) {
            var selection = opui.store.getContent(type, id);
            var r = confirm('Would you like to view the selection now?');
            if (r === true) {
                window.location = 'cellcast://action/assign/' + selection.selectionType + '/' + selection.id + '/true';
            } else {
                window.location = 'cellcast://action/assign/' + selection.selectionType + '/' + selection.id + '/false';
            }
            return true;
        },

        /**
         * readAnnouncement
         * @param id
         */
        readAnnouncement: function (id) {
            // var temp = itemsByAttribute(opui.storage.get('announcements'), 'id', id)[0];
            // REWRITE TO USE UPDATE METHOD
        },

        /**
         * readNotification
         * @param id
         */
        readNotification: function (id) {
            // var temp = itemsByAttribute(opui.storage.get('notifications'), 'id', id)[0];
            // REWRITE TO USE UPDATE METHOD
        },

        /**
         *
         * @param collection
         * @param tag
         * @returns {Array.<T>}
         */
        orderByTagDescending: function (collection, tag){
            //separate items into one array for ordering and one for non-ordering
            var nonOrderItems = [];
            var orderItems = collection.filter(function(element, index, array){
                if(opui.tools.indexByTag(element.tags, tag) > -1){
                    return element;
                } else {
                    nonOrderItems.push(element);
                }
            });
            nonOrderItems = opui.tools.sortName(nonOrderItems);
            orderItems = orderItems.sort(function(a,b){
                var indexA = opui.tools.indexByTag(a.tags, tag);
                var indexB = opui.tools.indexByTag(b.tags, tag);
                var tagA = a.tags[indexA].substring(a.tags[indexA].lastIndexOf(":")+1), tagB = b.tags[indexB].substring(b.tags[indexB].lastIndexOf(":")+1);
                return tagB - tagA;
            });
            return orderItems.concat(nonOrderItems);
        },

        /**
         *
         * @param collection
         * @param tag
         * @returns {Array.<T>}
         */
        orderByTagAscending: function (collection, tag){
            //separate items into one array for ordering and one for non-ordering
            var nonOrderItems = [];
            var orderItems = collection.filter(function(element, index, array){
                if(opui.tools.indexByTag(element.tags, tag) > -1){
                    return element;
                } else {
                    nonOrderItems.push(element);
                }
            });
            nonOrderItems = opui.tools.sortName(nonOrderItems);
            orderItems = orderItems.sort(function(a,b){
                var indexA = opui.tools.indexByTag(a.tags, tag);
                var indexB = opui.tools.indexByTag(b.tags, tag);
                var tagA = a.tags[indexA].substring(a.tags[indexA].lastIndexOf(":")+1),
                    tagB = b.tags[indexB].substring(b.tags[indexB].lastIndexOf(":")+1);
                return tagA - tagB;
            });
            return orderItems.concat(nonOrderItems);
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        pendingItems: function (collection){
            return (collection.filter(function(element, index, array){
                return(element.optional === false && (element.status > 2 || element.status === 'Pending'));
            }));
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        notAttemptedItems: function (collection){
            return (collection.filter(function(element, index, array){
                return(element.status === 6 || element.status === 'Pending');
            }));
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        allIncompleteItems: function (collection){
            return (collection.filter(function(element, index, array){
                return(element.status > 2 || element.status === 'Pending' || element.status === 'Participated');
            }));
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        incompleteItems: function (collection){
            return (collection.filter(function(element, index, array){
                return(element.status > 2 && element.status !== 6 || element.status === 'Participated');
            }));
        },

        /**
         *
         * @param collection
         * @returns {*|Array.<T>|{TAG, CLASS, ATTR, CHILD, PSEUDO}}
         */
        completedItems: function (collection){
            return (collection.filter(function(element, index, array){
                return(element.status < 3 || element.status === 'Completed');
            }));
        },

        /**
         * Check item for assigned status
         * @param type
         * @param id
         * @returns {'assigned'|'unassigned'}
         */
        checkAssignStatus: function (type, id){
            var item = opui.store.getContent(type, id);
            if(!item) {
                return 'not found';
            } else if (item.assignType){
                return 'assigned';
            } else if (item.selectionType){
                return 'unassigned';
            }
        },

        /**
         * Check that user has completed all prerequisites
         * @param prerequisites {Array} collection of item objects
         * @returns {true|false}
         */
        checkPrerequisites: function(type, id){
            var launchItem = opui.store.getContent(type, id);
            if(launchItem.prerequisites && launchItem.prerequisites.length > 0){
                var items = [];
                launchItem.prerequisites.forEach(function(prereq){
                    var item = opui.store.getContent(prereq.item_type, prereq.item_id);
                    if(item && item.status && (item.status >= 3 || item.status === 'Pending')){
                        items.push(item);
                    }
                });
                if(items.length < 1){
                    return true; // all prerequisites are complete
                } else {
                    return false; // not all prerequisites are complete
                }
            } else {
                return true;
            }
        },

        /**
         * Process settings object
         * @param {Object} settings markup settings from list data- attributes
         * @returns {Array}
         */
        process: function (settings) {
            opui.console.log('Processing');
            opui.console.log('Settings: ');
            opui.console.log(settings);
            var collection;
            if (settings.hasOwnProperty('collection')) {
                switch (settings.collection) {
                    case 'library':
                        collection = opui.store.getStore('library');
                        if (settings.hasOwnProperty('subset')) {
                            collection = collection.filter(function(e){
                                return (e.selectionType === settings.subset);
                            });
                        }
                        break;
                    case 'catalog':
                        collection = opui.store.getStore('assignments').concat(opui.store.getStore('library'));
                        if (settings.hasOwnProperty('subset')) {
                            collection = collection.filter(function(e){
                                return (e.assignType === settings.subset || e.selectionType === settings.subset);
                            });
                        }
                        break;
                    case 'assignments':
                        collection = opui.store.getStore('assignments');
                        if (settings.hasOwnProperty('subset')) {
                            collection = collection.filter(function(e){
                                return (e.assignType === settings.subset);
                            });
                        }
                        break;
                    case 'pending':
                        collection = opui.tools.pendingItems(opui.store.getStore('assignments'));
                        break;
                    case 'games':
                        var model = opui.store.getStore('games');
                        collection = {
                            profile: opui.store.getStore('profile'),
                            games: model,
                            earned_points: function(){
                                var tp = 0;
                                for (var i = 0; i < model.length; i++){
                                    tp += parseInt(model[i].user_points);
                                }
                                return tp;
                            },
                            game_points: function(){
                                var gp = 0;
                                for (var i = 0; i < model.length; i++){
                                    gp += parseInt(model[i].game_points);
                                }
                                return gp;
                                // return 4000;
                            },
                            percent_complete: function(){
                                var percent = collection.earned_points() === 0 ? 0 : Math.floor((parseInt(collection.earned_points()) / collection.game_points()) * 100);
                                return percent+'%';
                            },
                            point_difference: function(){
                                return parseInt(collection.game_points()) - parseInt(collection.earned_points());
                            },
                            level: settings.scale ? {
                                current: function(){
                                    var level = Math.ceil(collection.earned_points()/settings.scale);
                                    if (level === 0){
                                        level = 1;
                                    }
                                    return level;
                                },
                                next: function(){
                                    return parseInt(collection.level.current()) + 1;
                                },
                                point_difference: function(){
                                    var bp = parseInt(collection.level.current()) * settings.scale;
                                    return parseInt(bp) - parseInt(collection.earned_points());
                                },
                                percent_complete: function(){
                                    var bp = parseInt(collection.level.current()) * settings.scale;
                                    var percent = Math.floor((parseInt(collection.earned_points()) / bp) * 100);
                                    return percent+'%';
                                }
                            } : null
                        };
                        break;
                    case 'announcements':
                        collection = opui.store.getStore('announcements');
                        break;
                    case 'notifications':
                        collection = opui.store.getStore('notifications');
                        break;
                    case 'tiles':
                        collection = opui.config.tiles;
                        break;
                    case 'menu':
                        collection = opui.config.menu;
                        break;
                    case 'hierarchy':
                        var content;
                        // is this a non-root node?

                        if (settings.node !== undefined && settings.node != 0){
                            // get subnodes
                            collection = opui.store.query('nodes', {parent_id: settings.node}, true);

                            content = opui.hierarchy.getNodeContent(settings.node);
                            // otherwise assume a root node
                        } else {
                            // get subnodes
                            collection = opui.store.query('nodes', {parent_id: 0}, true);

                            content = opui.hierarchy.getNodeContent(settings.node);
                        }

                        collection = collection.concat(content);

                        opui.console.log('hierarchy content');
                        opui.console.log(collection);
                        break;
                    case 'breadcrumb':
                        collection = opui.breadcrumb.entries;
                        break;
                }
            }
            if (settings.hasOwnProperty('skillprofile')) {
                var spList = opui.tools.getSkillList(settings.skillprofile);
                collection = [];
                $.each(spList, function () {
                    var temp = opui.tools.itemById(opui.store.getStore('assignments'), this.id);
                    collection.push(temp);
                });
            }


            if(settings.hasOwnProperty('detail')){
                collection = opui.tools.getSkillList(settings.detail);
            }

            opui.console.log(collection);
            return collection;
        },

        /**
         * Filter collection of items based on settings
         * @param {Object} settings
         * @param {Array | Object} collection data or list of items
         * @returns {}
         */
        filter: function (settings, collection){
            opui.console.log('Filtering');

            var filtered = collection;


            if(settings.hasOwnProperty('category')){
                filtered = opui.tools.queryByCategory(filtered, settings.category);
            }

            if(settings.hasOwnProperty('tags')){
                var tags;
                if(settings.tags.indexOf('!') > -1){
                    tags = settings.tags.replace('!', '').split(',');
                    filtered = opui.tools.queryByTags(filtered, tags, 'exclusive');
                } else {
                    tags = settings.tags.split(',');
                    filtered = opui.tools.queryByTags(filtered, tags, 'inclusive');
                }
            }

            if(settings.hasOwnProperty('filter')){
                var filters = settings.filter.split(',');
                filtered = opui.tools.filterByTags(filtered, filters);
            }

            if(settings.hasOwnProperty('limit')){
                if(collection.length + 1 != settings.limit){
                    filtered = collection.slice(collection.length-parseInt(settings.limit));
                }
            }

            if(settings.hasOwnProperty('types')){
                var types = settings.types.split(',');
                filtered = opui.tools.filterByTypes(filtered, types);
            }

            if(settings.hasOwnProperty('attributes')){
                var attributes;
                if(settings.attributes.indexOf('!') > -1){
                    attributes = settings.attributes.replace('!', '').split(',');
                    filtered = opui.tools.filterByAttributes(filtered, attributes, 'exclusive');
                } else {
                    attributes = settings.attributes.split(',');
                    filtered = opui.tools.filterByAttributes(filtered, attributes, 'inclusive');
                }
            }

            if(settings.assigned){

                if(settings.assigned === 'optional'){
                    filtered = filtered.filter(function(e){
                        return (e.selectionType || e.optional === true);
                    });
                }
                if(settings.assigned === 'required'){
                    filtered = filtered.filter(function(e){
                        return (e.optional === false);
                    });
                }
            }

            if (settings.optional === "optional") {
                filtered = filtered.filter(function(item){
                    return(item.hasOwnProperty('optional') && item.optional);
                });
            }

            if (settings.optional === "required") {
                filtered = filtered.filter(function(item){
                    return(item.hasOwnProperty('optional') && !item.optional);
                });
            }

            if(settings.hasOwnProperty('status')){
                switch (settings.status) {
                    case 'complete':
                        filtered =  opui.tools.completedItems(filtered);
                        break;
                    case 'incomplete':
                        filtered =  opui.tools.incompleteItems(filtered);
                        break;
                    case 'not-attempted':
                        filtered =  opui.tools.notAttemptedItems(filtered);
                        break;
                    case 'all-incomplete':
                        filtered =  opui.tools.allIncompleteItems(filtered);
                        break;
                    default:
                        // do nothing
                        break;
                }
            }

            if(settings.hasOwnProperty('nospitems')){
                var skillprofileItems = [];
                var skillprofiles = opui.store.query('assignments', {assignType:'skillprofile'}, true);
                skillprofiles.forEach(function(sp){
                    if(sp.items.length > 0){
                        sp.items.forEach(function(item){
                            skillprofileItems.push(item.id);
                        });
                    }
                });

                filtered = filtered.filter(function(item){
                    return (skillprofileItems.indexOf(item.id) === -1);
                });
            }

            return filtered;
        },

        /**
         * Sort collection of items based on settings
         * @param settings
         * @param collection
         * @returns {*}
         */
        sorting: function (settings, collection){
            opui.console.log('Sorting');
            var sorted = collection;
            if(settings.orderbyskillprofile === "true" || settings.collection === 'games' || settings.collection === 'tiles' || settings.collection === 'menu' || settings.collection === 'breadcrumb'){
                // do nothing
            } else {
                if(settings.collection === 'notifications'){
                    sorted = opui.tools.sortDate(sorted);
                } else {
                    if(settings.orderascending){
                        sorted = opui.tools.orderByTagAscending(sorted, settings.orderascending);
                    }
                    else if(settings.orderdescending){
                        sorted = opui.tools.orderByTagDescending(sorted, settings.orderdescending);
                    } else if(settings.collection === "hierarchy"){
                        sorted = sorted.sort(opui.tools.compareByProperty('sequence'));
                    } else if(settings.sortby === "status-ascending"){
                        sorted = opui.tools.sortStatusAscending(sorted);
                    } else {
                        sorted = opui.tools.sortName(sorted);
                    }
                }
            }

            return sorted;
        },

        logout: function(){
            var general_logoutrusure2 = "Are you sure you want to logout?";
            var ans = confirm(general_logoutrusure2);
            opui.console.log(ans);
            if (ans) {
                opui.console.log('change location');
                setTimeout(function(){
                    window.location = "/opportal/logout.do";
                }, 0);
            }
            else {
                return false;
            }
        },

        tests: function(){
            QUnit.module('opui.tools');

            QUnit.test('checkAssignType', function(assert){
                assert.equal(opui.tools.checkAssignStatus('nugget', 6575), 'assigned');
                assert.equal(opui.tools.checkAssignStatus('course', 14390), 'unassigned');
                assert.equal(opui.tools.checkAssignStatus('horse', 999), 'not found');

            });


        }



    };




}(window.opui = window.opui || {}, jQuery, undefined));;(function (opui, $, undefined){
	opui.topage = function(){
		var qrCode 		= arguments[0],
			qrReplace	= qrCode.replace(/[+]/g, '/'),
			split 		= qrReplace.split('/'),
			url 		= split[1] + '/departments/' + split[2] + '/qr/' + split[3] + '.html'; 
		opui.console.log(arguments[0]);
		opui.console.log('url is: ' + url);
		// stepPush(url,null,null);
		// loadTarget(url, null); 
		return 'got it';
	}
}(window.opui = window.opui || {}, jQuery, undefined));