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
var EventUtil = (function () {
    function EventUtil() {
    }
    EventUtil.addHandler = function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    };

    EventUtil.removeHandler = function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    };

    EventUtil.getEvent = function (event) {
        return event ? event : window.event;
    };

    EventUtil.prototype.getTarget = function (event) {
        return event.target || event.srcElement;
    };

    EventUtil.prototype.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if (event instanceof MSEventObj) {
            event.returnValue = false;
        }
    };

    EventUtil.prototype.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    };

    EventUtil.prototype.getCharCode = function (event) {
        if (event instanceof KeyboardEvent) {
            var kbdEvent = event;
            if (typeof kbdEvent.charCode == "number") {
                return kbdEvent.charCode;
            } else {
                return kbdEvent.keyCode;
            }
        }

        return -1;
    };
    return EventUtil;
})();
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
var TileManager = (function () {
    function TileManager() {
        this.contentEl = document.getElementById("content");
        this.tiles = [];
        this.mousePos = new Vector2();
    }
    TileManager.prototype.createTile = function (position, size, color, text) {
        var tile = new Tile(position, size, color, this.contentEl, text);
        this.tiles.push(tile);

        return tile;
    };

    TileManager.prototype.createTileGrid = function (tileSize, tileCount, offset) {
        this.offset = offset;
        this.gridSize = new Vector2(tileCount.x * tileSize, tileCount.y * tileSize);

        var email = ["", "", "", "", "", "", "", "", "s", "t", "e", "p", "h", "a", "n", "e", "@", "s", "a", "f", "f", ".", "r", "e"];
        var job1 = ["", "3", "D", "", "G", "r", "a", "p", "h", "i", "c", "s", ""];
        var job2 = ["", "S", "o", "f", "t", "w", "a", "r", "e", "", "e", "n", "g", "i", "n", "e", "e", "r"];
        var name = ["", "S", "t", "é", "p", "h", "a", "n", "e", "", "S", "a", "f", "f", "r", "é"];

        for (var j = 0; j < tileCount.y; ++j) {
            for (var i = 0; i < tileCount.x; ++i) {
                var c = "";
                if (j == 6 && i < name.length) {
                    c = name[i];
                }
                if (j == 7 && i < job1.length) {
                    c = job1[i];
                }
                if (j == 8 && i < job2.length) {
                    c = job2[i];
                }
                if (j == 11 && i < email.length) {
                    c = email[i];
                }

                var tile = this.createTile(new Vector2(offset.x + i * tileSize, offset.y + j * tileSize), new Vector2(tileSize, tileSize), "#aacccc", c);

                if (j == 8 && i == 19) {
                    var linkedInTextBox = document.createElement("a");
                    linkedInTextBox.href = "http://fr.linkedin.com/in/stephanesaffre/";
                    linkedInTextBox.target = "_blank";
                    linkedInTextBox.textContent = "in";
                    linkedInTextBox.className = "linkedIn-text";

                    linkedInTextBox.style.fontSize = Math.floor(0.9 * tileSize) + "px";
                    linkedInTextBox.style.top = Math.floor(-0.23 * tileSize) + "px";
                    linkedInTextBox.style.textAlign = "center";
                    linkedInTextBox.style.textDecoration = "none";

                    tile.DomElement.appendChild(linkedInTextBox);

                    tile.DomElement.style.backgroundColor = "#4e8cbf";
                    tile.DomElement.style.borderRadius = Math.floor(0.15 * tileSize) + "px";
                    tile.DomElement.style.padding = "0px";
                }
                if (j == 7 || j == 8) {
                    tile.DomElement.style.paddingTop = Math.floor(0.2 * tileSize) + "px";
                    tile.DomElement.style.fontSize = Math.floor(0.65 * tileSize) + "px";
                    tile.DomElement.style.color = "#fff";
                }
                if (j == 6) {
                    tile.DomElement.style.fontSize = Math.floor(0.75 * tileSize) + "px";
                }
                if (j == 11) {
                    tile.DomElement.style.paddingTop = Math.floor(0.2 * tileSize) + "px";
                    tile.DomElement.style.fontSize = Math.floor(0.65 * tileSize) + "px";
                }
            }
        }
    };

    TileManager.prototype.update = function () {
        var time = new Date().getTime() / 1000;

        var pos = new Vector2(Math.floor(0.5 * this.gridSize.x + 0.4 * this.gridSize.x * (1 + Math.sin(1 * time)) * 0.5 * (Math.cos(0.20 * time) + Math.cos(0.10 * time + 1.5))), Math.floor(0.5 * this.gridSize.y + 0.4 * this.gridSize.y * (1 + Math.sin(1 * time)) * 0.5 * (Math.sin(0.15 * time) + Math.sin(0.007 * time + 0.7))));

        pos.add(this.offset);

        for (var i = 0; i < this.tiles.length; ++i) {
            var tile = this.tiles[i];
            tile.update(pos);

            if (i != 219 && Math.random() > 0.9995) {
                tile.generateColor();
            }
        }
    };

    TileManager.prototype.onMouseMoveHandler = function (event) {
        this.mousePos.x = event.clientX;
        this.mousePos.y = event.clientY;
    };
    return TileManager;
})();
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
