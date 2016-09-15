<opui-launch>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;

        /*
        * defaults
         */
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

        // available keywords for opux (or calls that require only a url to launch) calls
        var opux_keywords =  ["content","activityList","activityLaunch","certificateList","courseList","courseCatalog","courseLaunch","courseRequest","courseLaunch508","eventList","eventCalendar","eventCatalog","eventInstructor","eventRegister","eventLaunch","forumList","forumLaunch","myProfile","showHelp","nuggetList","nuggetCatalog","nuggetLaunch","skillprofileList","skillprofileCatalog","skillprofileLaunch","skillprofileRequest","myStatus","testsetCatalog","testsetLaunch","gameList","gameLaunch","categoryList","ratings","logout","internalUrl"];

        /*
        * available keywords needing launchcodes from portal/launchcode_request.jsp
         */
        var launchCode_keywords =  ["opcm","oppm","opdoc","directory","announcements"];

        function launchTarget(obj){
            opui.console.log('launchTarget',self.target);
            // options determined by opts or obj
            var options;
            if(obj){
                options = obj;
            } else {
                options = opts;
            }
            //console.log("getTarget", options);
            if (opui.config.platform == "opux") {
                // if self.target == "", then notify user
                // referencing modal in index.html
                if (self.target == "" && !opui.config.offline) {
                    opui.console.log("Keyword, " + opts.keyword + ", does not work.");
//                    opui.events.publish('modal',
//                            {
//                                header: "Sorry. This keyword, " + opts.keyword + ", does not work.",
//                                body: "Please report this issue to your site administrator."
//                            });
                }
                else if (self.target == "" && opui.config.offline) {
                    opui.console.log("You can not launch content with offline data.");
//                    opui.events.publish('modal',
//                            {
//                                header: "Sorry. You can not launch content with offline data.",
//                                body: "Please report this issue to your site administrator."
//                            });
                }
                else {
                    $.ajax({
                        url: '/opux/api/sessionstatus'
                    }).done(function (status) {
                        //console.log('check status before launch');
                        if (status === 'yes') {
                            // session is good, launch
                            //console.log('session is good');
                            if (options.keyword == "logout") {
                                // the confirm is really just for "logout"
                                if (options.hasOwnProperty('confirm')  ) {
                                    //console.log('opts.confirm',opts.confirm);
                                    //console.log('typeof opts.confirm',typeof opts.confirm);
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
                                //Check every .5 seconds to see if window closed, if closed refresh
                                var checkWin = setInterval(function(){
                                    if(t.closed){
                                        opui.data.publish('refresh', {});
                                        opui.console.log("refresh on closed window");
                                        clearInterval(checkWin);
//                                        opui.events.publish('swiper','update');
                                        return;
                                    }
                                }, 500);
                            }

                        } else {
                            // session is expired, popup a message
                            //console.log('session is expired');
                            if (options.keyword === "logout") {
                                // the confirm is really just for "logout"
                                if (options.hasOwnProperty('confirm')  ) {
                                    //console.log('opts.confirm',opts.confirm);
                                    //console.log('typeof opts.confirm',typeof opts.confirm);
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
                //console.log("self.target",self.target);
                //if self.target == "", then notify user
                if (self.target == "") {
                    opui.console.log("Keyword, "+opts.keyword+" is Not Available");
//                    opui.events.publish('modal',
//                            {
//                                header: "Sorry. This Link, "+opts.keyword+" is Not Available",
//                                body: "Please report this issue to your site administrator."
//                            });
                }
                else {
                    window.location = self.target;
                }
            }


        }

        /*
        * Init determines launch target based on tag options OR supplied object
         */
        function init(obj){
            opui.console.log('Launch Tag Init');
            // set variables so that can show/hide based on user_role or platform
            self.user_role = opui.store.getItem('environment') ? opui.store.getItem('environment').user_role : 'U';
            self.platform = opui.config.platform;

            // options determined by opts or obj
            var options;
            if(obj){
                options = obj;
            } else {
                options = opts;
            }
            //console.log("getTarget", options);

            //build target
            self.target = "";
            if (opui.config.platform == "opux" && !opui.config.offline) {
                //check if keyword has an opux call
                //console.log("keyword",options.keyword);
                if (opux_keywords.indexOf(options.keyword) > -1){
                    switch (options.keyword) {
                        case 'content':
                            if(options.hasOwnProperty('type') || options.hasOwnProperty('id')) {
                                if (options.type != "nugget" && options.type != "testset") {
                                    self.target = "/opux/viewer/" + options.type + "/" + options.id;
                                } else {
                                    // Launch using normal portal method
                                    self.target = "/opportal/CustomUiLauncher?type="+options.type+"&id="+options.id; //target: course|nugget|testset|etc
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
                    //console.log("non-opux");
                    $.ajax({
                        url: 'portal/launchcode_request.jsp?keyword='+options.keyword
                    }).done(function(data){
                        self.launchCode = data.launch_code;
                        self.forwardURL = data.forward_url;
                        self.locale = data.locale;
                        //console.log("options.keyword",options.keyword);
                        //console.log("self.launchCode",self.launchCode);
                        self.target = self.forwardURL + "?spp=" + self.launchCode + "&lang=" + self.locale;
                        //self.update();
                    });

                }

            } else if (!opui.config.offline) {
                //cellcast platforms
                switch (options.keyword) {
                    case 'content':
                        if(options.hasOwnProperty('type') || options.hasOwnProperty('id')) {
                            self.target = "cellcast://" + options.type + "/" + options.id +"/"+options.details;
                        }
                        break;
                    //                    case 'courseLaunch':
                    //                        self.target = "cellcast://course/"+options.id+"/"+options.details;
                    //                        break;
                    //                    case 'testsetLaunch':
                    //                        self.target = "cellcast://testset/"+options.id+"/"+options.details;
                    //                        break;
                    //                    case 'activityLaunch':
                    //                        self.target = "cellcast://activity/"+options.id+"/"+options.details;
                    //                        break;
                    //                    case 'nuggetLaunch':
                    //                        self.target = "cellcast://nugget/"+options.id+"/"+options.details;
                    //                        break;
                    //                    case 'eventLaunch':
                    //                        self.target = "";
                    //                        break;
                    //                    case 'skillprofileLaunch':
                    //                        self.target = "cellcast://skillprofile/"+options.id+"/"+options.details;
                    //                        break;
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
                        //                          didn't work; stuck at "loading" on android
                        //                        self.target = "cellcast://menu/activities";
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

        // add mixin so can launch items from other riot tags
        var launchMixin = {
            launch: function(obj){
                opui.console.log("launch obj", obj);
                self.target = init(obj);
                launchTarget(obj);
            }
        };
        riot.mixin('launch', launchMixin);

        launch(e){
            //console.log("Launch(e)");
            launchTarget(opts);
            opui.nav.hideNav();
        }

        // get target on initialization
//        getTarget();
        init();


    </script>
</opui-launch>