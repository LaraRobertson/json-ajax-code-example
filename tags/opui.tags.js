riot.tag2('mobile-feed', '<ul><li each="{notifications}"><p><strong>{displayDate}</strong><br><raw content="{text}"></raw></p></li></ul>', 'mobile-feed ul li { background: #fff; } mobile-feed li div { height: auto; }', '', function(opts) {
		var self = this;

		var locale = 'en-us';

		function dateView(date){
			var d = date;
			var month = d.toLocaleString(locale, {month: 'long'});
			var day = d.getDay();
			var year = d.getFullYear();

			return month + ' ' + day;

		}
		var n = $.parseJSON(JSON.stringify(messages.notifications));

		n.forEach(function(message){
			var parts = message.date.split(' ');
			var full = parts[0] + 'T' + parts[1];
			message.date = new Date(full);

			message.displayDate = dateView(message.date);
		});

		n.sort(function(a,b){
			if(opts.hasOwnProperty('order') && opts.order == 'descending'){
				if(a.date > b.date){
					return -1;
				}
				if(a.date < b.date){
					return 1;
				}
				return 0;
			} else {
				if(a.date < b.date){
					return -1;
				}
				if(a.date > b.date){
					return 1;
				}
				return 0;
			}

		});

		self.notifications = n;

}, '{ }');
riot.tag2('foundation-tabs', '<yield></yield>', '', '', function(opts) {
        var self = this;

        self.on('mount', function(){
           $(self.root).foundation({
               tab: {
                   callback : function (tab) {
                       self.update();
                   }
               }
           });
        });

});
riot.tag2('opui-announcements', '<yield></yield><ul class="list" if="{!opts.hasOwnProperty(\'override\')}"><li each="{announcements}" class="selectable listings selectionsPg message" data-id="{id}" onclick="{parent.launch}"><div class="columns small-1"><i class="icon-bell"></i></div><div class="columns small-10" style="padding-left:0"><p class="title" data-tmpl="msg_title"><raw content="{title}"></raw></p></div><div class="columns small-1"><i class="icon-caret-right"></i></div><span style="display:none" data-tmpl="msg_text"></span></li><li if="{announcements.length < 1}" data-tmpl="no-items"><div class="columns medium-12"><p class="title">There are no items of this type available at this time.</p></div></li></ul>', '', '', function(opts) {
        var self = this;

        self.announcements = opui.store.getStore('announcements');

        this.launch = function(e){

            console.log(e.item);
            var decodedText = decodeURIComponent(e.item.text);
            console.log("decodedText", decodedText);
            opui.events.publish('modal',
                    {
                        header: e.item.title,
                        body: '<opui-partial>' + e.item.text + '</opui-partial>'
                    });
        }.bind(this)

}, '{ }');
riot.tag2('opui-assignments', '<yield></yield>', '', '', function(opts) {
        var self = this;
        self.imgpath = opui.config.imgpath;
        function run(options){

            self.empty = false;
            var collection = opui.tools.process(options);
            collection = opui.tools.filter(options, collection);

            if (collection === null || collection.length < 1) {
                opui.console.log('collection is null');
                self.empty = true;
                self.items = collection;

            } else {

                    collection.forEach(function (item) {
                        if (item.assignType === "skillprofile" || item.selectionType === "skillprofile") {

                            if (item.items.length > 0) {
                                item.items = opui.tools.getSkillList(item.id);
                                var count = 0;
                                item.items.forEach(function (e) {

                                    var spItem = opui.store.getStore('assignments').filter(function (x) {
                                        return (x.id === e.id && x.assignType === e.assignType);
                                    })[0];

                                    if (spItem) {

                                        if (spItem.status <= 3 || spItem.sco_status <= 3 || spItem.status === 'Complete') {
                                            count++;
                                        }
                                    }
                                });

                                var progress = Math.round((count / item.items.length) * 100);
                                if (progress < 1) {
                                    progress = 0;
                                }
                                self.progress = progress + '%';
                            }
                        }
                    });

                collection = opui.tools.sorting(options, collection);
                if (collection === null || collection.length < 1) {
                    opui.console.log('collection is null');
                    self.empty = true;
                    self.items = collection;
                }
            }
            self.items = collection;

            if(opts['totalitems']){

                var totalitems = parseInt(opts['totalitems']);
                self.items = collection.slice(0,totalitems);
            }

            opui.console.log("opui-assignments3",self.items);

        }

        self.on('update', function(){
            opui.console.log('opui-assignments updating');
            run(opts);

        });

        self.on('mount', function(){
            opui.console.log('opui-assignments mounting');
        });

        this.assign = function(e){
            opui.console.log('ASSIGN', e.item.id);
            opui.console.log('ASSIGN Type', e.item.selectionType);

            $.ajax({
                url: '/opux/api/assign',
                type: 'post',
                contentType: 'application/json',
                data:JSON.stringify({
                    "assign": [
                        {
                            "id": e.item.id,
                            "type": e.item.selectionType
                        }
                    ]
                }),
                success: function(status){
                    opui.console.log('ASSIGN RETURN', status)
                    if(status){

                        opui.data.typeRequests(e.item.selectionType);
                        var confirm_text = "Do you want to launch the content?";
                        var ans = confirm(confirm_text);
                        if (ans) {
                            opui.console.log('launch content');
                            var url = "/opportal/CustomUiLauncher?type="+e.item.selectionType+"&id="+e.item.id;
                            var s_width = screen.availWidth / 0.9;
                            var s_height = screen.availHeight / 0.9;
                            if (s_width > 1200)
                                s_width = 1200;
                            if (s_height > 1024)
                                s_height = 1024;
                            var s_left = parseInt((screen.availWidth/2) - (s_width/2));
                            var s_top = parseInt((screen.availHeight/2) - (s_height/2));
                            var windowFeatures = "width=" + s_width + ",height=" + s_height + ",scrollbars=yes, resizable=yes, toolbar=no, minimize=no, menubar=no, status=yes ,left=" + s_left + ",top=" + s_top + "screenX=" + s_left + ",screenY=" + s_top;
                            window.open(url, "opls", windowFeatures);
                        }
                        else {
                            return false;
                        }

                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus);
                }
            })
        }.bind(this)

        run(opts);

});
riot.tag2('opui-back', '<yield></yield>', '', '', function(opts) {
        var self = this;

        self.show = false;

        this.goback = function(e){

            if (self.url === undefined) {

                if (!opts.back) {
                    opts.back  = opui.config.home
                }

                riot.route(opts.back);
            } else {
                riot.route(self.url);
            }
        }.bind(this);

        opui.events.subscribe('back:path', function(url){

            self.url = url;
            self.update();
        });

        opui.events.subscribe('page:change', function(obj){

            if(obj.url != opui.config.home){
                self.show = true;
                self.update();
            } else {
                self.show = false;
                self.update();
            }
        });

});
riot.tag2('opui-catalog', '<yield></yield><ul if="{!opts.hasOwnProperty(\'override\')}" class="list limit-width break"><li each="{items}" class="selectable"><a href="#" if="{selectionType}" onclick="{parent.assign}"><div class="img-block"><img src="" data-tmpl="thumb" onerror="this.onerror=null; this.src=\'img/thumbs/sample.png\';"></div><div class="text-block"><p class="title" data-tmpl="title" style="font-weight:bold">{name}</p><p class="desc" data-tmpl="description">{description}</p></div><div class="icon-block"><i data-tmpl="status-completion" class="">{status}</i><i data-tmpl="status-test"></i></div></a><a href="#" if="{assignType}" onclick="{parent.launch}"><div class="img-block"><img src="" data-tmpl="thumb" onerror="this.onerror=null; this.src=\'img/thumbs/sample.png\';"></div><div class="text-block"><p class="title" data-tmpl="title" style="font-weight:bold">{name}</p><p class="desc" data-tmpl="description">{description}</p></div><div class="icon-block"><i data-tmpl="status-completion" class="">{status}</i><i data-tmpl="status-test"></i></div></a></li></ul>', '', '', function(opts) {
    var self = this;

        var self = this;

        self.empty = false;

    self.on('launch', function(options){
        opui.console.log(options)
    });
    self.on('update', function(e){
        opui.console.log('opui-catalog updating');
    });

    self.on('mount', function(e){
        opui.console.log('opui-catalog mounting');
    });
    function run(options){
        var collection = opui.tools.process(options);
        collection = opui.tools.filter(options, collection);

        if (collection === null || collection.length < 1) {
            opui.console.log('collection is null');
            self.empty = true;
            return true;
        }
        collection = opui.tools.sorting(options, collection);
            if (collection === null || collection.length < 1) {
            opui.console.log('collection is null');
            self.empty = true;
            return true;
        }
        self.items = collection;
    }

        this.assign = function(e){
            var r = confirm('Download and play now?');
            window.location = 'cellcast://action/assign/' + e.item.selectionType + '/' + e.item.id + '/' + r;
            library.model.trigger('assignItem', e.item.selectionType, e.item.id);
        }.bind(this)

        this.launch = function(e){
            opui.console.log(opts)
            if(opts.hasOwnProperty('details')){
                riot.route('assignments/details.html?type=' + e.item.assignType + '&id=' + e.item.id);
            } else {
                assignments.model.trigger('updateItem', e.item.assignType, e.item.id, {
                    status: 8
                });
                window.location = 'cellcast://'+e.item.assignType+'/'+e.item.id;
            }

        }.bind(this)

    run(opts);
}, '{ }');
riot.tag2('opui-footer', '<yield></yield>', '', '', function(opts) {
        var self = this;
        self.showfooter = false;
        self.platform = opui.config.platform;
        opui.events.subscribe('footer', function(obj){
            if (obj === "show") {
                self.showfooter = true;
                self.update();
            } else {
                self.showfooter = false;
                self.update();
            }
            return true;
        });

});
riot.tag2('opui-fourms', '<yield></yield><ul class="list"><li each="{items}" class="selectable"><a href="/opux/viewer/forum/{id}"><div class="text-block"><p class="title" style="font-weight:bold">{name}</p></div></a></li><li if="{empty}"><div class="text-block"><p class="title">There are no items of this type available at this time.</p></div></li></ul>', '', '', function(opts) {
        var self = this;

        self.fourms = opui.store.getItem('forumlist');

}, '{ }');
riot.tag2('opui-games-progress', '<yield></yield>', '', '', function(opts) {
    var self = this;
    var gamesCollection = opui.store.getStore('games');
    var profile = opui.store.getItem('profile');
    var total_points = 0;
    var game_points = 0;

    if (typeof profile !== 'undefined' && profile.avatar_size > 0) {
        self.avatar = profile.avatar;
    } else {
        self.avatar = "img/thumbs/user.png";
    }

    gamesCollection.forEach(function(object){
        total_points += parseInt(object.user_points);
        game_points += object.game_points;
    });

    if(total_points === 0 && game_points === 0){
        self.percent_complete = '0%';
    } else {
        var percent = Math.floor((total_points / game_points) * 100) ? Math.floor((total_points / game_points) * 100) : 0;
        if(percent > 100){
            self.percent_complete = '100%';
        } else {
            self.percent_complete = percent+'%';
        }
    }

    self.games = gamesCollection;
    self.profile = profile;
    self.total_points = total_points;
    self.game_points = game_points;

});
riot.tag2('opui-gauge', '<div id="gauge-holder"><div id="completionWrapper" style="position: absolute;"><span id="completion" style="line-height: 21px;">{total} <span class="complete">Complete</span></span></div><canvas id="gauge-area" width="{opts.width}" height="{opts.height}"></canvas></div>', '', '', function(opts) {
		var self = this;

		if(opts.hasOwnProperty('tag')){
			var tag = opts.tag
		}

		if(opts.hasOwnProperty('value')){
			var progress = opts.value;
		} else {
			var assignments = opui.store.getStore('assignments')

			var completeCount = assignments.filter(function(item){
				return ( item.status <= 2 );
			}).length;

			var totalCount = assignments.length;

			var progress = Math.floor((completeCount / totalCount) * 100) ? Math.floor((completeCount / totalCount) * 100) : 0;
		}

		self.total = progress;
		self.total += '%';
		self.progress = progress;

		self.on('mount', function(){
			if(!self.myGaugeChart) {
				var guageData = [{
					value: parseInt(opts.value),
					color: "#1C8FCF",
					highlight: "#22B0FF",
					label: "Completed"
				},{
					value: 100 - parseInt(opts.value),
					color: "#e1e1e1",
					highlight: "#efefef",
					label: "Incomplete"
				}];

				opui.console.log(guageData);

				var ctx = self.root.querySelector('canvas') ? self.root.querySelector('canvas').getContext("2d") : null;

				self.myGaugeChart = new Chart(ctx).Doughnut(guageData, {
					responsive:true,
					showTooltips: false,
					scaleShowLabelBackdrop: false,
					scaleShowLine: false,
					animation: true,
					animationEasing: 'easeOutBounce',
					animateRotate: true,
					animateScale: true,
					animationSteps: 20,
					scaleShowLabels: false,
					percentageInnerCutout : 75,
					segmentStrokeWidth: 3,
				});

				self.myGaugeChart.update();
			}

		})

}, '{ }');

