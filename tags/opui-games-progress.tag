<opui-games-progress>
    <yield/>

	<script>
    var self = this;
    var gamesCollection = opui.store.getStore('games');
    var profile = opui.store.getItem('profile');
    var total_points = 0;
    var game_points = 0;

    //console.log("games",gamesCollection);
    //console.log("profile",profile);

    // avatar
    if (typeof profile !== 'undefined' && profile.avatar_size > 0) {
        self.avatar = profile.avatar;
    } else {
        self.avatar = "img/thumbs/user.png";
    }

    // total_points and game_points
    gamesCollection.forEach(function(object){
        total_points += parseInt(object.user_points);
        game_points += object.game_points;
    });

    // percent_complete
    if(total_points === 0 && game_points === 0){
        self.percent_complete = '0%';
    } else {
        var percent = Math.floor((total_points / game_points) * 100) ? Math.floor((total_points / game_points) * 100) : 0;
        if(percent > 100){
            self.percent_complete = '100%';
        } else {
            self.percent_complete = percent+'%';
        }
    }
    //console.log(self.percent_complete);
    self.games = gamesCollection;
    self.profile = profile;
    self.total_points = total_points;
    self.game_points = game_points;
    //self.point_difference = point_difference;

	</script>
</opui-games-progress>