/*
Copyright (C) 2015, Hasan Hameed

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies,
either expressed or implied, of the FreeBSD Project.

 *
 * Required by CongkakView to push items in a loop
 *
 * @author Hasan Hameed <haasan.hameed07@gmail.com>
 * @created 01-06-2015
 */
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
