<opui-back>
    <yield/>

    <!-- Script -->
    <script>
        var self = this;

        self.show = false;

        goback(e){
            //riot.route(self.url);
            //console.log("riot:path", opts.back);

            if (self.url === undefined) {
                //console.log("undefined");
                if (!opts.back) {
                    opts.back  = opui.config.home
                }
                //console.log("opts.back", opts.back);
                riot.route(opts.back);
            } else {
                riot.route(self.url);
            }
        };

        opui.events.subscribe('back:path', function(url){
            //console.log("back:path", url);
            self.url = url;
            self.update();
        });

        opui.events.subscribe('page:change', function(obj){
            //console.log('what is the path?');
            //console.log(obj.url + ':' + opui.config.home);
            if(obj.url != opui.config.home){
                self.show = true;
                self.update();
            } else {
                self.show = false;
                self.update();
            }
        });

    </script>
</opui-back>