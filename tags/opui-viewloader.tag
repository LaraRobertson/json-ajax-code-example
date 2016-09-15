<opui-viewloader>

    <script>
        var self = this;

        function update(view, params, path){
//            console.log('Update view', view);
//            console.log('Update params', params);
            if(params.hasOwnProperty('external')){

//                var player = $('<iframe/>').attr({
//                    height: '100%',
//                    width: '100%',
//                    scrolling: 'auto',
//                    src: path + '&hide_menu=true',
//                    id: 'opmcv-player'
//                }).css({
//                    left: 0,
//                    right: 0,
//                    bottom: 0,
//                    height: '93vh',
//                    'background-color': '#333'
//                });
//
//                self.root.innerHTML = $('<div/>')
//                        .attr('id', 'opmcv')
//                        .append(player)
//                        .html();
//                opui.events.publish('mode:opmcv');
//                $('[data-role="wrapper-content"]').css({top:'7vh'});
//                $('opui-viewloader').css({'padding-bottom':0});
//                $('footer').addClass('hide');
//                $('header').addClass('hide');
//                $('#play-header').removeClass('hide');

//                self.root = '<iframe width="100%" height="100%" src="'+path+'"></iframe>';
            } else {
//                if($('header').hasClass('hide')){
//                    $('[data-role="wrapper-content"]').css({top:'70px'});
//                    $('opui-viewloader').css({'padding-bottom':'40px'});
//                    $('header').removeClass('hide');
//                    $('#play-header').addClass('hide');
//                }
//                if($('footer').hasClass('hide')){
//                    $('footer').removeClass('hide');
//                }
                $.ajax({
                    url: view,
                    success: function(data){
                        // Compile Handlebars
                        var template = Handlebars.compile(data);
                        data = template();
                        self.root.innerHTML = data;

                        // Execute Render and Enhance Listing
                        $('.enhance').listItems();
                        $('.render').render();

                        opui.console.log('--------------------------VIEWLOADER MOUNTED--------------------------')
                        riot.mount('opui-page', params);


                    }
                });
            }

        }

        riot.route(update);

        opui.events.subscribe('refresh', function(){
            opui.console.log('--------------------------REFRESH EVENT, RIOT UPDATE--------------------------')
            riot.update();
        });

        window.exitPlayer = function(redirect){
            opui.console.log(redirect);
//            history.back();
            riot.route(opui.router.routes[opui.router.routes.length-2].url);
            setTimeout(function(){
                opui.data.initialRequests();
            }, 250);

        }

    </script>

</opui-viewloader>