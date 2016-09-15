<opui-announcements>
    <yield/>

    <!-- Default template -->
    <ul class="list" if={!opts.hasOwnProperty('override')}>
        <li each="{announcements}" class="selectable listings selectionsPg message" data-id="{id}" onclick="{parent.launch}">
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
        <li if="{announcements.length < 1}" data-tmpl="no-items">
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
         Announcement properties
        {
            "id": 2,
            "start_date": "2014-06-15 08:00:00",
            "end_date": "2014-06-30 17:00:00",
            "title": "Test Announcement",
            "text": "This is a simple test announcement",
            "author": "Administrator OnPoint",
            "urgent": false
        }
         */

        self.announcements = opui.store.getStore('announcements');

        launch(e){
//            riot.route('/pgs/messages/read.html?id='+ e.item.id, {id: e.item.id});
            console.log(e.item);
            var decodedText = decodeURIComponent(e.item.text);
            console.log("decodedText", decodedText);
            opui.events.publish('modal',
                    {
                        header: e.item.title,
                        body: '<opui-partial>' + e.item.text + '</opui-partial>'
                    });
        }

    </script>
</opui-announcements>