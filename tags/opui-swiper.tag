<opui-swiper>
    <div class="swiper-container">
        <!-- Additional required wrapper -->

        <!-- Slides -->
        <yield/>
        <!-- If we need pagination-->
        <!--<div if={opts.hasOwnProperty('paginate')} class="swiper-pagination"></div>-->

        <!-- If we need navigation buttons -->
        <!--<div class="swiper-{opts.id}-prev swiper-button-prev swiper-button-purple">  </div>-->
        <!--<div class="swiper-{opts.id}-next swiper-button-next swiper-button-purple">  </div>-->

        <!-- If we need scrollbar
        <div if={opts.hasOwnProptery('scrollbar')} class="swiper-scrollbar"></div> -->
    </div>
    <div class="swiper-{opts.id}-next swiper-button-next"><i class="icon-chevron-right"></i></div>
    <div class="swiper-{opts.id}-prev swiper-button-prev"><i class="icon-chevron-left"></i></div>

    <script>
        var self = this;
        var swiper;

        function init() {

//      defaults
            var slidesperview = (opts.hasOwnProperty('slidesperview')) ? opts.slidesperview : 1;
            var nextbutton = (opts.hasOwnProperty('nextbutton')) ? opts.nextbutton : '.swiper-button-next';
            var prevbutton = (opts.hasOwnProperty('prevbutton')) ? opts.prevbutton : '.swiper-button-prev';
            var swipercontainer = (opts.hasOwnProperty('swipercontainer')) ? opts.swipercontainer : '.swiper-container';
            var spacebetween = (opts.hasOwnProperty('spacebetween')) ? opts.spacebetween : 0;
            var autoplay = (opts.hasOwnProperty('autoplay')) ? opts.autoplay : 4000;
            var swiperposition = (opts.hasOwnProperty('swiperposition')) ? opts.swiperposition : 0;
            //console.log("swipercontainer:",swipercontainer);
            //console.log("slidesPerView:",slidesperview);
            //console.log("nextbutton:",nextbutton);
            //console.log("prevbutton:",prevbutton);
            //console.log("spacebetween:",spacebetween);
            // setting slide size on initialization
            var width = $(document).width();
            //console.log("width",width);
            if (width < 641 && width >= 480){
                var slidesperview = 3;
            } else if (width < 480){
                var slidesperview = 2
            }


            if (typeof spacebetween === "string") {
                spacebetween = parseInt(spacebetween);
            }
            if (typeof autoplay === "string") {
                autoplay = parseInt(autoplay);
            }
            //console.log("autoplay:",autoplay);
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                slidesPerView: slidesperview,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: spacebetween
            });
            self.update();

        }

        slidenexttag(e){
            //console.log("opts:",this.opts);
            var swiperposition = (opts.hasOwnProperty('swiperposition')) ? opts.swiperposition : 0;
            if (typeof swiperposition === "string") {
                swiperposition = parseInt(swiperposition);
            }
            //console.log(swiperposition);
            swiper[swiperposition].slideNext();
        }


        self.on('updated', function(){
			//console.log('Swiper#'+ opts.id + ' updating');
            if(swiper){
                swiper.update();
            }

        })
        self.on('mount', function(e){
            opui.console.log('opui-swiper mounting');
            init();

        });
        // set up channel in opui-assignments
//        opui.events.subscribe('swiper', function(obj){
//            opui.console.log("swiper on listen: ",swiper)
//            if (obj === "update") {
//                opui.console.log("swiper channel");
//                init();
//            }
//            return true;
//        });
        //init();
        self.on('slidenexttag', function(options){
            opui.console.log(options)
        });
    </script>
</opui-swiper>
