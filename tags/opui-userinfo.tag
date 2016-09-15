<opui-userinfo>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;
        function init() {
            self.info = opui.store.getItem('environment');
            if (self.info) {
                self.info.user_last_name = self.info.user_name.split(",")[0];
                self.info.user_first_name = self.info.user_name.split(",")[1].trim();
            }
        }
        init();
        // Listen for refresh event
        self.on('update', function(){
            init();
            self.update();
        });
        //console.log(self.info)
    </script>
</opui-userinfo>