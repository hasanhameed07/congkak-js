var CongkakSeeds = (function(view){

    return {
        housesLength: 7,
        housesP1: [],
        housesP2: [],
        storehouseP1: 0,
        storehouseP2: 0,
        burntHousesP1: [],
        burntHousesP2: [],
        total: 0, // seeds in hand
        seedsDropped: 0,
        seedsRemaining: 0,


        init: function () {
            this.housesP1 = [];
            this.housesP2 = [];
            for (var i=0; i < this.housesLength; i++) {
                this.housesP1.push(this.housesLength);
                this.housesP2.push(this.housesLength);
            }
            this.burntHousesP1 = [];
            this.burntHousesP2 = [];
            this.storehouseP1 = 0;
            this.storehouseP2 = 0;
            this.total = 0;
            this.seedsDropped = 0;
            this.seedsRemaining = 0;
        },

        dropSeed: function (elem, index, val, valChange) {
            if (valChange) {
                this.seedsDropped += valChange;
                this.seedsRemaining -= valChange;
            }
            else {
                this.seedsDropped++;
                this.seedsRemaining--;
            }
            view.update(elem, index, val);
        },

        moveToStorehouseP1: function (elem, index, seeds) {
            this.storehouseP1 += seeds;
            if (elem === 'house-p1') {
                this.housesP1[index] = 0;
            }
            else {
                this.housesP2[index] = 0;
            }
            view.update(elem, index, 0);
            view.update('storehouse-p1', '', this.storehouseP1);
        },

        moveToStorehouseP2: function (elem, index, seeds) {
            this.storehouseP2 += seeds;
            if (elem === 'house-p1') {
                this.housesP1[index] = 0;
            }
            else {
                this.housesP2[index] = 0;
            }
            view.update(elem, index, 0);
            view.update('storehouse-p2', '', this.storehouseP2);
        },

        takeAllSeeds: function (elem, index) {
            if (elem === 'house-p1') {
                seeds = this.housesP1[index];
                this.housesP1[index] = 0;
            }
            else if (elem === 'house-p2') {
                seeds = this.housesP2[index];
                this.housesP2[index] = 0;
            }
            else if (elem === 'storehouse-p1') {
                seeds = this.storehouseP1;
                this.storehouseP1 = 0;
            }
            else if (elem === 'storehouse-p2') {
                seeds = this.storehouseP2;
                this.storehouseP2 = 0;
            }
            this.total = seeds;
            this.seedsRemaining = seeds;
            this.seedsDropped = 0;
            view.update(elem, index, 0);
        },

        allHousesEmpty: function () {
            var i=0, housesEmpty = 'house-p1';
            for(; i<this.housesLength; i++) {
                if (this.housesP1[i]>0) {
                  housesEmpty = false;
                }
            }
            if (housesEmpty!==false) {
              return housesEmpty;
            }

            housesEmpty = 'house-p2';
            i = 0;
            for(; i<this.housesLength; i++) {
                if (this.housesP2[i]>0) {
                    housesEmpty = false;
                }
            }
            return housesEmpty;
        },

        markHouseBurnt: function (elem, index) {
            if (elem === 'house-p1') {
                this.burntHousesP1.push(index);
            }
            else {
                this.burntHousesP2.push(index);
            }
            view.markHouseBurnt(elem, index);
        },

        isHouseBurnt: function (elem, index) {
            if (elem === 'house-p1') {
                return (this.burntHousesP1.indexOf(index)!=-1);
            }
            else {
                return (this.burntHousesP2.indexOf(index)!=-1);
            }
        }

    };
}(CongkakView));
