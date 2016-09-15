<opui-modal>
    <yield/>
    <div if="{!opts.hasOwnProperty('override')}" class="modal {show:show}" id="modal-one" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-header">
                <h2 riot-tag="raw" content="{header}"></h2>
                <a href="" class="btn-close" aria-hidden="true" onclick="{close}">&times;</a> <!--CHANGED TO "#close"-->
            </div>
            <div class="modal-body">
                <p><raw name="content" content="{body}"></raw></p>
            </div>
            <div class="modal-footer">
                <a each="{action in actions}" href="" class="btn {action.style}" onclick="{action.fn}"><raw content="{action.label}"></raw></a>  <!--CHANGED TO "#close"-->
            </div>
        </div>
    </div>

    <style scoped>
        .btn {
            background: #428bca;
            border: #357ebd solid 1px;
            border-radius: 3px;
            color: #fff;
            display: inline-block;
            font-size: 14px;
            padding: 8px 15px;
            text-decoration: none;
            text-align: center;
            min-width: 60px;
            position: relative;
            transition: color .1s ease;
            /* top: 40em;*/
        }
        .btn:hover {
            background: #357ebd;
        }
        .btn.btn-big {
            font-size: 18px;
            padding: 15px 20px;
            min-width: 100px;
        }
        .btn-close {
            color: #aaaaaa;
            font-size: 30px;
            text-decoration: none;
            position: absolute;
            right: 5px;
            top: 0;
        }
        .btn-close:hover {
            color: #919191;
        }
        .modal:before {
            content: "";
            display: none;
            background: rgba(0, 0, 0, 0.6);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
        }
        .modal.show:before {
            display: block;
        }
        .modal.show .modal-dialog {
            -webkit-transform: translate(0, 0);
            -ms-transform: translate(0, 0);
            transform: translate(0, 0);
            top: 20%;
        }
        .modal-dialog {
            background: #fefefe;
            border: #333333 solid 1px;
            border-radius: 5px;
            margin-left: -45%;
            position: fixed;
            left: 50%;
            top: -100%;
            z-index: 11;
            width: 90%;
            -webkit-transform: translate(0, -500%);
            -ms-transform: translate(0, -500%);
            transform: translate(0, -500%);
            -webkit-transition: -webkit-transform 0.3s ease-out;
            -moz-transition: -moz-transform 0.3s ease-out;
            -o-transition: -o-transform 0.3s ease-out;
            transition: transform 0.3s ease-out;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-header,
        .modal-footer {
            padding: 10px 20px;
        }
        .modal-header {
            border-bottom: #eeeeee solid 1px;
        }
        .modal-header h2 {
            font-size: 20px;
        }
        .modal-footer {
            border-top: #eeeeee solid 1px;
            text-align: right;
        }
        /*ADDED TO STOP SCROLLING TO TOP*/
        #close {
            display: none;
        }

    </style>


    <script>
        var self = this;

        close(){
            self.show = false;
            self.update();
        }

        opui.events.subscribe('modal:id', function(id, data){
            if(self.root.id === id){
                console.log(data);
                for (k in data){
                    self[k] = data[k];
                }
                self.show = true;
                self.update();
            }
        })

        opui.events.subscribe('modal', function(obj){

            // close all open modals
            if(self.show){
                self.show = !self.show;
                self.update();
            }

            // if object then assume default modal
            if(typeof(obj) === 'object'){
//                console.log('ID not specified');
                if(!self.root.id){
                    self.header = obj.header;
                    self.body = obj.body;
                    self.actions = obj.actions;
                    self.show = true;
                    self.update();
                    riot.mount('raw');
                }
                // otherwise assume calling predefined modal
            } else {
//                console.log('ID is specified', obj);
//                console.log('root id', self.root.id);
                // in case of multiple modal tag instances, make sure id's match
                if(self.root.id === obj){
                    self.show = true;
                    self.update();
                }
            }
            return true;
        });

    </script>

</opui-modal>