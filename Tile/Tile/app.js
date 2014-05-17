window.onload = function () {
    new Application();
};

var Application = (function () {
    function Application() {
        this.init();
    }
    Application.prototype.init = function () {
        var contentEl = document.getElementById("content");

        var w = 900;
        var h = 450;
        var tileCountX = 25;
        var tileCountY = 13;

        this.tileManager = new TileManager();
        this.tileManager.createTileGrid(Math.floor(w / tileCountX), new Vector2(tileCountX, tileCountY), new Vector2(Math.floor(0.5 * (window.innerWidth - w)), Math.floor(0.5 * (window.innerHeight - h))));

        this.update();
    };

    Application.prototype.update = function () {
        var _this = this;
        this.tileManager.update();

        requestAnimationFrame(function (time) {
            return _this.update();
        });
    };
    Application.updateRate = 1 / 60;
    return Application;
})();
