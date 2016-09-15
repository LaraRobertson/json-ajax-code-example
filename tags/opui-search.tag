<opui-search>
    <yield/>


    <script>
        /**
         * OPUI Search tag
         * Requires that an input have a "name" value of "term"
         * i.e. <input name="term"/>
         * Other Options are "path" which is only included when the
         * search term will be passed along to an actual search
         * page where it will be prefilled and searched upon immediately
         */
        var self = this;
        self.newValue = true;
        self.mixin('launch');
        submit(e){
            e.preventDefault();
            //console.log('QUERY', self.term.value);
            if(opts.hasOwnProperty('path')){
                riot.route(opts.path + '?query=' + self.term.value);
                return true;
            }
            self.newValue = false;
            self.items = opui.search.term(opts.collection, self.term.value);
        }

        clearValue(e){
            self.term.value = "";
            self.term.placeholder = "";
            self.items = [];
            self.newValue = true;
            opui.console.log("clearValue");
        }

        clearValueonfocus(e){
            self.term.value = "";
//            self.items = [];
            opui.console.log("clearValueonfocus");
        }
        clearValueonblur(e){
//            self.items = [];
            self.term.value = "";
            opui.console.log("clearValueonblur");
        }
        assign(e){
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
                            //run content requests
                            opui.data.typeRequests(e.item.item.selectionType);
                            // set up launchObject (see documentation for opui-launch.tag for details about accepted values)
                            self.launch({
                                keyword: "content",
                                type: e.item.item.selectionType,
                                id: e.item.item.id
                            });
                            //riot.route('/opmcv/'+ e.item.item.selectionType+'?id='+ e.item.item.id+'&external');

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
        }


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

    </script>
</opui-search>