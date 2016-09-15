<opui-hierarchy>
    <yield/>

        <!-- Script	-->
        <script>
        var self = this;
        opts.node_id = opts.node_id || 0;
        if(opts.hasOwnProperty('tags')){
            var tags = opts.tags.split(',')
        }

        /* data */
        if(typeof opts.catalog_array !== 'undefined'){
            catalog_array = opts.catalog_array;
        } else if (typeof opui !== 'undefined') {
            catalog_array = opui.store.getStore('assignments').concat(opui.store.getStore('library'));
        }
        if(typeof opts.nodes_array !== 'undefined'){
            nodes_array = opts.nodes_array;
        } else if (typeof opui !== 'undefined') {
            nodes_array = opui.store.getStore('nodes');
        }
        if(typeof opts.games_array !== 'undefined'){
            games_array = opts.games_array;
        } else if (typeof opui !== 'undefined') {
            games_array = opui.store.getStore('games');
        }
        console.log('nodes-array',nodes_array);

        function buildHierarchy(id){
            self.node_id = id;
            console.log(self.node_id);
            /* build children links */
            var childrenCollection = nodes_array.filter(function(node){
                return (node.parent_id == self.node_id);
            });

            console.log('children collection', childrenCollection);
            // sort by sequence
            childrenCollection = opui.tools.sortBySequence(childrenCollection);
            console.log('sorted children collection', childrenCollection);
            self.children = childrenCollection;

            /* build item links */
            var itemCollection = nodes_array.filter(function(node){
                return (node.node_id == self.node_id);
            });
            var content = [];
            if (itemCollection[0] !== undefined) {
                console.log("itemCollection", itemCollection[0]);


                if (itemCollection[0] !== undefined) {
                    if (itemCollection[0].items !== undefined) {
                        // sort by sequence
                        itemCollection[0].items = opui.tools.sortBySequence(itemCollection[0].items);
                        console.log("sorted itemCollection", itemCollection[0].items);
                        itemCollection[0].items.forEach(function (object) {
                            var t = catalog_array.filter(function (e) {
                                return (e.id === object.item_id && (e.assignType === object.item_type.toLowerCase() || e.selectionType === object.item_type.toLowerCase()) );
                            })[0];
                            if (!t && object.item_type === 'course') {
                                var t = catalog_array.filter(function (e) {
                                    return (e.id === object.item_id && (e.assignType === 'scorm' || e.selectionType === 'scorm') );
                                })[0];
                            }
                            if (!t && object.item_type === 'game') {
                                var t = games_array.filter(function (e) {
                                    return (e.game_id === object.item_id);
                                })[0];
                            }
                            if (t) {
                                var t = $.parseJSON(JSON.stringify(t));
                                t.sequence = object.sequence;
                                if (t.hasOwnProperty('assignType')) {
                                    t.status = "assigned";
                                } else {
                                    t.status = "unassigned";
                                }
                                t.obj_type = object.item_type;
                                content.push(t);
                            }
                            /* check assignType ?? */
                            /*var status = checkAssignStatus(object.item_type, object.item_id);*/
                        });
                    }
                }
            }
            console.log('item collection', content);
            self.items = content;

            /* breadcrumbs */
            /* do not display on starting node */
            if (self.node_id != opts.node_id) {
                var breadcrumbs = [];
                /* get parent id */
                var currentNode = nodes_array.filter(function(node){
                    return (node.node_id == self.node_id);
                })[0];
                if (currentNode.parent_id != opts.node_id) {
                    var parentNode = nodes_array.filter(function(node){
                        return (node.node_id == currentNode.parent_id);
                    })[0];
                    var nodeTarget = parentNode.node_id;
                    // not using routing so commented out below target definition
                    //var nodeTarget = "?node_id=" + parentNode.node_id;
                    //var count = opui.breadcrumb.entries.length + 1;
                    var entry = {
                        //count: count,
                        text: parentNode.node_title,
                        target: nodeTarget,
                        data: parentNode
                    };
                    if(entry.text.length > 0 ){
                        breadcrumbs.push(entry);
                    }
                }
                self.node_title = currentNode.node_title;
                self.breadcrumb = breadcrumbs;
            }

            self.update();
        }

        breadcrumbNav(e){
            var item = e.item;
            console.log('breadcrumb item', item);
            //riot.route(item.target);
            buildHierarchy(item.target)
        }

        newNode(e){
            var settings = $.extend(opts, e.item.node_id);
            console.log(settings);
            //buildHierarchy(nodeId);
            opui.events.publish('node:change', e.item);
        }


        opui.events.subscribe('node:change', function(node){
            console.log('Go to node: ' + node.node_id);
            buildHierarchy(node.node_id)
        });


        buildHierarchy(opts.node ? opts.node:0);


        </script>
    <style scoped>
    /* for playground - redundant */
    * {box-sizing: border-box;}
    .center {text-align:center;}
    .hidden {display:none;}
    ul.list li {
    display: table;
    position: relative;
    width: 100%;
    margin: 0 0 10px;
    list-style-type: none;
    }
    ul.list .icon-block {
    display: table-cell;
    position: relative;
    font-size: 1em;
    width: 50px;
    height: 100%;
    vertical-align: middle;
    z-index: 10;
    }
    ul.list li .text-block {
    display: table-cell;
    position: relative;
    padding: 15px;
    width: 100%;
    text-align: left;
    vertical-align: middle;
    font-weight: normal;
    z-index: 9;
    }
    /* end redundant styles */
    #hierarchyContent, .viewWrapper {
    clear: both;
    margin: 0 auto;
    border: 1px solid #aaa;
    border-bottom: 0px;
    display: block;
    }
    #hierarchyContent  ul, .viewWrapper ul {
    padding:0;margin:0;
    }
    #hierarchyContent li, .viewWrapper li {
    list-style: none;
    background-color: #fff;
    padding: 10px;
    border-bottom: 1px solid #aaa;
    margin-bottom:0;
    }
    #hierarchyContent li.browse-title, li.view-title {
    text-transform: uppercase;
    font-size: 1.1em;
    font-weight: bold;
    background: darken(#fff, 10%);
    background-color: #eee;
    position: relative;
    color: #340c36;
    }
    #hierarchyContent li .text-block .title, .viewWrapper li .text-block .title {
        color:#000;
    }
    #hierarchyContent a, .viewWrapper a {
    color: #000;
    }
    #hierarchyContent ul.list .icon-block {
    height: 60%;
    }
    #hierarchyContent ul.list .icon-block > i {
    border-radius: 20px;
    border: 3px solid white;
    width: 30px;
    height: 30px;
    line-height: 25px;

    }
    .viewWrapper {
    background-color: transparent;
    padding: 0;
    margin-top:20px;
    }
    .hidden {display:none;}
    </style>

</opui-hierarchy>