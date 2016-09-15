<opui-footer>
    <yield/>

    <script>
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

    </script>

</opui-footer>