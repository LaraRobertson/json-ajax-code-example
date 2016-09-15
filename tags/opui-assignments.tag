<opui-assignments>
    <!--
     * OPUI Standard Tag: 'opui-assignments'
     * version 1.0
     -->
    <!-- <span>Render time (ms): {duration}</span> -->
    <yield/>



    <!-- Styling -->
    <style>
        
    </style>
    


    <!-- Script -->
    <script>
        var self = this;
        self.imgpath = opui.config.imgpath;
        function run(options){
            //console.log("options",options);
            self.empty = false;
            var collection = opui.tools.process(options);
            collection = opui.tools.filter(options, collection);

            if (collection === null || collection.length < 1) {
                opui.console.log('collection is null');
                self.empty = true;
                self.items = collection;
                //return true;
            } else {
                // process skillprofiles
                    collection.forEach(function (item) {
                        if (item.assignType === "skillprofile" || item.selectionType === "skillprofile") {
                            //console.log('skillprofile', item);
                            if (item.items.length > 0) {
                                item.items = opui.tools.getSkillList(item.id);
                                var count = 0;
                                item.items.forEach(function (e) {
                                    //console.log("skillprofile items",e);
                                    // make sure assigned?
                                    var spItem = opui.store.getStore('assignments').filter(function (x) {
                                        return (x.id === e.id && x.assignType === e.assignType);
                                    })[0];
                                    //console.log("spItem",spItem);
                                    if (spItem) {
                                        //console.log('spItem.status', spItem.status);
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
                //console.log('total items',opts['totalitems'])
                var totalitems = parseInt(opts['totalitems']);
                self.items = collection.slice(0,totalitems);
            }

            opui.console.log("opui-assignments3",self.items);
            // set channel for swiper
            //opui.events.publish('swiper','update');
        }

        self.on('update', function(){
            opui.console.log('opui-assignments updating');
            run(opts);
            //self.update();
        });

        self.on('mount', function(){
            opui.console.log('opui-assignments mounting');
        });

        assign(e){
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
                        //run content requests
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
                        // set up launchObject (see documentation for opui-launch.tag for details about accepted values)
//                        self.launch({
//                            keyword: "content",
//                            type: e.item.item.selectionType,
//                            id:     e.item.item.id
//                        });
                        //riot.route('/opmcv/'+ e.item.item.selectionType+'?id='+ e.item.item.id+'&external');

                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus);
                }
            })
        }


//        app.on('refresh', function(){
//            self.update();
//        });

//        assign(e){
//            var r = confirm('Download and play now?');
//            window.location = 'cellcast://action/assign/' + e.item.selectionType + '/' + e.item.id + '/' + r;
//            library.model.trigger('assignItem', e.item.selectionType, e.item.id);
//        }
//
//        launch(e){
//            // opui.console.log(opts)
//            if(opts.hasOwnProperty('details')){
//                riot.route('assignments/details.html?type=' + e.item.assignType + '&id=' + e.item.id);
//                riot.route('assignments/details.html?type=' + e.item.assignType + '&id=' + e.item.id);
//            } else {
//                assignments.model.trigger('updateItem', e.item.assignType, e.item.id, {
//                    status: 8
//                });
//                window.location = 'cellcast://'+e.item.assignType+'/'+e.item.id;
//            }
//
//        }

        run(opts);

    </script>
</opui-assignments>