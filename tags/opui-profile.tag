<opui-profile>
    <yield/>
    <!--<div id="welcomeMessage">

        <div class="welcome">Signed in as:</div>
        <div class="user">
            <div class="avatar" style="background-image: url({avatar? avatar:'img/thumbs/user.png'}); background-repeat: no-repeat; background-position: center center; background-size: contain;" data-role="my_profile">
            </div>
            <p >{profile.user_name}</p>
        </div>

        <div class="loginTime"> Last Login: <span data-replace="lastLogin"></span></div>
    </div>-->


    <script>
        var self = this;

        function init(){
            self.profile = opui.store.getItem('profile');

            if(self.profile){
                self.profile.user_last_name = self.profile.user_name.split(",")[0];
                self.profile.user_first_name = self.profile.user_name.split(",")[1].trim();
            }

            // avatar
            if (typeof self.profile !== 'undefined' && self.profile.avatar_size > 0) {
                self.avatar = self.profile.avatar;
            } else {
                self.avatar = "img/thumbs/user.png";
            }
        }

        init();

        // Listen for refresh event
        self.on('update', function(){
            console.log('all data returned and all tags updated');
            init();
            self.update();
        });

//        opui.events.subscribe('update:store', function(store){
//            if(store === 'environment') {
//                init();
//                self.update();
//            }
//        });

        //console.log('SETTING PROFILE', opui.store.getItem('profile'));


    </script>
</opui-profile>