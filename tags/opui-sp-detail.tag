<opui-sp-detail>
    <yield/>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;
        if(typeof opts.id !== 'undefined'){
            var skillprofile = opui.store.getContent('skillprofile', opts.id);
            skillprofile.items = opui.tools.getSkillList(parseInt(opts.id));
            self.name = skillprofile.name;
    //        var durations = [];
    //        var totalduration = 0;
    //
    //        skillprofile.items.forEach(function(item){
    //          durations.push(item.duration)
    //        })
    //
    //        for (var i = 0; i< durations.length; i++) {
    //          totalduration += durations[i];
    //        }

            var course = skillprofile.items.filter(function(item){
              return (item.assignType === 'course')
            })

            self.skillprofile = skillprofile;
            self.course = course[0]
        }
    </script>
</opui-sp-detail>