<opui-phrase>
    <span><raw content="{phrase}"></raw></span>

    <script>
        var self = this;

        if(opui.config.translated && opts.key){
            var phrase = opui.language.keyToPhrase(key);
            if(phrase){
                this.phrase = phrase
            } else {
                this.phrase = '???'+opts.key+'???';
            }
        } else {
            this.phrase = opts.def;
        }

    </script>
</opui-phrase>