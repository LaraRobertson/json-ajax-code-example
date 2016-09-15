<opui-page>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;
        opts.footer = opts.footer || 'hide';
        if (opts.footer === "show") {
            opui.events.publish('footer','show');
            //console.log ("opts.footer",opts.footer);
        } else if (opts.footer === "hide") {
            opui.events.publish('footer','hide');
            //console.log ("opts.footer",opts.footer);
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
        //$(document).foundation();
        //console.log("back button: ",opts.backbtn);

    </script>
</opui-page>