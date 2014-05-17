var Vector2 = (function () {
    function Vector2(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Vector2.prototype, "sqrLength", {
        get: function () {
            return this.x * this.x + this.y * this.y;
        },
        enumerable: true,
        configurable: true
    });

    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    };

    Vector2.prototype.substract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
    };

    Vector2.prototype.distanceTo = function (v) {
        return new Vector2(this.x - v.x, this.y - v.y).length;
    };

    Vector2.prototype.toString = function () {
        return "( " + this.x + ", " + this.y + " )";
    };

    Vector2.add = function (a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    };

    Vector2.substract = function (a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    };

    Vector2.distance = function (a, b) {
        return Vector2.substract(a, b).length;
    };

    Vector2.sqrDistance = function (a, b) {
        return Vector2.substract(a, b).sqrLength;
    };
    return Vector2;
})();
