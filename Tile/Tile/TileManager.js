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
