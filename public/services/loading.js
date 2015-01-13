app

.factory("loading", function() {
    function loading() {
        this.val = {};
        return this;
    }

    loading.prototype.add = function(name) {
        if (this.val[name]) {
            this.val[name]++;
        } else {
            this.val[name] = 1;
        }
        return this;
    };

    loading.prototype.del = function(name) {
        if (this.val[name]) {
            this.val[name]--;
        } else {
            this.val[name] = 0;
        }
        return this;
    };

    loading.prototype.isLoading = function(name) {
        return !!this.val[name];
    };

    loading.prototype.isLoadingAny = function() {
        for (i in this.val) {
            if (this.val[i] > 0) {
                return true;
            }
        }
        return false;
    };

    return new loading();
})

;
