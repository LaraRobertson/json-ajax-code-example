<opui-messages>
  <yield/>

  <!-- Styles -->

  <!-- Script -->
  <script>
    var self = this;

    var announcements = opui.store.getStore('announcements').filter(function(e){
      return (e.viewed === false);
    }).length;

    var notifications = opui.store.getStore('notifications').filter(function(e){
      return (e.viewed === false);
    }).length;

    var totalunread = notifications + announcements;

    self.announcements = announcements
    self.notifications = notifications
    self.totalunread = totalunread

  </script>
</opui-messages>