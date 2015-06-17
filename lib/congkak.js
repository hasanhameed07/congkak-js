var Congkak = (function (seeds, view, loop) {

    // local variables
    var congkak, 
        $elem,
        _isSecondRound = false,
        _isPlayerComputer = true
        ;


    function checkRules(index, type) {

        if (!congkak.moveOfP2 && type == 'storehouse-p1') {
            congkak.secondMoveP1 = true;

            return view.giveMoveP1;
        }

        if (congkak.moveOfP2 && type == 'storehouse-p2') {
            congkak.secondMoveP2 = true;

            return view.giveMoveP2;
        }

        if (type == 'house-p1') {

            if (seeds.housesP1[index] - 1 > 0) {
                // if has seeds
                seeds.takeAllSeeds('house-p1', index);
                if (!congkak.moveOfP2) {
                    return [
                        ['dropAtHousesP1', index - 1],
                        ['dropAtStorehouseP1', null],
                        ['dropAtHousesP2', null]
                    ];
                }
                else {
                    return [
                        ['dropAtHousesP1', index - 1],
                        ['dropAtHousesP2', null],
                        ['dropAtStorehouseP2', null]
                    ];
                }
            }

            else if (!congkak.moveOfP2 && seeds.housesP1[index] == 1 && seeds.housesP2[index] > 0) {
                // if empty & opponent house has seeds
                seeds.moveToStorehouseP1('house-p1', index, seeds.housesP1[index]);
                seeds.moveToStorehouseP1('house-p2', index, seeds.housesP2[index]);
                return view.giveMoveP2;
            }

            else if (!congkak.moveOfP2 && seeds.housesP1[index] == 1 && seeds.housesP2[index] == 0) {
                // if empty & opponent house doesnt have seeds
                return view.giveMoveP2;
            }

            else if (congkak.moveOfP2) {
                return view.giveMoveP1;
            }
        }

        if (type == 'house-p2') {
            if (seeds.housesP2[index] - 1 > 0) {  // minus the dropped seed
                // if has seeds
                seeds.takeAllSeeds('house-p2', index);
                if (!congkak.moveOfP2) {
                    return [
                        ['dropAtHousesP2', index+1],
                        ['dropAtHousesP1', seeds.housesLength - 1],
                        ['dropAtStorehouseP1', null]
                    ];
                }
                else {
                    return [
                        ['dropAtHousesP2', index+1],
                        ['dropAtStorehouseP2', null],
                        ['dropAtHousesP1', seeds.housesLength - 1]
                    ];
                }
            }

            else if (congkak.moveOfP2 && seeds.housesP2[index] == 1 && seeds.housesP1[index] > 0) {

                // if empty & opponent house has seeds
                seeds.moveToStorehouseP2('house-p1', index, seeds.housesP1[index]);
                seeds.moveToStorehouseP2('house-p2', index, seeds.housesP2[index]);
                return view.giveMoveP1;
            }

            else if (congkak.moveOfP2 && seeds.housesP2[index] == 1 && seeds.housesP1[index] == 0) {
                // if empty & opponent house doesnt have seeds
                return view.giveMoveP1;
            }

            else if (!congkak.moveOfP2) {
                return view.giveMoveP2;
            }
        }
    }

    function secondRound(elem) {

        _isSecondRound = true;
        loop.distributeAtHousesP1();
        loop.distributeAtHousesP2();

        if (elem==='house-p1') {
            return view.giveMoveP1;
        }
        else {
            return view.giveMoveP2;
        }
    }

    congkak = {
        moveOfP2: false,
        secondMoveP1: false,
        secondMoveP2: false,

        init: function (elem) {
            $elem = elem;
            seeds.init();
            view.chooseOpponent(function(isHuman){
                _isPlayerComputer = !isHuman;
                view.make(seeds.housesLength, elem, seeds.housesP1, seeds.housesP2, seeds.storehouseP1, seeds.storehouseP2);
                view.giveMoveP1(true);
            });
        },

        moveP1: function (index, elem) {
            if (!$(elem).hasClass('turn'))
                return false;

            this.moveOfP2 = false;

            seeds.takeAllSeeds('house-p1', index);

            this.move([
                ['dropAtHousesP1', index - 1],
                ['dropAtStorehouseP1', null],
                ['dropAtHousesP2', null]
            ]);
        },

        moveP2: function (index, elem) {
            if (!$(elem).hasClass('turn'))
                return false;

            this.moveOfP2 = true;

            seeds.takeAllSeeds('house-p2', index);

            this.move([
                ['dropAtHousesP2', index+1],
                ['dropAtStorehouseP2', null],
                ['dropAtHousesP1', seeds.housesLength - 1]
            ]);
        },

        move: function (loopQueue) {
            // call loop
            var finished = loop.exec(loopQueue);

            // check rules
            var returned = checkRules(finished.index, finished.type);

            if (returned instanceof Array) {
                // call loop again
                this.move(returned);
            }
            else {
                var emptyHouses = seeds.allHousesEmpty();
                if (emptyHouses) {
                    if (_isSecondRound) {
                        view.gameFinished(emptyHouses, function(){
                            seeds.init();
                            congkak.init($elem);
                        });
                    }
                    else {
                      view.round1Finished(emptyHouses, function() {
                          returned = secondRound(emptyHouses);
                          returned.call(view);
                          view.animateRun(true);
                       });
                    }
                }
                // call other fn and run animation (added here because of recursive call above)
                returned.call(view);
                view.animateRun(true);
            }
        }
    };

    return congkak;

}(CongkakSeeds,CongkakView,CongkakLoop));