riot.tag2('opui-hierarchy', '<yield></yield>', 'opui-hierarchy *,[riot-tag="opui-hierarchy"] * {box-sizing: border-box;} opui-hierarchy .center,[riot-tag="opui-hierarchy"] .center {text-align:center;} opui-hierarchy .hidden,[riot-tag="opui-hierarchy"] .hidden {display:none;} opui-hierarchy ul.list li,[riot-tag="opui-hierarchy"] ul.list li { display: table; position: relative; width: 100%; margin: 0 0 10px; list-style-type: none; } opui-hierarchy ul.list .icon-block,[riot-tag="opui-hierarchy"] ul.list .icon-block { display: table-cell; position: relative; font-size: 1em; width: 50px; height: 100%; vertical-align: middle; z-index: 10; } opui-hierarchy ul.list li .text-block,[riot-tag="opui-hierarchy"] ul.list li .text-block { display: table-cell; position: relative; padding: 15px; width: 100%; text-align: left; vertical-align: middle; font-weight: normal; z-index: 9; } opui-hierarchy #hierarchyContent,[riot-tag="opui-hierarchy"] #hierarchyContent,opui-hierarchy .viewWrapper,[riot-tag="opui-hierarchy"] .viewWrapper { clear: both; margin: 0 auto; border: 1px solid #aaa; border-bottom: 0px; display: block; } opui-hierarchy #hierarchyContent ul,[riot-tag="opui-hierarchy"] #hierarchyContent ul,opui-hierarchy .viewWrapper ul,[riot-tag="opui-hierarchy"] .viewWrapper ul { padding:0;margin:0; } opui-hierarchy #hierarchyContent li,[riot-tag="opui-hierarchy"] #hierarchyContent li,opui-hierarchy .viewWrapper li,[riot-tag="opui-hierarchy"] .viewWrapper li { list-style: none; background-color: #fff; padding: 10px; border-bottom: 1px solid #aaa; margin-bottom:0; } opui-hierarchy #hierarchyContent li.browse-title,[riot-tag="opui-hierarchy"] #hierarchyContent li.browse-title,opui-hierarchy li.view-title,[riot-tag="opui-hierarchy"] li.view-title { text-transform: uppercase; font-size: 1.1em; font-weight: bold; background: darken(#fff, 10%); background-color: #eee; position: relative; color: #340c36; } opui-hierarchy #hierarchyContent li .text-block .title,[riot-tag="opui-hierarchy"] #hierarchyContent li .text-block .title,opui-hierarchy .viewWrapper li .text-block .title,[riot-tag="opui-hierarchy"] .viewWrapper li .text-block .title { color:#000; } opui-hierarchy #hierarchyContent a,[riot-tag="opui-hierarchy"] #hierarchyContent a,opui-hierarchy .viewWrapper a,[riot-tag="opui-hierarchy"] .viewWrapper a { color: #000; } opui-hierarchy #hierarchyContent ul.list .icon-block,[riot-tag="opui-hierarchy"] #hierarchyContent ul.list .icon-block { height: 60%; } opui-hierarchy #hierarchyContent ul.list .icon-block > i,[riot-tag="opui-hierarchy"] #hierarchyContent ul.list .icon-block > i { border-radius: 20px; border: 3px solid white; width: 30px; height: 30px; line-height: 25px; } opui-hierarchy .viewWrapper,[riot-tag="opui-hierarchy"] .viewWrapper { background-color: transparent; padding: 0; margin-top:20px; } opui-hierarchy .hidden,[riot-tag="opui-hierarchy"] .hidden {display:none;}', '', function(opts) {
        var self = this;
        opts.node_id = opts.node_id || 0;
        if(opts.hasOwnProperty('tags')){
            var tags = opts.tags.split(',')
        }

        if(typeof opts.catalog_array !== 'undefined'){
            catalog_array = opts.catalog_array;
        } else if (typeof opui !== 'undefined') {
            catalog_array = opui.store.getStore('assignments').concat(opui.store.getStore('library'));
        }
        if(typeof opts.nodes_array !== 'undefined'){
            nodes_array = opts.nodes_array;
        } else if (typeof opui !== 'undefined') {
            nodes_array = opui.store.getStore('nodes');
        }
        if(typeof opts.games_array !== 'undefined'){
            games_array = opts.games_array;
        } else if (typeof opui !== 'undefined') {
            games_array = opui.store.getStore('games');
        }
        console.log('nodes-array',nodes_array);

        function buildHierarchy(id){
            self.node_id = id;
            console.log(self.node_id);

            var childrenCollection = nodes_array.filter(function(node){
                return (node.parent_id == self.node_id);
            });

            console.log('children collection', childrenCollection);

            childrenCollection = opui.tools.sortBySequence(childrenCollection);
            console.log('sorted children collection', childrenCollection);
            self.children = childrenCollection;

            var itemCollection = nodes_array.filter(function(node){
                return (node.node_id == self.node_id);
            });
            var content = [];
            if (itemCollection[0] !== undefined) {
                console.log("itemCollection", itemCollection[0]);

                if (itemCollection[0] !== undefined) {
                    if (itemCollection[0].items !== undefined) {

                        itemCollection[0].items = opui.tools.sortBySequence(itemCollection[0].items);
                        console.log("sorted itemCollection", itemCollection[0].items);
                        itemCollection[0].items.forEach(function (object) {
                            var t = catalog_array.filter(function (e) {
                                return (e.id === object.item_id && (e.assignType === object.item_type.toLowerCase() || e.selectionType === object.item_type.toLowerCase()) );
                            })[0];
                            if (!t && object.item_type === 'course') {
                                var t = catalog_array.filter(function (e) {
                                    return (e.id === object.item_id && (e.assignType === 'scorm' || e.selectionType === 'scorm') );
                                })[0];
                            }
                            if (!t && object.item_type === 'game') {
                                var t = games_array.filter(function (e) {
                                    return (e.game_id === object.item_id);
                                })[0];
                            }
                            if (t) {
                                var t = $.parseJSON(JSON.stringify(t));
                                t.sequence = object.sequence;
                                if (t.hasOwnProperty('assignType')) {
                                    t.status = "assigned";
                                } else {
                                    t.status = "unassigned";
                                }
                                t.obj_type = object.item_type;
                                content.push(t);
                            }

                        });
                    }
                }
            }
            console.log('item collection', content);
            self.items = content;

            if (self.node_id != opts.node_id) {
                var breadcrumbs = [];

                var currentNode = nodes_array.filter(function(node){
                    return (node.node_id == self.node_id);
                })[0];
                if (currentNode.parent_id != opts.node_id) {
                    var parentNode = nodes_array.filter(function(node){
                        return (node.node_id == currentNode.parent_id);
                    })[0];
                    var nodeTarget = parentNode.node_id;

                    var entry = {

                        text: parentNode.node_title,
                        target: nodeTarget,
                        data: parentNode
                    };
                    if(entry.text.length > 0 ){
                        breadcrumbs.push(entry);
                    }
                }
                self.node_title = currentNode.node_title;
                self.breadcrumb = breadcrumbs;
            }

            self.update();
        }

        this.breadcrumbNav = function(e){
            var item = e.item;
            console.log('breadcrumb item', item);

            buildHierarchy(item.target)
        }.bind(this)

        this.newNode = function(e){
            var settings = $.extend(opts, e.item.node_id);
            console.log(settings);

            opui.events.publish('node:change', e.item);
        }.bind(this)

        opui.events.subscribe('node:change', function(node){
            console.log('Go to node: ' + node.node_id);
            buildHierarchy(node.node_id)
        });

        buildHierarchy(opts.node ? opts.node:0);

});
riot.tag2('opui-launch', '<yield></yield>', '', '', function(opts) {
        var self = this;

        var s_width = screen.availWidth * 0.75;
        var s_height = screen.availHeight * 0.75;
        if (s_width > 1200)
            s_width = 1200;
        if (s_height > 1024)
            s_height = 1024;
        var s_left = parseInt((screen.availWidth/2) - (s_width/2));
        var s_top = parseInt((screen.availHeight/2) - (s_height/2));
        var windowFeatures = "width=" + s_width + ",height=" + s_height + ",scrollbars=yes, resizable=yes, toolbar=no, minimize=no, menubar=no, status=yes ,left=" + s_left + ",top=" + s_top + "screenX=" + s_left + ",screenY=" + s_top;
        opts.details = opts.details || 'true';
        opts.width = opts.width || s_width;
        opts.height = opts.height || s_height;
        opts.top = opts.top || s_top;
        opts.left = opts.left || s_left;
        opts.windowName = opts.windowName || 'opls';

        self.width = opts.width;
        self.height = opts.height;
        self.left = opts.left;
        self.top = opts.top;
        self.windowName = opts.windowName;
        self.details = opts.details;

        var opux_keywords =  ["content","activityList","activityLaunch","certificateList","courseList","courseCatalog","courseLaunch","courseRequest","courseLaunch508","eventList","eventCalendar","eventCatalog","eventInstructor","eventRegister","eventLaunch","forumList","forumLaunch","myProfile","showHelp","nuggetList","nuggetCatalog","nuggetLaunch","skillprofileList","skillprofileCatalog","skillprofileLaunch","skillprofileRequest","myStatus","testsetCatalog","testsetLaunch","gameList","gameLaunch","categoryList","ratings","logout","internalUrl"];

        var launchCode_keywords =  ["opcm","oppm","opdoc","directory","announcements"];

        function launchTarget(obj){
            opui.console.log('launchTarget',self.target);

            var options;
            if(obj){
                options = obj;
            } else {
                options = opts;
            }

            if (opui.config.platform == "opux") {

                if (self.target == "" && !opui.config.offline) {
                    opui.console.log("Keyword, " + opts.keyword + ", does not work.");

                }
                else if (self.target == "" && opui.config.offline) {
                    opui.console.log("You can not launch content with offline data.");

                }
                else {
                    $.ajax({
                        url: '/opux/api/sessionstatus'
                    }).done(function (status) {

                        if (status === 'yes') {

                            if (options.keyword == "logout") {

                                if (options.hasOwnProperty('confirm')  ) {

                                    var confirm_text = options.confirm;
                                    var ans = confirm(confirm_text);
                                    opui.console.log('confirm from opui-launch tag: ' + ans);
                                    if (ans) {
                                        opui.console.log('change location after confirm, status yes.');
                                        setTimeout(function () {
                                            top.window.location = self.target;
                                        }, 0);
                                    }
                                    else {
                                        return false;
                                    }
                                } else {
                                    opui.console.log('change location');
                                    setTimeout(function () {
                                        window.location = self.target;
                                    }, 0);
                                }
                            } else {
                                var windowFeatures = "width=" + self.width + ",height=" + self.height + ",scrollbars=yes, resizable=yes, toolbar=no, minimize=no, menubar=no, status=yes ,left=" + self.left + ",top=" + self.top + ",screenX=" + self.left + ",screenY=" + self.top;
                                opui.console.log("window open",self.target);
                                var t = window.open(self.target, self.windowName, windowFeatures);

                                var checkWin = setInterval(function(){
                                    if(t.closed){
                                        opui.data.publish('refresh', {});
                                        opui.console.log("refresh on closed window");
                                        clearInterval(checkWin);

                                        return;
                                    }
                                }, 500);
                            }

                        } else {

                            if (options.keyword === "logout") {

                                if (options.hasOwnProperty('confirm')  ) {

                                    var confirm_text = options.confirm;
                                    var ans = confirm(confirm_text);
                                    opui.console.log('confirm from opui-launch tag: ' + ans);
                                    if (ans) {
                                        opui.console.log('change location after confirm');
                                        top.window.location = self.target;
                                    }
                                    else {
                                        return false;
                                    }
                                } else {
                                    opui.console.log('change location');
                                    setTimeout(function () {
                                        top.window.location = self.target;
                                    }, 0);
                                }
                            } else {
                                var session_expired_text = "Sorry. This keyword, "+options.keyword+", does not work because the session has ended. Do you want to Logout?";
                                var ans = confirm(session_expired_text);
                                if (ans) {
                                    opui.console.log('change location');
                                    setTimeout(function () {
                                        top.window.location = "/opportal/logout.do";
                                    }, 0);
                                }
                                else {
                                    return false;
                                }
                            }

                        }
                    });
                }

            } else {

                if (self.target == "") {
                    opui.console.log("Keyword, "+opts.keyword+" is Not Available");

                }
                else {
                    window.location = self.target;
                }
            }

        }

        function init(obj){
            opui.console.log('Launch Tag Init');

            self.user_role = opui.store.getItem('environment') ? opui.store.getItem('environment').user_role : 'U';
            self.platform = opui.config.platform;

            var options;
            if(obj){
                options = obj;
            } else {
                options = opts;
            }

            self.target = "";
            if (opui.config.platform == "opux" && !opui.config.offline) {

                if (opux_keywords.indexOf(options.keyword) > -1){
                    switch (options.keyword) {
                        case 'content':
                            if(options.hasOwnProperty('type') || options.hasOwnProperty('id')) {
                                if (options.type != "nugget" && options.type != "testset") {
                                    self.target = "/opux/viewer/" + options.type + "/" + options.id;
                                } else {

                                    self.target = "/opportal/CustomUiLauncher?type="+options.type+"&id="+options.id;
                                }
                            }

                            break;
                        case 'courseLaunch':
                            self.target = "/opux/viewer/course/"+options.id;
                            break;
                        case 'eventLaunch':
                            self.target = "/opux/viewer/event/"+options.id;
                            break;
                        case 'nuggetLaunch':
                            self.target = "/opux/viewer/nugget/"+options.id;
                            break;
                        case 'skillprofileLaunch':
                            self.target = "/opux/viewer/skillprofile/"+options.id;
                            break;
                        case 'testsetLaunch':
                            self.target = "/opux/viewer/testset/"+options.id;
                            break;
                        case 'activityLaunch':
                            self.target = "/opux/viewer/activity/"+options.id;
                            break;
                        case 'activityList':
                            self.target = "/opux/viewer/activities";
                            break;
                        case 'certificateList':
                            self.target = "/opux/viewer/certificates";
                            break;
                        case 'courseList':
                            self.target = "/opux/viewer/courses";
                            break;
                        case 'courseCatalog':
                            self.target = "/opux/viewer/course/catalog";
                            break;
                        case 'courseRequest':
                            self.target = "/opux/viewer/course/"+options.id+"/request";
                            break;
                        case 'courseLaunch508':
                            self.target = "/opux/viewer/course/"+options.id+"/508";
                            break;
                        case 'eventList':
                            self.target = "/opux/viewer/events";
                            break;
                        case 'eventCalendar':
                            self.target = "/opux/viewer/event/calendar";
                            break;
                        case 'eventCatalog':
                            self.target = "/opux/viewer/event/catalog";
                            break;
                        case 'eventInstructor':
                            self.target = "/opux/viewer/event/instructor";
                            break;
                        case 'eventRegister':
                            self.target = "/opux/viewer/event/"+options.id+"/register";
                            break;
                        case 'forumList':
                            self.target = "/opux/viewer/forums";
                            break;
                        case 'forumLaunch':
                            self.target = "/opux/viewer/forum/"+options.id;
                            break;
                        case 'myProfile':
                            self.target = "/opportal/jsp/admin/show_profile.jsp";
                            break;
                        case 'showHelp':
                            self.target = "/opportal/jsp/help/help.jsp";
                            break;
                        case 'nuggetList':
                            self.target = "/opux/viewer/nuggets";
                            break;
                        case 'nuggetCatalog':
                            self.target = "/opux/viewer/nugget/catalog";
                            break;
                        case 'skillprofileList':
                            self.target = "/opux/viewer/skillprofiles";
                            break;
                        case 'skillprofileCatalog':
                            self.target = "/opux/viewer/skillprofile/catalog";
                            break;
                        case 'skillprofileRequest':
                            self.target = "/opux/viewer/skillprofile/"+options.id+"/request";
                            break;
                        case 'myStatus':
                            self.target = "/opux/viewer/status";
                            break;
                        case 'testsetCatalog':
                            self.target = "/opux/viewer/testset/catalog";
                            break;
                        case 'gameList':
                            self.target = "/opux/viewer/games";
                            break;
                        case 'gameLaunch':
                            self.target = "/opux/viewer/game/"+options.id;
                            break;
                        case 'categoryList':
                            self.target = "/opux/viewer/categories";
                            break;
                        case 'ratings':
                            self.target = "/opux/viewer/ratings";
                            break;
                        case 'logout':
                            self.target = "/opportal/logout.do";
                            break;
                        default:
                            return true;
                            break;
                    }
                } else if (launchCode_keywords.indexOf(options.keyword) > -1){

                    $.ajax({
                        url: 'portal/launchcode_request.jsp?keyword='+options.keyword
                    }).done(function(data){
                        self.launchCode = data.launch_code;
                        self.forwardURL = data.forward_url;
                        self.locale = data.locale;

                        self.target = self.forwardURL + "?spp=" + self.launchCode + "&lang=" + self.locale;

                    });

                }

            } else if (!opui.config.offline) {

                switch (options.keyword) {
                    case 'content':
                        if(options.hasOwnProperty('type') || options.hasOwnProperty('id')) {
                            self.target = "cellcast://" + options.type + "/" + options.id +"/"+options.details;
                        }
                        break;

                    case 'assignments':
                        self.target = "cellcast://menu/assignments";
                        break;
                    case 'required':
                        self.target = "cellcast://menu/required";
                        break;
                    case 'optional':
                        self.target = "cellcast://menu/optional";
                        break;
                    case 'learningPaths':
                        self.target = "cellcast://menu/learningpaths";
                        break;
                    case 'playLists':
                        self.target = "cellcast://menu/playlists";
                        break;
                    case 'networks':
                        self.target = "cellcast://menu/networks";
                        break;
                    case 'blogs':
                        self.target = "cellcast://menu/blogs";
                        break;
                    case 'blogLaunch':
                        self.target = "cellcast://menu/blogs/"+options.id;
                        break;
                    case 'myMedia':
                        self.target = "cellcast://menu/mymedia";
                        break;
                    case 'images':
                        self.target = "cellcast://menu/images";
                        break;
                    case 'video':
                        self.target = "cellcast://menu/video";
                        break;
                    case 'audio':
                        self.target = "cellcast://menu/audio";
                        break;
                    case 'uploadHistory':
                        self.target = "cellcast://menu/uploadhistory";
                        break;
                    case 'menuStatus':
                        self.target = "cellcast://menu/status";
                        break;
                    case 'myStatus':
                        self.target = "cellcast://menu/mystatus";
                        break;
                    case 'deviceStatus':
                        self.target = "cellcast://menu/devicestatus";
                        break;
                    case 'downloadUtility':
                        self.target = "cellcast://menu/downloadutility";
                        break;
                    case 'about':
                        self.target = "cellcast://menu/about";
                        break;
                    case 'settings':
                        self.target = "cellcast://menu/setup";
                        break;
                    case 'myProfile':
                        self.target = "cellcast://menu/myprofile";
                        break;
                    case 'activityStream':
                        self.target = "cellcast://menu/activitystream";
                        break;
                    case 'howToPlay':
                        self.target = "cellcast://menu/howtoplay";
                        break;
                    case 'editProfile':
                        self.target = "cellcast://menu/my_profile";
                        break;
                    case 'activityList':

                        self.target = "cellcast://menu/activitystream";
                        break;
                    case 'certificateList':
                        self.target = "cellcast://action/openapp/opcv/opcv_certificates";
                        break;
                    case 'courseList':
                        self.target = "cellcast://action/openapp/opcv/opcv_courses";
                        break;
                    case 'courseCatalog':
                        self.target = "cellcast://action/openapp/opcv/opcv_catalog";
                        break;
                    case 'courseRequest':
                        self.target = "";
                        break;
                    case 'courseLaunch508':
                        self.target = "";
                        break;
                    case 'eventList':
                        self.target = "";
                        break;
                    case 'eventCalendar':
                        self.target = "cellcast://action/openapp/opcv/eventcalendar";
                        break;
                    case 'eventCatalog':
                        self.target = "cellcast://action/openapp/opcv/event_catalog";
                        break;
                    case 'eventInstructor':
                        self.target = "cellcast://action/openapp/opcv/opcv_eventinstructor";
                        break;
                    case 'eventRegister':
                        self.target = "";
                        break;
                    case 'forumList':
                        self.target = "cellcast://menu/forums";
                        break;
                    case 'forumLaunch':
                        self.target = "cellcast://menu/forums/"+options.id;
                        break;
                    case 'nuggetList':
                        self.target = "cellcast://action/openapp/opcv/nuggets";
                        break;
                    case 'nuggetCatalog':
                        self.target = "cellcast://action/openapp/opcv/nugget_catalog";
                        break;
                    case 'skillprofileList':
                        self.target = "";
                        break;
                    case 'skillprofileCatalog':
                        self.target = "";
                        break;
                    case 'skillprofileRequest':
                        self.target = "";
                        break;
                    case 'myStatus':
                        self.target = "cellcast://action/openapp/opcv/mystatus";
                        break;
                    case 'testsetCatalog':
                        self.target = "cellcast://action/openapp/opcv/testsets_catalog";
                        break;
                    case 'games':
                        self.target = "cellcast://menu/games";
                        break;
                    case 'gameList':
                        self.target = "cellcast://menu/gameprofiles";
                        break;
                    case 'gameLaunch':
                        self.target = "cellcast://menu/gameprofiles/"+options.id;
                        break;
                    case 'categoryList':
                        self.target = "";
                        break;
                    case 'ratings':
                        self.target = "";
                        break;
                    case "opcm":
                        self.target = "cellcast://action/openapp/opcm";
                        break;
                    case "oppm":
                        self.target = "cellcast://action/openapp/oppm";
                        break;
                    case "opdoc":
                        self.target = "cellcast://action/openapp/opdoc";
                        break;
                    case "directory":
                        self.target = "cellcast://action/openapp/opdirectory";
                        break;
                    case "sync":
                        self.target = "cellcast://action/sync";
                        break;
                    case "logout":
                        self.target = "cellcast://action/logout";
                        break;
                    default:
                        return true;
                        break;
                }
            }

            return self.target;
        }

        var launchMixin = {
            launch: function(obj){
                opui.console.log("launch obj", obj);
                self.target = init(obj);
                launchTarget(obj);
            }
        };
        riot.mixin('launch', launchMixin);

        this.launch = function(e){

            launchTarget(opts);
            opui.nav.hideNav();
        }.bind(this)

        init();

});
riot.tag2('opui-menu', '<yield></yield>', '', '', function(opts) {
        var self = this;

        this.navigate = function(e){
            riot.route(e.item.page);
            window.scrollTo(0,0);

        }.bind(this)

        this.tagNavigate = function(e){
            riot.route('pgs/assignments/tags.html');
        }.bind(this)

        function init(){
            self.user_role = opui.store.getItem('environment') ? opui.store.getItem('environment').user_role : 'U';
            self.items = opui.config.menu;
            self.platform = opui.config.platform;
        }

        init();

        self.on('update', function(){
            init();
            self.update();
        });

});
riot.tag2('opui-messages', '<yield></yield>', '', '', function(opts) {
    var self = this;

    var announcements = opui.store.getStore('announcements').filter(function(e){
      return (e.viewed === false);
    }).length;

    var notifications = opui.store.getStore('notifications').filter(function(e){
      return (e.viewed === false);
    }).length;

    var totalunread = notifications + announcements;

    self.announcements = announcements
    self.notifications = notifications
    self.totalunread = totalunread

});
riot.tag2('opui-modal', '<yield></yield><div if="{!opts.hasOwnProperty(\'override\')}" class="modal {show:show}" id="modal-one" aria-hidden="true"><div class="modal-dialog"><div class="modal-header"><h2 riot-tag="raw" content="{header}"></h2><a href="" class="btn-close" aria-hidden="true" onclick="{close}">&times;</a></div><div class="modal-body"><p><raw name="content" content="{body}"></raw></p></div><div class="modal-footer"><a each="{action in actions}" href="" class="btn {action.style}" onclick="{action.fn}"><raw content="{action.label}"></raw></a></div></div></div>', 'opui-modal .btn,[riot-tag="opui-modal"] .btn { background: #428bca; border: #357ebd solid 1px; border-radius: 3px; color: #fff; display: inline-block; font-size: 14px; padding: 8px 15px; text-decoration: none; text-align: center; min-width: 60px; position: relative; transition: color .1s ease; } opui-modal .btn:hover,[riot-tag="opui-modal"] .btn:hover { background: #357ebd; } opui-modal .btn.btn-big,[riot-tag="opui-modal"] .btn.btn-big { font-size: 18px; padding: 15px 20px; min-width: 100px; } opui-modal .btn-close,[riot-tag="opui-modal"] .btn-close { color: #aaaaaa; font-size: 30px; text-decoration: none; position: absolute; right: 5px; top: 0; } opui-modal .btn-close:hover,[riot-tag="opui-modal"] .btn-close:hover { color: #919191; } opui-modal .modal:before,[riot-tag="opui-modal"] .modal:before { content: ""; display: none; background: rgba(0, 0, 0, 0.6); position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; } opui-modal .modal.show:before,[riot-tag="opui-modal"] .modal.show:before { display: block; } opui-modal .modal.show .modal-dialog,[riot-tag="opui-modal"] .modal.show .modal-dialog { -webkit-transform: translate(0, 0); -ms-transform: translate(0, 0); transform: translate(0, 0); top: 20%; } opui-modal .modal-dialog,[riot-tag="opui-modal"] .modal-dialog { background: #fefefe; border: #333333 solid 1px; border-radius: 5px; margin-left: -45%; position: fixed; left: 50%; top: -100%; z-index: 11; width: 90%; -webkit-transform: translate(0, -500%); -ms-transform: translate(0, -500%); transform: translate(0, -500%); -webkit-transition: -webkit-transform 0.3s ease-out; -moz-transition: -moz-transform 0.3s ease-out; -o-transition: -o-transform 0.3s ease-out; transition: transform 0.3s ease-out; } opui-modal .modal-body,[riot-tag="opui-modal"] .modal-body { padding: 20px; } opui-modal .modal-header,[riot-tag="opui-modal"] .modal-header,opui-modal .modal-footer,[riot-tag="opui-modal"] .modal-footer { padding: 10px 20px; } opui-modal .modal-header,[riot-tag="opui-modal"] .modal-header { border-bottom: #eeeeee solid 1px; } opui-modal .modal-header h2,[riot-tag="opui-modal"] .modal-header h2 { font-size: 20px; } opui-modal .modal-footer,[riot-tag="opui-modal"] .modal-footer { border-top: #eeeeee solid 1px; text-align: right; } opui-modal #close,[riot-tag="opui-modal"] #close { display: none; }', '', function(opts) {
        var self = this;

        this.close = function(){
            self.show = false;
            self.update();
        }.bind(this)

        opui.events.subscribe('modal:id', function(id, data){
            if(self.root.id === id){
                console.log(data);
                for (k in data){
                    self[k] = data[k];
                }
                self.show = true;
                self.update();
            }
        })

        opui.events.subscribe('modal', function(obj){

            if(self.show){
                self.show = !self.show;
                self.update();
            }

            if(typeof(obj) === 'object'){

                if(!self.root.id){
                    self.header = obj.header;
                    self.body = obj.body;
                    self.actions = obj.actions;
                    self.show = true;
                    self.update();
                    riot.mount('raw');
                }

            } else {

                if(self.root.id === obj){
                    self.show = true;
                    self.update();
                }
            }
            return true;
        });

}, '{ }');
riot.tag2('opui-notifications', '<yield></yield><ul class="list" if="{!opts.hasOwnProperty(\'override\')}"><li each="{notifications}" class="selectable listings selectionsPg message" data-id="{id}" onclick="{launch}" data-role="cellcast"><div class="columns small-1"><i class="icon-bell"></i></div><div class="columns small-10" style="padding-left:0"><p class="title" data-tmpl="msg_title"><raw content="{title}"></raw></p></div><div class="columns small-1"><i class="icon-caret-right"></i></div><span style="display:none" data-tmpl="msg_text"></span></li><li if="{notifications.length < 1}" data-tmpl="no-items"><div class="columns medium-12"><p class="title">There are no items of this type available at this time.</p></div></li></ul>', '', '', function(opts) {
        var self = this;

        self.notifications = opui.store.getStore('notifications');

        this.launch = function(e){

            console.log(e.item);
            var bodyText =
            opui.events.publish('modal',
                    {
                        header: e.item.title,
                        body: '<opui-partial>' + e.item.text + '</opui-partial>'

                    });
        }.bind(this)

}, '{ }');
riot.tag2('opui-opportal-constant', '<yield></yield>', '', '', function(opts) {
        var self = this;

        function getConstant() {
            if (!opui.config.offline && opui.config.platform == "opux") {

                $.ajax({
                    url: 'portal/constant_request.jsp?keyword=' + opts.keyword
                }).done(function (data) {
                    self.constant = data.constant_requested;

                });

            } else if (opui.config.offline) {
                self.constant = "offline";
            } else if (opui.config.platform != "opux") {
                self.constant = "not opux";
            }
            self.platform = opui.config.platform;

        }

        getConstant();

        self.on('update', function(){

            getConstant();

        });

});
riot.tag2('opui-page', '<yield></yield>', '', '', function(opts) {
        var self = this;
        opts.footer = opts.footer || 'hide';
        if (opts.footer === "show") {
            opui.events.publish('footer','show');

        } else if (opts.footer === "hide") {
            opui.events.publish('footer','hide');

        }

        opui.events.publish('back:path', opts.back ? opts.back : opui.config.home);
        self.back = opts.back;
        self.features = opui.config.features;
        if (opts.foundation) {
            self.on('mount', function(){
                console.log("foundation");
                $(self.root).foundation();
            });
        }

});
riot.tag2('opui-partial', '<yield></yield>', '', '', function(opts) {
        var self = this;

});
riot.tag2('opui-phrase', '<span><raw content="{phrase}"></raw></span>', '', '', function(opts) {
        var self = this;

        if(opui.config.translated && opts.key){
            var phrase = opui.language.keyToPhrase(key);
            if(phrase){
                this.phrase = phrase
            } else {
                this.phrase = '???'+opts.key+'???';
            }
        } else {
            this.phrase = opts.def;
        }

}, '{ }');
riot.tag2('opui-profile', '<yield></yield>', '', '', function(opts) {
        var self = this;

        function init(){
            self.profile = opui.store.getItem('profile');

            if(self.profile){
                self.profile.user_last_name = self.profile.user_name.split(",")[0];
                self.profile.user_first_name = self.profile.user_name.split(",")[1].trim();
            }

            if (typeof self.profile !== 'undefined' && self.profile.avatar_size > 0) {
                self.avatar = self.profile.avatar;
            } else {
                self.avatar = "img/thumbs/user.png";
            }
        }

        init();

        self.on('update', function(){
            console.log('all data returned and all tags updated');
            init();
            self.update();
        });

});
riot.tag2('opui-search', '<yield></yield>', '', '', function(opts) {

        var self = this;
        self.newValue = true;
        self.mixin('launch');
        this.submit = function(e){
            e.preventDefault();

            if(opts.hasOwnProperty('path')){
                riot.route(opts.path + '?query=' + self.term.value);
                return true;
            }
            self.newValue = false;
            self.items = opui.search.term(opts.collection, self.term.value);
        }.bind(this)

        this.clearValue = function(e){
            self.term.value = "";
            self.term.placeholder = "";
            self.items = [];
            self.newValue = true;
            opui.console.log("clearValue");
        }.bind(this)

        this.clearValueonfocus = function(e){
            self.term.value = "";

            opui.console.log("clearValueonfocus");
        }.bind(this)
        this.clearValueonblur = function(e){

            self.term.value = "";
            opui.console.log("clearValueonblur");
        }.bind(this)
        this.assign = function(e){
            opui.console.log('ASSIGN', e.item.item.id);
            if (opui.config.platform == "opux") {
                $.ajax({
                    url: '/opux/api/assign',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "assign": [
                            {
                                "id": e.item.item.id,
                                "type": e.item.item.selectionType
                            }
                        ]
                    }),
                    success: function (status) {
                        opui.console.log('ASSIGN RETURN', status);
                        if (status) {

                            opui.data.typeRequests(e.item.item.selectionType);

                            self.launch({
                                keyword: "content",
                                type: e.item.item.selectionType,
                                id: e.item.item.id
                            });

                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                })
            } else {
                var r = confirm('Would you like to view the selection now?');
                if (r === true) {
                    window.location = 'cellcast://action/assign/' + e.item.item.selectionType + '/' + e.item.item.id + '/true';
                } else {
                    window.location = 'cellcast://action/assign/' + e.item.item.selectionType + '/' + e.item.item.id + '/false';
                }
            }
        }.bind(this)

        if(opts.hasOwnProperty('query') && opts.query != undefined){
            self.term.value = opts.query;
            self.term.placeholder = opts.query;
            self.items = opui.search.term(opts.collection, self.term.value);
        }

        opui.events.subscribe('update:content', function(){
            opui.console.log("update:content", self.term.value);
            self.items = opui.search.term(opts.collection, self.term.value);
            self.update();
        });
        self.on('update', function(){
            opui.console.log("search tag updating", self.term.value);
        });

});
riot.tag2('opui-sp-detail', '<yield></yield>', '', '', function(opts) {
        var self = this;
        if(typeof opts.id !== 'undefined'){
            var skillprofile = opui.store.getContent('skillprofile', opts.id);
            skillprofile.items = opui.tools.getSkillList(parseInt(opts.id));
            self.name = skillprofile.name;

            var course = skillprofile.items.filter(function(item){
              return (item.assignType === 'course')
            })

            self.skillprofile = skillprofile;
            self.course = course[0]
        }
});
riot.tag2('opui-swiper', '<div class="swiper-container"><yield></yield></div><div class="swiper-{opts.id}-next swiper-button-next"><i class="icon-chevron-right"></i></div><div class="swiper-{opts.id}-prev swiper-button-prev"><i class="icon-chevron-left"></i></div>', '', '', function(opts) {
        var self = this;
        var swiper;

        function init() {

            var slidesperview = (opts.hasOwnProperty('slidesperview')) ? opts.slidesperview : 1;
            var nextbutton = (opts.hasOwnProperty('nextbutton')) ? opts.nextbutton : '.swiper-button-next';
            var prevbutton = (opts.hasOwnProperty('prevbutton')) ? opts.prevbutton : '.swiper-button-prev';
            var swipercontainer = (opts.hasOwnProperty('swipercontainer')) ? opts.swipercontainer : '.swiper-container';
            var spacebetween = (opts.hasOwnProperty('spacebetween')) ? opts.spacebetween : 0;
            var autoplay = (opts.hasOwnProperty('autoplay')) ? opts.autoplay : 4000;
            var swiperposition = (opts.hasOwnProperty('swiperposition')) ? opts.swiperposition : 0;

            var width = $(document).width();

            if (width < 641 && width >= 480){
                var slidesperview = 3;
            } else if (width < 480){
                var slidesperview = 2
            }

            if (typeof spacebetween === "string") {
                spacebetween = parseInt(spacebetween);
            }
            if (typeof autoplay === "string") {
                autoplay = parseInt(autoplay);
            }

            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                slidesPerView: slidesperview,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: spacebetween
            });
            self.update();

        }

        this.slidenexttag = function(e){

            var swiperposition = (opts.hasOwnProperty('swiperposition')) ? opts.swiperposition : 0;
            if (typeof swiperposition === "string") {
                swiperposition = parseInt(swiperposition);
            }

            swiper[swiperposition].slideNext();
        }.bind(this)

        self.on('updated', function(){

            if(swiper){
                swiper.update();
            }

        })
        self.on('mount', function(e){
            opui.console.log('opui-swiper mounting');
            init();

        });

        self.on('slidenexttag', function(options){
            opui.console.log(options)
        });
}, '{ }');

