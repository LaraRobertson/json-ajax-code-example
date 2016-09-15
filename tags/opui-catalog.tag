<opui-catalog> 
    <!--
     * OPUI Standard Tag: 'opui-catalog'
     * version 1.0
     -->
    <!-- <span>Render time (ms): {duration}</span> -->
    <yield/>
    <ul if="{!opts.hasOwnProperty('override')}" class="list limit-width break">

        <li each={items} class="selectable"> 

            <a href="#" if={selectionType} onclick={parent.assign}>
                <div class="img-block"> 
                    <img src="" data-tmpl="thumb" onerror="this.onerror=null; this.src='img/thumbs/sample.png';"> 
                </div> 
                <div class="text-block"> 
                    <p class="title" data-tmpl="title" style="font-weight:bold">{name}</p>
                    <p class="desc" data-tmpl="description">{description}</p>
                </div> 

                <div class="icon-block"> 
                    <i data-tmpl="status-completion" class="">{status}</i> 
                    <i data-tmpl="status-test"></i> 
                </div> 
            </a>

            <a href="#" if={assignType} onclick={parent.launch}>
                <div class="img-block"> 
                    <img src="" data-tmpl="thumb" onerror="this.onerror=null; this.src='img/thumbs/sample.png';"> 
                </div> 
                <div class="text-block"> 
                    <p class="title" data-tmpl="title" style="font-weight:bold">{name}</p>
                    <p class="desc" data-tmpl="description">{description}</p>
                </div> 

                <div class="icon-block"> 
                    <i data-tmpl="status-completion" class="">{status}</i> 
                    <i data-tmpl="status-test"></i>
                </div> 
            </a>

        </li> 

    </ul> 

    <!-- Styling -->
    <style>
        
    </style>


    <!-- Script -->
    <script>
    var self = this;

        //var start = new Date();
        var self = this;
        /* added empty lnr */
        self.empty = false;

    self.on('launch', function(options){
        opui.console.log(options)
    });
    self.on('update', function(e){
        opui.console.log('opui-catalog updating');
    });

    self.on('mount', function(e){
        opui.console.log('opui-catalog mounting');
    });
    function run(options){
        var collection = opui.tools.process(options);
        collection = opui.tools.filter(options, collection);

        if (collection === null || collection.length < 1) {
            opui.console.log('collection is null');
            self.empty = true;
            return true;
        }
        collection = opui.tools.sorting(options, collection);
            if (collection === null || collection.length < 1) {
            opui.console.log('collection is null');
            self.empty = true;
            return true;
        }
        self.items = collection;
    }
    //function run(opts){
    //self.items = catalog.model;

           // if(opts.subset){
            //        collection = collection.filter(function(item){
           //         return (item.assignType === opts.subset || item.selectionType === opts.subset);
            //    });
           // }

            // processed in opui.tools.filter
    //if(opts.tags){
      //          var tags = opts.tags.split('|');
    //collection = opui.tools.queryByTags(collection, tags, 'exclusive');
            //}

            //if(opts.hide){
            //    var filters = opts.hide.split('|');
    //collection = filterByTags(collection, filters);
           // }

            //if(opts.status){
                //if (opts.status == 'not-attempted') {
    //collection = notAttemptedItems(self.items);
                //};

                //if (opts.status == "incomplete") {
    //collection = incompleteItems(self.items);
               // };

                //if (opts.status == "complete") {
    //collection = completedItems(self.items);
                //};

                //if (opts.status == 'all-incomplete') {
                 //   var items = [];
                ///    incompleteItems(collection).forEach(function(item){
                //        items.push(item);
                //    });
                //    notAttemptedItems(collection).forEach(function(item){
                //        items.push(item);
                //    });
               //     collection = items;
               // };
            //}

            //if(opts.sort == "alpha"){
                //collection = sortName(self.items);
           // }


  //      };


        assign(e){
            var r = confirm('Download and play now?');
            window.location = 'cellcast://action/assign/' + e.item.selectionType + '/' + e.item.id + '/' + r;
            library.model.trigger('assignItem', e.item.selectionType, e.item.id);
        }

        launch(e){
            opui.console.log(opts)
            if(opts.hasOwnProperty('details')){
                riot.route('assignments/details.html?type=' + e.item.assignType + '&id=' + e.item.id);
            } else {
                assignments.model.trigger('updateItem', e.item.assignType, e.item.id, {
                    status: 8
                });
                window.location = 'cellcast://'+e.item.assignType+'/'+e.item.id;
            }

        }
        //var end = new Date();
        //self.duration = Math.abs(start-end);
    run(opts);
    </script>
</opui-catalog>