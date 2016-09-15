(function(opui, riot){


    opui.getConfig().done(function(){
        for(var module in opui){
            if(typeof(opui[module].init) === 'function'){
                opui[module].init();
            }
        }
        opui.bootstrap.start();
    }).fail(function(){
        for(var module in opui){
            if(typeof(opui[module].init) === 'function'){
                opui[module].init();
            }
        }
        opui.bootstrap.start();
    });

}(window.opui = window.opui || {}, riot));