riot.tag2('opui-toast', '<div class="toasts {opts.position}" if="{toasts.length > 0}"><div class="toast" each="{toasts}" onclick="{parent.toastClicked}"> {text}<span if="{action}" class="toast-action">{action}</span></div></div>', 'opui-toast .toasts,[riot-tag="opui-toast"] .toasts { position: fixed; max-width: 350px; max-height: 100%; overflow-y: auto; background-color: transparent; z-index: 101; } opui-toast .toasts.topleft,[riot-tag="opui-toast"] .toasts.topleft { top: 0; left: 0; } opui-toast .toasts.topright,[riot-tag="opui-toast"] .toasts.topright { top: 0; right: 0; } opui-toast .toasts.bottomleft,[riot-tag="opui-toast"] .toasts.bottomleft { bottom: 0; left: 0; } opui-toast .toasts.bottomright,[riot-tag="opui-toast"] .toasts.bottomright { bottom: 0; right: 0; } opui-toast .toast,[riot-tag="opui-toast"] .toast { padding: 20px; margin: 20px; background-color: rgba(0, 0, 0, 0.8); color: white; font-size: 13px; cursor: pointer; } opui-toast .toast-action,[riot-tag="opui-toast"] .toast-action { float: right; color: orange; font-weight: bold; margin-left: 25px; }', '', function(opts) {


		var self = this;

		self.toasts = [];

		if (!opts.position) opts.position = 'topright';

		self.toastClicked = function (e) {
			if (e.item.onclick) e.item.onclick(e);
			if (e.item.onclose) e.item.onclose();
			window.clearTimeout(e.item.timer);
			self.toasts.splice(self.toasts.indexOf(e.item), 1);
		};

		opui.events.subscribe('toast', function(obj){
			self.toasts.push(obj);
			self.update();
		});

		self.on('update', function () {
			self.toasts.forEach(function (toast) {
				toast.id = Math.random().toString(36).substr(2, 8);
				if (!toast.timer && !toast.sticky) {
					toast.startTimer = function () {
						toast.timer = window.setTimeout(function () {
							self.toasts.splice(self.toasts.indexOf(toast), 1);
							if (toast.onclose) toast.onclose();
							self.update();
						}, toast.timeout || 6000);
					};
					toast.startTimer();
				}
			});
		});
}, '{ }');

