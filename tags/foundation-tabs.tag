<foundation-tabs>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
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

    </script>
</foundation-tabs>