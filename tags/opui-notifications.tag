<opui-notifications>
    <yield/>

    <!-- Default template -->
    <ul class="list" if={!opts.hasOwnProperty('override')}>
        <li each="{notifications}" class="selectable listings selectionsPg message" data-id="{id}" onclick="{launch}"  data-role="cellcast">
          <div class="columns small-1">
            <i class="icon-bell"></i>
          </div>
          <div class="columns small-10" style="padding-left:0">
            <p class="title" data-tmpl="msg_title"><raw content="{title}"></raw></p>
          </div>
          <div class="columns small-1">
            <i class="icon-caret-right"></i>
          </div>
          <span style="display:none" data-tmpl="msg_text"></span>
        </li>
      <li if="{notifications.length < 1}" data-tmpl="no-items">
        <div class="columns medium-12">
          <p class="title">There are no items of this type available at this time.</p>
        </div>
      </li>
    </ul>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;

        /**
         *
         Notifications properties
        {
            "id": 58,
            "date": "2014-06-19 10:03:42",
            "title": "Test Title #3",
            "text": "Three message three message three message",
            "viewed": false
        }
         */

        self.notifications = opui.store.getStore('notifications');

        launch(e){
//            riot.route('pgs/messages/read.html?id='+ e.item.id, {id: e.item.id});

            console.log(e.item);
            var bodyText =
            opui.events.publish('modal',
                    {
                        header: e.item.title,
                        body: '<opui-partial>' + e.item.text + '</opui-partial>'
//                        actions:[{
//                            label:'Mark Read',
//                            fn:function(){
//                                $.ajax({
//                                    url: '/opux/api/notifyaction',
//                                    data: {
//                                        "action": [{
//                                            "id": e.item.id,
//                                            "viewed": true
//                                        }]
//                                    }
//                                });
//                            }
//                        }]
                    });
        }

    </script>
</opui-notifications>