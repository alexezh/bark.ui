"use strict";
var bark;
(function (bark) {
    var NumberProperty = (function () {
        function NumberProperty(value) {
            this._value = (value !== undefined) ? value : 0;
            this.id = bark.animator.nextId();
        }
        NumberProperty.prototype.glide = function (delta, step) {
            bark.animator.animateLinear(this, delta, step);
        };
        NumberProperty.prototype.add = function (delta) {
            this._value = this._value + delta;
        };
        NumberProperty.prototype.get = function () {
            return this._value;
        };
        NumberProperty.prototype.set = function (value) {
            this._value = value;
        };
        return NumberProperty;
    }());
    bark.NumberProperty = NumberProperty;
    var LinearAnimator = (function () {
        function LinearAnimator(prop, delta, step) {
            this.prop = prop;
            this.delta = delta;
            this.step = step;
        }
        LinearAnimator.prototype.animate = function (frameTime) {
            if (this.delta === 0) {
                return false;
            }
            else if (this.delta > 0) {
                if (this.delta > this.step) {
                    this.delta -= this.step;
                    this.prop.add(this.step);
                    return true;
                }
                else {
                    this.prop.add(this.delta);
                    this.delta = 0;
                    return false;
                }
            }
            else {
                if (this.delta < this.step) {
                    this.delta -= this.step;
                    this.prop.add(this.step);
                    return true;
                }
                else {
                    this.prop.add(this.delta);
                    this.delta = 0;
                    return false;
                }
            }
        };
        return LinearAnimator;
    }());
    bark.LinearAnimator = LinearAnimator;
    var LinearAnimator2 = (function () {
        function LinearAnimator2(obj, prop, delta, step) {
            this.obj = obj;
            this.prop = prop;
            this.delta = delta;
            this.step = step;
        }
        LinearAnimator2.prototype.animate = function (frameTime) {
            if (this.delta === 0) {
                return false;
            }
            else if (this.delta > 0) {
                if (this.delta > this.step) {
                    this.delta -= this.step;
                    this.obj[this.prop] += this.step;
                    return true;
                }
                else {
                    this.obj[this.prop] += this.delta;
                    this.delta = 0;
                    return false;
                }
            }
            else {
                if (this.delta < this.step) {
                    this.delta -= this.step;
                    this.obj[this.prop] += this.step;
                    return true;
                }
                else {
                    this.obj[this.prop] += this.delta;
                    this.delta = 0;
                    return false;
                }
            }
        };
        return LinearAnimator2;
    }());
    bark.LinearAnimator2 = LinearAnimator2;
    var LoopLinearAnimator = (function () {
        function LoopLinearAnimator(prop, delta, step) {
            this.prop = prop;
            this.startDelta = Math.abs(delta);
            this.delta = this.startDelta;
            this.step = Math.abs(step);
            this.direction = (delta > 0) ? 1 : -1;
        }
        LoopLinearAnimator.prototype.animate = function (frameTime) {
            if (this.delta > this.step) {
                this.delta -= this.step;
                this.prop.add(this.step * this.direction);
            }
            else {
                this.prop.set(this.delta * this.direction);
                this.delta = this.startDelta;
                this.direction = -this.direction;
            }
            return true;
        };
        return LoopLinearAnimator;
    }());
    bark.LoopLinearAnimator = LoopLinearAnimator;
    var DiscreteAnimator = (function () {
        function DiscreteAnimator(prop, values, intervalSeconds) {
            this.prop = prop;
            this.values = values;
            this.index = 0;
            this.intervalMs = intervalSeconds * 1000;
            this.lastFrameTimeMs = performance.now();
            this.prop.set(this.values[this.index]);
        }
        DiscreteAnimator.prototype.animate = function (frameTime) {
            if (this.lastFrameTimeMs + this.intervalMs > frameTime)
                return true;
            var newIndex = this.index + 1;
            if (newIndex >= this.values.length)
                newIndex = 0;
            this.index = newIndex;
            this.prop.set(this.values[newIndex]);
            this.lastFrameTimeMs = frameTime;
            return true;
        };
        return DiscreteAnimator;
    }());
    bark.DiscreteAnimator = DiscreteAnimator;
    var PropertyAnimationManager = (function () {
        function PropertyAnimationManager() {
            this._props = {};
            this._props2 = {};
            this._nextKey = 0;
            this.onUpdateScene = null;
            var self = this;
            window.setInterval(function () { return self.processAnimation(); }, 100);
        }
        PropertyAnimationManager.prototype.animateLinear = function (prop, delta, step) {
            if (this._props[prop.id] !== undefined) {
                return;
            }
            this._props[prop.id] = new LinearAnimator(prop, delta, step);
        };
        PropertyAnimationManager.prototype.animate = function (prop, animator) {
            if (prop === undefined || animator == undefined)
                throw "missing required args";
            if (this._props[prop.id] !== undefined) {
                return;
            }
            this._props[prop.id] = animator;
        };
        PropertyAnimationManager.prototype.glide = function (args) {
            this._props2[args.obj.id + args.prop] = new LinearAnimator2(args.obj, args.prop, args.delta, args.step);
        };
        PropertyAnimationManager.prototype.animateProperty = function (args) {
            this._props2[args.obj.id + args.prop] = args.animator;
        };
        PropertyAnimationManager.prototype.nextId = function () {
            return this._nextKey++;
        };
        PropertyAnimationManager.prototype.processAnimation = function () {
            var frameTime = performance.now();
            for (var key in this._props) {
                var prop = this._props[key];
                if (!prop.animate(frameTime)) {
                    delete this._props[key];
                }
            }
            for (var key in this._props2) {
                var prop = this._props2[key];
                if (!prop.animate(frameTime)) {
                    delete this._props2[key];
                }
            }
            if (this.onUpdateScene !== null) {
                return this.onUpdateScene();
            }
        };
        return PropertyAnimationManager;
    }());
    bark.PropertyAnimationManager = PropertyAnimationManager;
    bark.animator = new PropertyAnimationManager();
})(bark || (bark = {}));
var bark;
(function (bark) {
    var Input = (function () {
        function Input() {
            this.pressedKeys = {};
            var self = this;
            window.addEventListener('keydown', function (evt) { return self.onKeyDown(evt); }, false);
            window.addEventListener('keyup', function (evt) { return self.onKeyUp(evt); }, false);
        }
        Input.prototype.onKeyDown = function (evt) {
            this.pressedKeys[evt.code] = true;
        };
        Input.prototype.onKeyUp = function (evt) {
            this.pressedKeys[evt.code] = false;
        };
        return Input;
    }());
    bark.Input = Input;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var SpriteImage = (function () {
        function SpriteImage(name, w, h) {
            this._image = new Image();
            this._image.src = name;
            this._w = w;
            this._h = h;
        }
        SpriteImage.prototype.draw = function (ctx, x, y, w, h) {
            ctx.drawImage(this._image, x, y, w, h);
        };
        return SpriteImage;
    }());
    bark.SpriteImage = SpriteImage;
    var DynamicImage = (function () {
        function DynamicImage(func) {
            this._drawFunc = func;
        }
        DynamicImage.prototype.draw = function (ctx, x, y, w, h) {
            ctx.save();
            ctx.translate(x, y);
            this._drawFunc(ctx);
            ctx.restore();
        };
        return DynamicImage;
    }());
    bark.DynamicImage = DynamicImage;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var Sprite = (function () {
        function Sprite(args) {
            this._skins = [];
            this.skin = 0;
            this.id = bark.animator.nextId();
            this._animations = ((args.animations === undefined && args.source !== undefined) ? args.source._animations : args.animations);
            this.id = bark.animator.nextId();
            this.flipH = false;
            this.x = (args.x === undefined && args.source !== undefined ? args.source.x : args.x);
            this.y = (args.y === undefined && args.source !== undefined ? args.source.y : args.y);
            this.w = (args.w === undefined && args.source !== undefined ? args.source.w : args.w);
            this.h = (args.h === undefined && args.source !== undefined ? args.source.h : args.h);
            args.skins = (args.skins === undefined && args.source !== undefined) ? args.source._skins : args.skins;
            this.initSkins(args.skins);
        }
        Object.defineProperty(Sprite.prototype, "top", {
            get: function () { return this.y; },
            set: function (newValue) { this.y = newValue; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "bottom", {
            get: function () { return this.y + this.h; },
            set: function (newValue) { this.y = newValue - this.h; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "left", {
            get: function () { return this.x; },
            set: function (newValue) { this.x = newValue; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "right", {
            get: function () { return this.x + this.w; },
            set: function (newValue) { this.x = newValue - this.w; },
            enumerable: false,
            configurable: true
        });
        Sprite.prototype.initSkins = function (skins) {
            var _this = this;
            if (Array.isArray(skins)) {
                skins.forEach(function (elem) {
                    if (typeof (elem) == 'string') {
                        _this._skins.push(new bark.SpriteImage(elem, _this.w, _this.h));
                    }
                    else {
                        _this._skins.push(elem);
                    }
                });
            }
            else if (typeof (skins) === 'string') {
                this._skins.push(new bark.SpriteImage(skins, this.w, this.h));
            }
            else {
                this._skins.push(skins);
            }
            if (this._animations !== undefined) {
                this._animations.forEach(function (a) {
                    a(_this);
                });
            }
        };
        Sprite.prototype.draw = function (ctx) {
            if (this.skin >= this._skins.length) {
                throw "invalid skin index";
            }
            var restore = false;
            var x = this.x;
            if (this.flipH) {
                ctx.save();
                ctx.scale(-1, 1);
                x = -x - this.w;
                restore = true;
            }
            this._skins[this.skin].draw(ctx, x, this.y, this.w, this.h);
            if (restore) {
                ctx.restore();
            }
        };
        Sprite.prototype.setTimer = function (timeout, func) {
            if (typeof (timeout) != 'number')
                throw 'pass timeout as parameter';
            if (timeout < 0.1) {
                timeout = 0.1;
            }
            window.setInterval(func, timeout);
        };
        Sprite.prototype.setXY = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Sprite.prototype.clone = function (x, y) {
            var sprite = new Sprite({ source: this, x: x, y: y });
            return sprite;
        };
        return Sprite;
    }());
    bark.Sprite = Sprite;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var PosKind;
    (function (PosKind) {
        PosKind[PosKind["Pixel"] = 0] = "Pixel";
        PosKind[PosKind["Grid"] = 1] = "Grid";
    })(PosKind = bark.PosKind || (bark.PosKind = {}));
    var Pos = (function () {
        function Pos(kind, x, y) {
            this.kind = kind;
            this.x = x;
            this.y = y;
        }
        return Pos;
    }());
    bark.Pos = Pos;
    var TileLevel = (function () {
        function TileLevel(args) {
            this._tileSprites = {};
            this._rows = [];
            this._sprites = [];
            this._editMode = false;
            this._tileW = args.tileW;
            this._tileH = args.tileH;
            this._gridW = args.gridW;
            this._gridH = args.gridH;
        }
        Object.defineProperty(TileLevel.prototype, "pixelWidth", {
            get: function () { return this._tileW * this._rows[0].length; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TileLevel.prototype, "pixelHeight", {
            get: function () { return this._tileH * this._rows.length; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TileLevel.prototype, "gridHeight", {
            get: function () { return this._gridH; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TileLevel.prototype, "gridWidth", {
            get: function () { return this._gridW; },
            enumerable: false,
            configurable: true
        });
        TileLevel.prototype.addTileSprite = function (c, sprite) {
            this._tileSprites[c] = sprite;
        };
        TileLevel.prototype.getTileSprite = function (c) {
            return this._tileSprites[c];
        };
        TileLevel.prototype.addSprite = function (sprite, x, y) {
            sprite.setXY(x, y);
            this._sprites.push(sprite);
        };
        TileLevel.prototype.setEditMode = function (edit) {
            this._editMode = edit;
        };
        TileLevel.prototype.createEmptyMap = function (w, h) {
            for (var i = 0; i < h; i++) {
                var row = [];
                for (var j = 0; j < w; j++) {
                    row.push(null);
                }
                this._rows.push(row);
            }
        };
        TileLevel.prototype.loadMap = function (rows) {
            var _this = this;
            var rowY = 0;
            rows.forEach(function (inputRow) {
                var spriteRow = [];
                for (var i = 0; i < inputRow.length; i++) {
                    var c = inputRow[i];
                    var sprite = _this._sprites[c];
                    if (sprite !== undefined) {
                        sprite = sprite.clone(i * _this._tileW, rowY);
                        spriteRow.push(sprite);
                    }
                    else {
                        spriteRow.push(null);
                    }
                }
                ;
                _this._rows.push(spriteRow);
                rowY += _this._tileH;
            });
        };
        TileLevel.prototype.draw = function (ctx, x, y) {
            var _this = this;
            var startX = x / this._tileW;
            var startOffset = x % this._tileW;
            var endX = startX + this.pixelWidth / this._tileW + 1;
            var currentY = 0;
            this._rows.forEach(function (row) {
                for (var i = startX; i < endX; i++) {
                    var sprite = row[i];
                    if (sprite !== undefined && sprite !== null) {
                        sprite.draw(ctx);
                    }
                }
                currentY += _this._tileH;
            });
            if (this._editMode) {
                this.drawGrid(ctx);
            }
            this._sprites.forEach(function (element) {
                element.draw(ctx);
            });
        };
        TileLevel.prototype.getTile = function (x, y) {
            var row = this._rows[y];
            if (row === undefined)
                return null;
            return row[x];
        };
        TileLevel.prototype.setTile = function (x, y, c) {
            var row = this._rows[y];
            if (row === undefined)
                return;
            if (x >= row.length)
                return;
            var sprite = this._tileSprites[c];
            if (sprite !== undefined) {
                sprite = sprite.clone(x * this._tileW, y * this._tileH);
                row[x] = sprite;
            }
            else {
                row[x] = null;
            }
        };
        TileLevel.prototype.getGridPosByPixelPos = function (x, y) {
            return new Pos(PosKind.Grid, Math.round(x / this._tileW), Math.round(y / this._tileH));
        };
        TileLevel.prototype.getTileByPixelPos = function (x, y) {
            var blockPos = this.getGridPosByPixelPos(x, y);
            return this.getTile(x, y);
        };
        TileLevel.prototype.getPixelPosByGridPos = function (x, y) {
            return new Pos(PosKind.Pixel, x * this._gridW, y * this._gridH);
        };
        TileLevel.prototype.lookDown = function (x, y) {
            var mapPos = this.getGridPosByPixelPos(x, y);
            for (var i = this._gridH + 1; i < this._gridH; i++) {
                var tile = this.getTile(mapPos.x, i);
                if (tile !== null) {
                    return tile;
                }
            }
            return null;
        };
        TileLevel.prototype.drawGrid = function (ctx) {
            ctx.lineWidth = 2;
            for (var i = 0; i < this._gridW; i++) {
                ctx.beginPath();
                ctx.moveTo(i * this._tileW, 0);
                ctx.lineTo(i * this._tileW, this._gridH * this._tileH);
                ctx.stroke();
            }
            for (var i = 0; i < this._gridW; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * this._tileH);
                ctx.lineTo(this._gridW * this._tileW, i * this._tileH);
                ctx.stroke();
            }
        };
        return TileLevel;
    }());
    bark.TileLevel = TileLevel;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var Screen = (function () {
        function Screen() {
            this._width = 0;
            this._height = 0;
            this._level = null;
            this._canvas = null;
            this._cameraX = 0;
            this._cameraY = 0;
            this._scrollX = 0;
            this._editMode = false;
        }
        Object.defineProperty(Screen.prototype, "scrollX", {
            get: function () { return this._scrollX; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Screen.prototype, "width", {
            get: function () { return this._width; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Screen.prototype, "height", {
            get: function () { return this._height; },
            enumerable: false,
            configurable: true
        });
        Screen.prototype.setLevel = function (level) {
            this._level = level;
        };
        Screen.prototype.setCanvas = function (canvas) {
            this._canvas = canvas;
            canvas.width = this._width;
            canvas.height = this._height;
            this._cameraX = 0;
            this._cameraY = 0;
            var self = this;
            window.requestAnimationFrame(function () { return self._repaint(); });
        };
        Screen.prototype.setEditMode = function (edit) {
            var _a;
            this._editMode = edit;
            (_a = this._level) === null || _a === void 0 ? void 0 : _a.setEditMode(edit);
        };
        Screen.prototype.resize = function (screenWidth, screenHeight) {
            this._canvas.width = screenWidth;
            this._canvas.height = screenHeight;
        };
        Screen.prototype._repaint = function () {
            var ctx = this._canvas.getContext('2d');
            var frameTime = performance.now();
            ctx.save();
            ctx.clearRect(0, 0, this._width, this._height);
            ctx.translate(-this.scrollX, 0);
            if (this._level !== null) {
                this._level.draw(ctx, 0, this._width);
            }
            ctx.restore();
            var self = this;
            window.requestAnimationFrame(function () { return self._repaint(); });
        };
        Screen.prototype.relativePosX = function (x) {
            return x - this.scrollX;
        };
        Screen.prototype.setCamera = function (x, y) {
            if (this._level === null) {
                return;
            }
            if (this._cameraX !== undefined) {
                var shiftX = 0;
                if (x > this._cameraX) {
                    if (this.relativePosX(x) > screen.width * 3 / 4) {
                        shiftX = this.width / 2;
                    }
                }
                if (x < this._cameraX) {
                    if (this.relativePosX(x) > this.width * 3 / 4) {
                        shiftX = -this.width / 2;
                    }
                }
                if (this.scrollX + shiftX > this._level.pixelWidth - this._width) {
                    shiftX = this._level.pixelWidth - this._width - this.scrollX;
                }
                if (shiftX !== 0) {
                    this._scrollX -= shiftX;
                }
            }
            this._cameraX = x;
            this._cameraY = y;
        };
        return Screen;
    }());
    bark.Screen = Screen;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var Game = (function () {
        function Game() {
            this._screen = null;
            this._canvas = null;
        }
        Game.prototype.run = function (screen) {
            this._screen = screen;
            this.tryRun();
        };
        Game.prototype.loadCanvas = function (canvas) {
            this._canvas = canvas;
            this.tryRun();
        };
        Game.prototype.tryRun = function () {
        };
        return Game;
    }());
    bark.Game = Game;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var Help = (function () {
        function Help() {
            this._content = {};
        }
        Help.prototype.add = function (key, content) {
            this._content[key] = content;
        };
        return Help;
    }());
    bark.Help = Help;
})(bark || (bark = {}));
var bark;
(function (bark) {
    var SpriteAtlasImage = (function () {
        function SpriteAtlasImage(atlas, x, y, w, h) {
            this._image = atlas;
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;
        }
        SpriteAtlasImage.prototype.draw = function (ctx, x, y, w, h) {
            ctx.drawImage(this._image, this._x, this._y, this._w, this._h, x, y, w, h);
        };
        return SpriteAtlasImage;
    }());
    bark.SpriteAtlasImage = SpriteAtlasImage;
    var SpriteAtlas = (function () {
        function SpriteAtlas(spriteImageW, spriteImageH, name, spriteW, spriteH) {
            this._image = new Image();
            this._image.src = name;
            this._spriteImageW = spriteImageW;
            this._spriteImageH = spriteImageH;
            this._spriteW = spriteW;
            this._spriteH = spriteH;
        }
        SpriteAtlas.prototype.createSprite = function (x, y, animations) {
            var spriteImage = new SpriteAtlasImage(this._image, x * this._spriteImageW, y * this._spriteImageH, this._spriteImageW, this._spriteImageH);
            return new bark.Sprite({ x: 0, y: 0, w: this._spriteW, h: this._spriteH, skins: [spriteImage], animations: animations });
        };
        SpriteAtlas.prototype.createSpriteAnimated = function (pos, interval) {
            if (!Array.isArray(pos))
                throw "has to be array";
            var spriteImages = [];
            var animationSequence = [];
            for (var i = 0; i < Math.round(pos.length) / 2; i++) {
                spriteImages.push(new SpriteAtlasImage(this._image, pos[i * 2] * this._spriteImageW, pos[i * 2 + 1] * this._spriteImageH, this._spriteImageW, this._spriteImageH));
                animationSequence.push(i);
            }
            var animations = [];
            var sprite = new bark.Sprite({ x: 0, y: 0, w: this._spriteW, h: this._spriteH, skins: spriteImages, animations: animations });
            return sprite;
        };
        return SpriteAtlas;
    }());
    bark.SpriteAtlas = SpriteAtlas;
})(bark || (bark = {}));
//# sourceMappingURL=bark.js.map