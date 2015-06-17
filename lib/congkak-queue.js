 var CongkakQueue = (function(){
    return {
        counter: 0,
        inProcess: false,
        delay: 500,   // ms
        queue: [],
        finishCallbacks: [],

        add: function(fn){
            this.queue.push(fn);
            return this;
        },

        onFinish: function(fn){
            this.finishCallbacks.push(fn);
            return this;
        },

        clearQueue: function(fn){
            this.counter = 0;
            this.queue = [];
            this.finishCallbacks = [];
            return this;
        },

        run: function(clearQueue){
            var i = 0;
            this.inProcess = true,
            queueLength = this.queue.length;
            for ( ; i<queueLength ; i++) {
                var fn = function(){
                    this.queue[this.counter](this.counter);
                    this.counter++;
                    // when finished
                    if (this.counter>=queueLength) {
                        for (var j=0 ; j < this.finishCallbacks.length ; j++ ) {
                            this.finishCallbacks[j]();
                        }
                        this.inProcess = false;
                        if (clearQueue) {
                            this.clearQueue();
                        }
                    }
                }.bind(this);
                 setTimeout(fn, this.delay*i);
            }
            return this;
        },

    };

}());
