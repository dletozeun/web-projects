var Tile = (function () {
    function Tile(position, size, color, parentElement, text) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.domElement = document.createElement("div");
        this.domElement.className = "tile";
        this.domElement.style.width = size.x + "px";
        this.domElement.style.height = size.y + "px";
        this.domElement.style.left = position.x + "px";
        this.domElement.style.top = position.y + "px";
        this.domElement.style.paddingLeft = Math.floor(0.1 * size.x) + "px";
        this.domElement.style.paddingTop = "0px";
        this.domElement.style.fontSize = Math.floor(0.8 * size.x) + "px";

        this.generateColor();

        this.domElement.textContent = text;

        parentElement.appendChild(this.domElement);
    }
    Object.defineProperty(Tile.prototype, "Center", {
        get: function () {
            return new Vector2(this.position.x + 0.5 * this.size.x, this.position.y + 0.5 * this.size.y);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Tile.prototype, "DomElement", {
        get: function () {
            return this.domElement;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Tile.prototype, "Size", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });

    Tile.prototype.generateColor = function () {
        this.domElement.style.backgroundColor = new Color(Math.floor(170 + 20 * (Math.random() - 0.5)), Math.floor(204 + 20 * (Math.random() - 0.5)), Math.floor(204 + 20 * (Math.random() - 0.5))).toHTMLColor();
    };

    Tile.prototype.update = function (mousePos) {
        var center = this.Center;
        var delta = Vector2.substract(mousePos, center);

        var angleAmp = 30;
        var angleX = 0;
        var angleY = 0;
        var extent = new Vector2(7 * this.size.x, 7 * this.size.y);
        var amp = new Vector2(Math.max((extent.x - Math.abs(delta.x)) / extent.x, 0), Math.max((extent.y - Math.abs(delta.y)) / extent.y, 0));

        angleX = this.getAngle(delta.y, extent.y, angleAmp * amp.x);
        angleY = -this.getAngle(delta.x, extent.x, angleAmp * amp.y);

        var transformStyle = "perspective(600px) rotateX(" + angleX + "deg) rotateY(" + angleY + "deg)";
        this.domElement.style.webkitTransform = transformStyle;
        this.domElement.style.transform = transformStyle;

        if (Math.abs(angleX) >= 0.1 || Math.abs(angleY) >= 0.1) {
            var hShadow = -Math.floor(5 * (angleY / angleAmp));
            var vShadow = Math.floor(5 * (angleX / angleAmp));
            var changeFactor = (0.5 * (Math.abs(angleX) + Math.abs(angleY))) / angleAmp;
            var blur = Math.abs(Math.floor(10 * changeFactor));

            var shadowStyle = hShadow + "px " + vShadow + "px " + blur + "px 0px #777";
            this.domElement.style.boxShadow = shadowStyle;

            this.domElement.style.width = Math.floor((1 - changeFactor) * this.size.x + changeFactor * 0.92 * this.size.x) + "px";
            this.domElement.style.height = Math.floor((1 - changeFactor) * this.size.y + changeFactor * 0.92 * this.size.y) + "px";
        } else {
            this.domElement.style.boxShadow = "";
            this.domElement.style.width = this.size.x + "px";
            this.domElement.style.height = this.size.y + "px";
        }
    };

    Tile.prototype.getAngle = function (x, extent, amplitude) {
        var xnorm = Math.abs(x);

        if (xnorm > extent) {
            return 0;
        }

        if (xnorm <= 0.5 * extent) {
            return (amplitude / (0.5 * extent)) * x;
        }

        return (x < 0 ? -1 : 1) * 2 * amplitude * (-xnorm / extent + 1);
    };
    return Tile;
})();
