var Color = (function () {
    function Color(r, g, b) {
        if (typeof r === "undefined") { r = 0; }
        if (typeof g === "undefined") { g = 0; }
        if (typeof b === "undefined") { b = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.prototype.toHex = function () {
        return this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
    };

    Color.prototype.toHTMLColor = function () {
        return "#" + this.toHex();
    };

    Color.lerp = function (c1, c2, f) {
        return new Color(Math.floor((1 - f) * c1.r + f * c2.r), Math.floor((1 - f) * c1.g + f * c2.g), Math.floor((1 - f) * c1.b + f * c2.b));
    };
    return Color;
})();
