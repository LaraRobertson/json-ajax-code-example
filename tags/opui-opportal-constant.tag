<opui-opportal-constant>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;

        /*
        * get needed constant
         */

        function getConstant() {
            if (!opui.config.offline && opui.config.platform == "opux") {
                //opui.console.log("getConstant", opts.keyword);
                $.ajax({
                    url: 'portal/constant_request.jsp?keyword=' + opts.keyword
                }).done(function (data) {
                    self.constant = data.constant_requested;
                    //console.log("data",data);
                });

            } else if (opui.config.offline) {
                self.constant = "offline";
            } else if (opui.config.platform != "opux") {
                self.constant = "not opux";
            }
            self.platform = opui.config.platform;
            //console.log("self.constant",self.constant);
        }

        getConstant();

        // Listen for refresh event
        self.on('update', function(){
            //console.log("opui-opportal-variables updating");
            getConstant();
            //self.update();
        });

    </script>
</opui-opportal-constant>