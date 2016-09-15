<raw>
    <span></span>
    <script>
        var self = this;
        self.on('mount update', function() {
            self.root.innerHTML = opts.content || '';
            if(self.root.querySelector('opui-partial')){
                riot.mount(self.root.querySelector('opui-partial'));
            }
        });

    </script>

</raw>