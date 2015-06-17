var CongkakView = (function(Queue){
    
    function _getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    var view;
    view = {
        container: '#congkak',
        player1Text: 'Player 1',
        player2Text: 'Player 2',
        isPlayerComputer: false,
        moveOfP2: false,

        chooseOpponent: function(fnChooseOpponent){
            
            swal({
                title: "Choose game type",  
                text: "Who do you wanna play with?",   
                type: "info",   
                cancelButtonText: "Computer",
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                cancelButtonColor: "#6FD4DB",   
                confirmButtonText: "Human",   
                closeOnConfirm: false,   
                closeOnCancel: false
            }, 
            function(isHuman){
                if (!isHuman) {
                    view.player2Text = 'Computer';
                    view.isPlayerComputer = true;
                    swal({
                      title: 'Type your name',
                      text: 'Player 1',
                      type: "input",
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#FBB364",
                      closeOnConfirm: false
                    },
                    function(inputPlayer1Name) {
                        if (inputPlayer1Name === false) 
                            return false;      
                        if (inputPlayer1Name === "") {     
                            swal.showInputError("You need to write your name.");     
                            return false;
                        }
                        swal.close();
                        view.player1Text = inputPlayer1Name;
                        fnChooseOpponent(isHuman);
                    });
                }
                else {
                     swal({
                      title: 'Type your name',
                      text: 'Player 1',
                      type: "input",
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#FBB364",
                      closeOnConfirm: false
                    }, 
                    function(inputPlayer1Name) {
                        if (inputPlayer1Name === false) 
                            return false;      
                        if (inputPlayer1Name === "") {     
                            swal.showInputError("You need to write your name.");     
                            return false;
                        }
                        view.player1Text = inputPlayer1Name;
                        swal({
                          title: 'Type your name',
                          text: 'Player 2',
                          type: "input",
                          confirmButtonText: "Ok",
                          confirmButtonColor: "#B0E380",
                          closeOnConfirm: false
                        },
                        function(inputPlayer2Name) {

                            if (inputPlayer2Name === false) 
                                return false;      
                            if (inputPlayer2Name === "") {     
                                swal.showInputError("You need to write your name.");     
                                return false;
                            }
                            swal.close();
                            view.player2Text = inputPlayer2Name;
                            fnChooseOpponent(isHuman);
                        });
                    });
                }
            });

        },

        make: function(length, elem, housesP1, housesP2, storeHouseP1, storeHouseP2){
            this.container = elem;
            $(this.container).html ('<div class="text-p2">'+this.player1Text+'</div><div class="congkak"> \
                                      <div class="storehouse-p1">'+storeHouseP1+'</div> \
                                    	<div class="houses"> \
                                    		<div class="housesP2"></div> \
                                    		<div class="housesP1"></div> \
                                    	</div> \
                                    	<div class="storehouse-p2">'+storeHouseP2+'</div></div><div class="text-p1">'+this.player2Text+'</div>');
            for (var i=1; i<=length ; i++) {
                $(this.container+' .housesP1').append('<div onclick="Congkak.moveP1('+(i-1)+', this)" class="house house-p1-'+(i-1)+'">'+housesP1[i-1]+'</div>');
                $(this.container+' .housesP2').append('<div onclick="Congkak.moveP2('+(i-1)+', this)" class="house house-p2-'+(i-1)+'">'+housesP2[i-1]+'</div>');
            }

        },

        update: function(elem, index, val){
            if (index!=='')
                index = '-'+ index;
            var player2 = (this.moveOfP2)? ' player2' : '';
            var fn = function(i){
                $(this.container+' .fade').removeClass('fade'+player2);
                $(this.container+' .'+elem+index).addClass('fade'+player2);
                $(this.container+' .'+elem+index).text(val);
                //console.log(this.container+' .'+elem+index);
            }.bind(this);
            Queue.add(fn);
        },

        markHouseBurnt: function(elem, index){
            index = '-'+ index;
            var fn = function(i){
                $(this.container+' .fade').removeClass('fade');
                $(this.container+' .'+elem+index).addClass('fade burnt');
                $(this.container+' .'+elem+index).text('x');
                //console.log(this.container+' .'+elem+index);
            }.bind(this);
            Queue.add(fn);
        },

        animateRun: function(clear){
            $(this.container+' .house').removeClass('turn');
            Queue.onFinish(function(){
                //Queue.clearQueue();   // necessory
                $(this.container+' .fade').removeClass('fade');
            }.bind(this)).run(clear);
        },



        onAnimateFinish: function(fn){
            Queue.onFinish(fn);
        },

        clearQueue: function(){
            Queue.clearQueue();
        },


        giveMoveP1: function(asap){
            this.moveOfP2 = false;
            function giveMove() {
                $(this.container+' .text-p1').addClass('active').text(this.player1Text+'\'s turn.');
                $(this.container+' .text-p2').removeClass('active').text(this.player2Text);
                $(this.container+' .house').removeClass('turn');
                $(this.container+' .housesP1 .house:not(:contains(0)):not(:contains("x"))').addClass('turn');
            }
            if (asap) {
                giveMove.call(this);
            }
            else {
                Queue.add(function(i){
                    giveMove.call(this);
                }.bind(this));
            }

        },

        giveMoveP2: function(asap){
            this.moveOfP2 = true;
            function giveMove() {
                $(this.container+' .text-p2').addClass('active').text(this.player2Text+'\'s turn.');
                $(this.container+' .text-p1').removeClass('active').text(this.player1Text);
                $(this.container+' .house').removeClass('turn player2');
                $(this.container+' .housesP2 .house:not(:contains(0)):not(:contains(x))').addClass('turn player2');
            }
            if (asap) {
                giveMove();
            }
            else {
                Queue.add(function(i){
                      giveMove.call(this);

                        if (this.isPlayerComputer) {
                            function playComputerMove() {
                                var movableHouses = $(view.container+' .housesP2 .house:not(:contains(0)):not(:contains("x"))');
                                var movableIndex = [];
                                movableHouses.each(function(){
                                    var index = $(view.container+' .housesP2 .house').index(this);
                                    movableIndex.push(index);
                                });
                                var randomMove = _getRandomInt(0,movableIndex.length);
                                movableHouses.eq(randomMove).click();
                            }
                            setTimeout(playComputerMove, 1000);
                        }
                  }.bind(this));
            }
        },

        round1Finished: function(houses, callback){
            if (houses==='house-p1') {
                var msg = 'Winner is '+this.player2Text+'.';
            } else {
                var msg = 'Winner is '+this.player1Text+'.';
            }
            Queue.add(function(i){
                swal({
                  title: 'Round 1 Finished',
                  text: msg,
                  type: "success",
                  confirmButtonText: "Start Round 2",
                  confirmButtonColor: "#DD6B55"
                }, callback);
            });
        },


        gameFinished: function(houses, callback){
            if (houses==='house-p1') {
                var msg = 'Congrats! Winner is '+this.player2Text+'.';
            } else {
                var msg = 'Congrats! Winner is '+this.player1Text+'.';
            }
            Queue.add(function(i){
                swal({
                  title: 'Game Finished',
                  text: msg,
                  type: "success",
                  confirmButtonText: "Start Over",
                  confirmButtonColor: "#DD6B55" 
                }, callback);
            });
        }

    };

    return view;

}(CongkakQueue));
