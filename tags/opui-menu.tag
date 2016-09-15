<opui-menu>
    <yield/>

    <script>
        var self = this;

        navigate(e){
            riot.route(e.item.page);
            window.scrollTo(0,0);
//            opui.events.publish('page:change', {url:url, params:params});
        }

        tagNavigate(e){
            riot.route('pgs/assignments/tags.html');
        }

        // Initialization function
        function init(){
            self.user_role = opui.store.getItem('environment') ? opui.store.getItem('environment').user_role : 'U';
            self.items = opui.config.menu;
            self.platform = opui.config.platform;
        }

        // Call initialization function
        init();

        // Listen for refresh event
        self.on('update', function(){
            init();
            self.update();
        });


    </script>
</opui-menu>