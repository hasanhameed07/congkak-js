var CongkakLoop = (function(seeds, view){

    function calcUntill (startIndex) {
        var untill;
        if (seeds.seedsRemaining > seeds.housesLength) {
            untill = seeds.housesLength;
        }
        else {
            untill = seeds.seedsRemaining;
        }
    }

    var loopMethods = {
        type: '',

        dropAtHousesP1: function (startIndex) {
            this.type = 'house-p1';

            var i = startIndex;
            for (; i >= 0 && seeds.seedsRemaining > 0; i--) {

                if (!seeds.isHouseBurnt(this.type, i)) {
                    seeds.housesP1[i] += 1;
                    seeds.dropSeed(this.type, i, seeds.housesP1[i]);
                }
            }

            var stoppedIndex = i + 1;
            return stoppedIndex;
        },

        dropAtHousesP2: function (startIndex) {
            this.type = 'house-p2';
            var i = 0, untill;

            if (seeds.seedsRemaining > seeds.housesLength) {
                untill = seeds.housesLength;
            }
            else {
                untill = seeds.seedsRemaining;
            }

            for (; i < untill && startIndex + i < seeds.housesLength; i++) {

                if (!seeds.isHouseBurnt(this.type, startIndex + i)) {
                    seeds.housesP2[startIndex + i] += 1;
                    seeds.dropSeed(this.type, startIndex + i, seeds.housesP2[startIndex + i]);
                }
            }

            var stoppedIndex = startIndex + i - 1;
            return stoppedIndex;
        },

        dropAtStorehouseP1: function (index, numSeeds) {
            this.type = 'storehouse-p1';
            if (!numSeeds)
                numSeeds = 1;
            seeds.storehouseP1 += numSeeds;
            seeds.dropSeed(this.type, '', seeds.storehouseP1, numSeeds);
            return 0;
        },

        dropAtStorehouseP2: function (index, numSeeds) {
            this.type = 'storehouse-p2';
            if (!numSeeds)
                numSeeds = 1;
            seeds.storehouseP2 += numSeeds;
            seeds.dropSeed(this.type, '', seeds.storehouseP2, numSeeds);
            return 0;
        },


    };

    var loop = {
        exec: function (queue) {
            var i = 0, method, arg, stoppedIndex;
            do {
                if (i>2)
                    i = 0;
                method = this.methods[queue[i][0]];
                arg = queue[i][1];
                stoppedIndex = method.call(loopMethods, arg);
                // set index to starting point
                if (queue[i][0]=='dropAtHousesP1')
                    queue[i][1] =  seeds.housesLength - 1;
                else if (queue[i][0]=='dropAtHousesP2')
                    queue[i][1] =  0;
                i++;
            }
            while (!this.isSeedLast());

            return {index:stoppedIndex, type: loopMethods.type};
        },

        isSeedLast: function (index) {
            var last = (seeds.total - seeds.seedsDropped <= 0);
            return last;
        },
        methods: {'dropAtHousesP1':loopMethods.dropAtHousesP1, 'dropAtHousesP2':loopMethods.dropAtHousesP2,
        'dropAtStorehouseP1':loopMethods.dropAtStorehouseP1, 'dropAtStorehouseP2':loopMethods.dropAtStorehouseP2},


        distributeAtHousesP1: function () {

            seeds.takeAllSeeds('storehouse-p1', '');
            var seedsPerHouse = seeds.housesLength,
                i = 0,
                mod = seeds.seedsRemaining % seedsPerHouse,
                untill = (seeds.seedsRemaining - mod) / seedsPerHouse;

            // put seeds in each house
            for (; i < seeds.housesLength && i < untill; i++) {
                seeds.housesP1[i] += seedsPerHouse;
                seeds.dropSeed('house-p1', i, seeds.housesP1[i], seedsPerHouse);
            }
            // the leftover seeds need to be put in a house
            if (seeds.seedsRemaining > 0 && i<seeds.housesLength) {
                seeds.housesP1[i] += mod;
                seeds.dropSeed('house-p1', i, seeds.housesP1[i], mod);
                i--;
            }
            // the leftover seeds need to be put in storehouse
            if (seeds.seedsRemaining>0 && i>=seeds.housesLength) {
                loopMethods.dropAtStorehouseP1(seeds.seedsRemaining);
            }
            // mark leftover houses as burnt
            if (seeds.seedsRemaining===0 && i<seeds.housesLength) {
                for (var j=i; j < seeds.housesLength; j++) {
                    seeds.markHouseBurnt('house-p1', j);
                }
            }
        },

        distributeAtHousesP2: function () {

            seeds.takeAllSeeds('storehouse-p2', '');
            var seedsPerHouse = seeds.housesLength,
                i = seeds.housesLength - 1,
                mod = seeds.seedsRemaining % seedsPerHouse,
                untill = i - (seeds.seedsRemaining - mod) / seedsPerHouse;
            // put seeds in each house
            for (; i >=0 && i > untill; i--) {
                seeds.housesP2[i] += seedsPerHouse;
                seeds.dropSeed('house-p2', i, seeds.housesP2[i], seedsPerHouse);
            }
            // the leftover seeds need to be put in a house
            if (seeds.seedsRemaining>0 && i>=0) {
                seeds.housesP2[i] += mod;
                seeds.dropSeed('house-p2', i, seeds.housesP2[i], mod);
                i++;
            }
            // the leftover seeds need to be put in storehouse
            if (seeds.seedsRemaining>0 && i<0) {
                loopMethods.dropAtStorehouseP2(seeds.seedsRemaining);
            }
        },

    };

    return loop;

}(CongkakSeeds));
