<opui-fourms>
    <yield/>
    <ul class="list">

      <li each={items} class="selectable">
        <a href="/opux/viewer/forum/{id}">
          <div class="text-block">
            <p class="title" style="font-weight:bold">{name}</p>
          </div>
        </a>
      </li>

      <!-- IF NO ITEMS -->
      <li if="{empty}">
        <div class="text-block">
          <p class="title">There are no items of this type available at this time.</p>
        </div>
      </li>

    </ul>

    <!-- Styles -->

    <!-- Script -->
    <script>
        var self = this;

        self.fourms = opui.store.getItem('forumlist');

    </script>
</opui-fourms>