riot.tag2('opui-userinfo', '<yield></yield>', '', '', function(opts) {
        var self = this;
        function init() {
            self.info = opui.store.getItem('environment');
            if (self.info) {
                self.info.user_last_name = self.info.user_name.split(",")[0];
                self.info.user_first_name = self.info.user_name.split(",")[1].trim();
            }
        }
        init();

        self.on('update', function(){
            init();
            self.update();
        });

});
riot.tag2('opui-viewloader', '', '', '', function(opts) {
        var self = this;

        function update(view, params, path){

            if(params.hasOwnProperty('external')){

            } else {

                $.ajax({
                    url: view,
                    success: function(data){

                        var template = Handlebars.compile(data);
                        data = template();
                        self.root.innerHTML = data;

                        $('.enhance').listItems();
                        $('.render').render();

                        opui.console.log('--------------------------VIEWLOADER MOUNTED--------------------------')
                        riot.mount('opui-page', params);

                    }
                });
            }

        }

        riot.route(update);

        opui.events.subscribe('refresh', function(){
            opui.console.log('--------------------------REFRESH EVENT, RIOT UPDATE--------------------------')
            riot.update();
        });

        window.exitPlayer = function(redirect){
            opui.console.log(redirect);

            riot.route(opui.router.routes[opui.router.routes.length-2].url);
            setTimeout(function(){
                opui.data.initialRequests();
            }, 250);

        }

});
riot.tag2('raw', '<span></span>', '', '', function(opts) {
        var self = this;
        self.on('mount update', function() {
            self.root.innerHTML = opts.content || '';
            if(self.root.querySelector('opui-partial')){
                riot.mount(self.root.querySelector('opui-partial'));
            }
        });

});
riot.tag2('mobile-complianceprogresswheel', '<div class="progress-wheel-container columns medium-5"><div class="progress-wheel-inner"><canvas id="chart-area" width="600" height="600"></canvas><div id="legend"></div></div><div class="columns medium-7"><ul class="enhance list indSP" data-collection="assignments" data-subset="skillprofile" data-tags="compliance" data-orderascending="torder" data-rule="exclusive" data-template="{⁗activities⁗:⁗#activity_tmpl⁗, ⁗skillprofiles⁗:⁗#onboarding_skillprofile_tmpl⁗, ⁗dflt⁗:⁗#default_tmpl⁗, ⁗unassigned⁗:⁗#catalog_tmpl⁗}"><li data-tmpl="no-items"><div class="text-block"><p class="title">{{i18n ⁗general_no_items⁗ ⁗There are no items of this type available at this time.⁗}}</p></div></li></ul></div></div>', '', '', function(opts) {
		var polarColors = [
            {
                color: 'rgba(52, 12, 54, 1)',
                background: 'rgba(52, 12, 54, 0.5)',
                highlight: '#f68f51'
            },
            {
                color: "rgba(136, 209, 202, 1)",
                background: "rgba(136, 209, 202, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(238, 99, 33, 1)",
                background: "rgba(238, 99, 33, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(178, 24, 40, 1)",
                background: "rgba(178, 24, 40, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(186, 52, 73, 1)",
                background: "rgba(186, 52, 73, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(90, 35, 78, 1)",
                background: "rgba(90, 35, 78, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(48, 54, 97, 1)",
                background: "rgba(48, 54, 97, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(342, 75, 60, 1)",
                background: "rgba(342, 75, 60, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(172, 6, 52, 1)",
                background: "rgba(172, 6, 52, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(184, 67, 100, 1)",
                background: "rgba(184, 67, 100, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(225, 58, 40, 1)",
                background: "rgba(225, 58, 40, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(129, 50, 76, 1)",
                background: "rgba(129, 50, 76, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(341, 75, 80, 1)",
                background: "rgba(341, 75, 80, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(269, 75, 23, 1)",
                background: "rgba(269, 75, 23, 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(224, 35, 88 , 1)",
                background: "rgba(224, 35, 88 , 0.5)",
                highlight: "#f68f51"
            },
            {
                color: "rgba(333, 76, 92, 1)",
                background: "rgba(333, 76, 92, 0.5)",
                highlight: "#f68f51"
            }
        ]

        function getSkillprofileCollectionProgress (collection){
            var totalItems = 0;
            var completedItems = 0;
            collection.forEach(function(item){
                var t = getSkillprofileProgressValues(item);
                totalItems  += t.total;
                completedItems += t.completed;
            });

            return Math.round((completedItems / totalItems)*100);
        }

        function getSkillprofileProgressValues (skillprofile) {

            var sp = $.parseJSON(JSON.stringify(skillprofile));

            var totalItems = 0;

            var spCompletedItems = 0;

            sp.items.forEach(function(item){
                console.log('type: ' + item.type + ' id: ' + item.id + ' mobile? ' + item.mobile)
                if(item.mobile){
                    totalItems++;
                    var i = assignments.assignments.filter(function(e){
                        return (e.id === item.id && e.assignType === item.type);
                    });

                    if(i.length > 0 && (i[0].status < 3 || i[0].sco_status < 3 || i[0].status === 'Completed')){
                        spCompletedItems++;
                    }
                }
            })

            var progress = Math.round((spCompletedItems / totalItems) * 100);

            return {total: totalItems, completed: spCompletedItems};

        }

        function getSkillprofileProgress (skillprofile) {

            var sp = $.parseJSON(JSON.stringify(skillprofile));

            var totalItems = 0;

            var spCompletedItems = 0;

            sp.items.forEach(function(item){
                console.log('type: ' + item.type + ' id: ' + item.id + ' mobile? ' + item.mobile)
                if(item.mobile){
                    totalItems++;
                    var i = assignments.assignments.filter(function(e){
                        return (e.id === item.id && e.assignType === item.type);
                    });

                    if(i.length > 0 && (i[0].status < 3 || i[0].sco_status < 3 || i[0].status === 'Completed')){
                        spCompletedItems++;
                    }
                }
            })

            var progress = Math.round((spCompletedItems / totalItems) * 100);

            return progress;

        }

        pageLoad.done(function(){

            var chartData = [];
            var data = assignments.assignments.filter(function(assignment){
                return ((assignment.metatags.search('compliance') > -1) && assignment.assignType === 'skillprofile');
            })

            data = orderByTagAscending(data, 'torder');

            data.forEach(function(e,i){

                var segment = {
                    value: getSkillprofileProgress(e),
                    highlight: polarColors[i].highlight,
                    label: e.name,
                    launch_id: e.id,
                    background: polarColors[i].background,
                    color: polarColors[i].color,
                    innerStrokeColor: 'rgba(0, 0, 0, 0)'
                }
                chartData.push(segment);
            });

            var ctx = document.getElementById("chart-area").getContext("2d");
            window.myPolarMax = new Chart(ctx).PolarMax(chartData, {
                responsive:true,
                scaleShowLabelBackdrop: false,
                scaleShowLine: false,
                animation: false,
                animationEasing: 'easeOutBounce',
                animateRotate: false,
                animateScale: false,
                animationSteps: 10,
                scaleShowLabels: false,
                innerRadius: 50,
                segmentStrokeWidth: 4,
                legendTemplate : $('#legend_tmpl').html(),
                tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
                overallProgress: getSkillprofileCollectionProgress(data)
            });
            myPolarMax.update();

            var legend = document.getElementById('legend');
            legend.innerHTML = myPolarMax.generateLegend();

        });
}, '{ }');
