(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bark-core"] = factory();
	else
		root["bark-core"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AsyncEventSource.ts":
/*!*********************************!*\
  !*** ./src/AsyncEventSource.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var AsyncEventSource = (function () {
    function AsyncEventSource() {
        this._callbacks = [];
    }
    AsyncEventSource.prototype.add = function (func) {
        this._callbacks.push(new WeakRef(func));
    };
    AsyncEventSource.prototype.remove = function (func) {
        var j = 0;
        for (var i = 0; i < this._callbacks.length; i++) {
            var weakStored = this._callbacks[i];
            if (weakStored !== null) {
                var stored = weakStored.deref();
                if (stored !== undefined) {
                    if (stored == func) {
                        this._callbacks[i] = null;
                    }
                    else {
                        j++;
                    }
                }
                else {
                }
            }
            else {
                continue;
            }
            if (i != j) {
                this._callbacks[j] = this._callbacks[i];
            }
        }
        if (j != this._callbacks.length) {
            this._callbacks.length = j;
        }
    };
    AsyncEventSource.prototype.invokeWorker = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        for (var i = 0; i < this._callbacks.length; i++) {
            var weakOnChange = this._callbacks[i];
            var func = weakOnChange.deref();
            if (func) {
                func.apply(void 0, args);
            }
            else {
                console.log('missing func');
            }
        }
    };
    AsyncEventSource.prototype.invoke = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        setTimeout(function () {
            _this.invokeWorker.apply(_this, args);
        }, 0);
    };
    AsyncEventSource.prototype.invokeWithCompletion = function (onInvoke) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        setTimeout(function () {
            _this.invokeWorker.apply(_this, args);
            onInvoke();
        }, 0);
    };
    return AsyncEventSource;
}());
/* harmony default export */ __webpack_exports__["default"] = (AsyncEventSource);


/***/ }),

/***/ "./src/CodeFileDef.ts":
/*!****************************!*\
  !*** ./src/CodeFileDef.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeBlockDef": function() { return /* binding */ CodeBlockDef; },
/* harmony export */   "CodeFileDef": function() { return /* binding */ CodeFileDef; }
/* harmony export */ });
/* harmony import */ var _hash_murmurhash3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash/murmurhash3 */ "./src/hash/murmurhash3.js");
/* harmony import */ var _ObjectDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjectDef */ "./src/ObjectDef.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var CodeBlockDef = (function (_super) {
    __extends(CodeBlockDef, _super);
    function CodeBlockDef(storage, parent, id, name, code, codeId) {
        if (codeId === void 0) { codeId = undefined; }
        var _a;
        var _this = _super.call(this, storage, parent, id, 'CodeBlock') || this;
        _this.name = name;
        _this.code = code;
        _this.codeId = (codeId) ? codeId : (0,_hash_murmurhash3__WEBPACK_IMPORTED_MODULE_0__.x64Hash64)(code);
        storage.registerReceiver(_this.id, _this);
        if (id === undefined) {
            storage.setItem(_this.id, (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.id, _this.createUpdateOp());
        }
        return _this;
    }
    CodeBlockDef.prototype.updateCode = function (code) {
        var _a;
        this.code = code;
        this.codeId = (0,_hash_murmurhash3__WEBPACK_IMPORTED_MODULE_0__.x64Hash64)(code);
        this._storage.setItem(this.id, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id, this.createUpdateOp());
    };
    CodeBlockDef.fromOp = function (storage, parent, id, op) {
        return new CodeBlockDef(storage, parent, op.name, op.code, op.codeId);
    };
    CodeBlockDef.prototype.processSet = function (op) {
        this.name = op.name;
        this.code = op.code;
        this.codeId = op.codeId;
    };
    CodeBlockDef.prototype.processAdd = function (childId, op) {
        throw 'not implemented';
    };
    CodeBlockDef.prototype.createUpdateOp = function () {
        return {
            target: 'CodeBlock',
            name: this.name,
            code: this.code,
            codeId: this.codeId
        };
    };
    return CodeBlockDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_1__.ObjectDef));

var CodeFileDef = (function (_super) {
    __extends(CodeFileDef, _super);
    function CodeFileDef(storage, parent, id, name) {
        if (name === void 0) { name = undefined; }
        var _a;
        var _this = _super.call(this, storage, parent, id, 'CodeFile') || this;
        _this.codeBlocks = [];
        _this.name = (name) ? name : 'No name';
        storage.registerReceiver(_this.id, _this);
        if (id === undefined) {
            storage.setItem(_this.id, (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.id, _this.createUpdateOp());
        }
        return _this;
    }
    CodeFileDef.prototype.createBlock = function (name, code) {
        this.codeBlocks.push(new CodeBlockDef(this._storage, this, undefined, name, code));
    };
    Object.defineProperty(CodeFileDef.prototype, "firstBlock", {
        get: function () { return (this.codeBlocks.length > 0) ? this.codeBlocks[0] : undefined; },
        enumerable: false,
        configurable: true
    });
    CodeFileDef.fromOp = function (storage, parent, id, op) {
        return new CodeFileDef(storage, parent, id, op.name);
    };
    CodeFileDef.prototype.processSet = function (op) {
        this.name = op.name;
    };
    CodeFileDef.prototype.processAdd = function (childId, op) {
        this.codeBlocks.push(CodeBlockDef.fromOp(this._storage, this, childId, op));
    };
    CodeFileDef.prototype.createUpdateOp = function () {
        return {
            target: 'CodeFile',
            name: this.name,
            codeBlockCount: this.codeBlocks.length
        };
    };
    return CodeFileDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_1__.ObjectDef));



/***/ }),

/***/ "./src/CostumeDef.ts":
/*!***************************!*\
  !*** ./src/CostumeDef.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageFormat": function() { return /* binding */ ImageFormat; },
/* harmony export */   "ImageData": function() { return /* binding */ ImageData; },
/* harmony export */   "CostumeDef": function() { return /* binding */ CostumeDef; },
/* harmony export */   "CostumeImage": function() { return /* binding */ CostumeImage; }
/* harmony export */ });
/* harmony import */ var _hash_murmurhash3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash/murmurhash3 */ "./src/hash/murmurhash3.js");
/* harmony import */ var _ObjectDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjectDef */ "./src/ObjectDef.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ImageFormat;
(function (ImageFormat) {
    ImageFormat[ImageFormat["svg"] = 0] = "svg";
    ImageFormat[ImageFormat["png"] = 1] = "png";
})(ImageFormat || (ImageFormat = {}));
var ImageData = (function () {
    function ImageData(imageFormat, image, imageId) {
        if (imageId === void 0) { imageId = undefined; }
        this.image = undefined;
        this.imageFormat = ImageFormat.svg;
        this.imageId = undefined;
        this.imageFormat = imageFormat;
        this.image = image;
        this.imageId = (imageId) ? imageId : (0,_hash_murmurhash3__WEBPACK_IMPORTED_MODULE_0__.x64Hash64)(image);
    }
    ImageData.isEqual = function (a, b) {
        if (a === undefined && b === undefined) {
            return true;
        }
        else if (a === undefined || b === undefined) {
            return false;
        }
        else {
            return a.imageId === b.imageId;
        }
    };
    return ImageData;
}());

var CostumeDef = (function (_super) {
    __extends(CostumeDef, _super);
    function CostumeDef(storage, parent, id) {
        var _a;
        var _this = _super.call(this, storage, parent, id, 'Costume') || this;
        _this.name = 'No name';
        _this._version = 1.0;
        _this._cachedSpriteSource = undefined;
        storage.registerReceiver(_this.id, _this);
        if (id === undefined) {
            storage.setItem(_this.id, (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.id, _this.createUpdateOp());
        }
        return _this;
    }
    Object.defineProperty(CostumeDef.prototype, "version", {
        get: function () { return this._version; },
        enumerable: false,
        configurable: true
    });
    CostumeDef.prototype.updateImage = function (imageData) {
        var _a;
        this.imageData = imageData;
        this._version++;
        var sprite = this.parent;
        if (sprite !== undefined) {
            sprite.onCostumeChange.invoke(this);
        }
        this._storage.setItem(this.id, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id, this.createUpdateOp());
    };
    CostumeDef.fromOp = function (storage, parent, id, op) {
        var costume = new CostumeDef(storage, parent, id);
        costume.processSet(op);
        return costume;
    };
    CostumeDef.prototype.processSet = function (op) {
        this.name = op.name;
        this.imageData = new ImageData(op.imageFormat, op.image, op.imageId);
        this._version++;
    };
    CostumeDef.prototype.processAdd = function (childId, op) {
        throw 'not implemented';
    };
    CostumeDef.prototype.getSpriteSource = function () {
        if (this._cachedSpriteSource === undefined) {
            this._cachedSpriteSource = new CostumeImage(this);
        }
        return this._cachedSpriteSource;
    };
    CostumeDef.prototype.createUpdateOp = function () {
        var _a, _b, _c;
        return {
            target: 'Costume',
            name: this.name,
            image: (_a = this.imageData) === null || _a === void 0 ? void 0 : _a.image,
            imageFormat: (_b = this.imageData) === null || _b === void 0 ? void 0 : _b.imageFormat,
            imageId: (_c = this.imageData) === null || _c === void 0 ? void 0 : _c.imageId
        };
    };
    return CostumeDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_1__.ObjectDef));

var CostumeImage = (function () {
    function CostumeImage(costume) {
        this._costume = costume;
        this._costumeVersion = this._costume.version;
        this.loadImage();
    }
    CostumeImage.prototype.draw = function (ctx, x, y, w, h) {
        if (this._costumeVersion !== this._costume.version) {
            this.loadImage();
        }
        ctx.drawImage(this._image, x, y, w, h);
    };
    CostumeImage.prototype.loadImage = function () {
        var _a;
        this._image = new Image();
        this._image.src = (_a = this._costume.imageData) === null || _a === void 0 ? void 0 : _a.image;
        this._costumeVersion = this._costume.version;
    };
    return CostumeImage;
}());



/***/ }),

/***/ "./src/IProjectStorage.ts":
/*!********************************!*\
  !*** ./src/IProjectStorage.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageOpKind": function() { return /* binding */ StorageOpKind; },
/* harmony export */   "StorageOp": function() { return /* binding */ StorageOp; }
/* harmony export */ });
var StorageOpKind;
(function (StorageOpKind) {
    StorageOpKind["remove"] = "remove";
    StorageOpKind["set"] = "set";
    StorageOpKind["append"] = "append";
    StorageOpKind["screenReady"] = "screenReady";
    StorageOpKind["selectSprite"] = "selectSprite";
})(StorageOpKind || (StorageOpKind = {}));
var StorageOp = (function () {
    function StorageOp(kind, id, parent, value) {
        if (parent === void 0) { parent = undefined; }
        if (value === void 0) { value = null; }
        this.kind = kind;
        this.id = id;
        this.parent = parent;
        this.value = value;
    }
    return StorageOp;
}());



/***/ }),

/***/ "./src/ObjectDef.ts":
/*!**************************!*\
  !*** ./src/ObjectDef.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectDef": function() { return /* binding */ ObjectDef; }
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");

var ObjectDef = (function () {
    function ObjectDef(storage, parent, id, tag) {
        if (id === void 0) { id = undefined; }
        if (tag === void 0) { tag = undefined; }
        this.id = (id) ? id : (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])();
        this.parent = parent;
        this._storage = storage;
    }
    return ObjectDef;
}());



/***/ }),

/***/ "./src/Project.ts":
/*!************************!*\
  !*** ./src/Project.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Project": function() { return /* binding */ Project; }
/* harmony export */ });
/* harmony import */ var _ProjectStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProjectStorage */ "./src/ProjectStorage.ts");
/* harmony import */ var _ScreenDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScreenDef */ "./src/ScreenDef.ts");


var Project = (function () {
    function Project(storage, def) {
        this._storage = storage;
        this.screen = def;
    }
    Object.defineProperty(Project.prototype, "storage", {
        get: function () { return this._storage; },
        enumerable: false,
        configurable: true
    });
    Project.createEmptyProject = function () {
        var storage = new _ProjectStorage__WEBPACK_IMPORTED_MODULE_0__.ProjectLocalStorage();
        var levelProps = {
            gridWidth: 48,
            gridHeight: 8,
            tileWidth: 32,
            tileHeight: 32
        };
        var gridHeight = 8;
        var screen = new _ScreenDef__WEBPACK_IMPORTED_MODULE_1__.ScreenDef(storage, {
            screenWidth: levelProps.tileWidth * 20,
            screenHeight: levelProps.tileHeight * 8
        });
        screen.createLevel(levelProps);
        screen.createSprite('Leia');
        screen.createSprite('Floor');
        screen.createSprite('Air');
        screen.level.setTiles([
            { sprite: screen.sprites.getByNameOrThrow('Leia'), x: 0, y: 0 },
            { sprite: screen.sprites.getByNameOrThrow('Leia'), x: 1, y: 0 },
            { sprite: screen.sprites.getByNameOrThrow('Leia'), x: 2, y: 0 }
        ]);
        screen.codeFile.createBlock('updateScene', '// put code to update scene here');
        return new Project(storage, screen);
    };
    Project.prototype.forEachSprite = function (func) {
        this.screen.sprites.forEach(function (x) { return func(x); });
    };
    Project.prototype.forEachCodeFile = function (func) {
        var _a;
        func(this.screen.codeFile);
        if (this.screen.level !== undefined) {
            func((_a = this.screen.level) === null || _a === void 0 ? void 0 : _a.codeFile);
        }
        this.screen.sprites.forEach(function (x) { return func(x.codeFile); });
    };
    Project.prototype.findCodeFileById = function (id) {
        var _a;
        if (this.screen.codeFile.id === id) {
            return this.screen.codeFile;
        }
        if (this.screen.level !== undefined && this.screen.level.codeFile.id === id) {
            return this.screen.level.codeFile;
        }
        return (_a = this.screen.sprites.find(function (x) { return x.codeFile.id === id; })) === null || _a === void 0 ? void 0 : _a.codeFile;
    };
    Project.prototype.findSpriteById = function (id) {
        return this.screen.sprites.getById(id);
    };
    Project.prototype.registerOnChange = function () {
    };
    return Project;
}());



/***/ }),

/***/ "./src/ProjectStorage.ts":
/*!*******************************!*\
  !*** ./src/ProjectStorage.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProjectLocalStorage": function() { return /* binding */ ProjectLocalStorage; }
/* harmony export */ });
/* harmony import */ var _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IProjectStorage */ "./src/IProjectStorage.ts");
/* harmony import */ var _AsyncEventSource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsyncEventSource */ "./src/AsyncEventSource.ts");


var ProjectLocalStorage = (function () {
    function ProjectLocalStorage() {
        this._data = {};
        this._receivers = {};
        this._onChange = new _AsyncEventSource__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this._changeQueue = [];
        this._updatePending = false;
        this.onInvokeComplete = this.onInvokeComplete.bind(this);
    }
    ProjectLocalStorage.prototype.updateSnapshot = function (json) {
        throw new Error("Method not implemented.");
    };
    ProjectLocalStorage.prototype.setItem = function (id, parent, value) {
        this._data[id] = { parent: parent, value: value };
        this.queueChange(new _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOp(_IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.set, id, parent, value));
    };
    ProjectLocalStorage.prototype.removeItem = function (id) {
        delete this._data[id];
        this.queueChange(new _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOp(_IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.remove, id));
    };
    ProjectLocalStorage.prototype.appendItems = function (id, parent, value) {
        var item = this._data[id];
        if (item === undefined) {
            item = { parent: parent, value: [] };
            this._data[id] = item;
        }
        value.forEach(function (x) { return item.value.push(x); });
        this.queueChange(new _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOp(_IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.append, id, undefined, value));
    };
    ProjectLocalStorage.prototype.processRemoteOp = function (op) {
        switch (op.kind) {
            case _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.set:
                this.processSetOp(op);
                break;
            case _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.append:
                break;
            case _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.remove:
                delete this._data[op.id];
                break;
        }
    };
    ProjectLocalStorage.prototype.processSetOp = function (op) {
        var weakReceiver = this._receivers[op.id];
        if (!weakReceiver) {
            if (op.parent === undefined) {
                throw 'ProjectLocalStorage: op.parent undefined';
            }
            var weakParent = this._receivers[op.parent];
            if (!weakParent) {
                console.log('ProjectLocalStorage: parent not registered: ' + op.parent);
                return;
            }
            var parent_1 = weakParent.deref();
            if (!parent_1) {
                console.log('ProjectLocalStorage: parent released: ' + op.parent);
                return;
            }
            parent_1.processAdd(op.id, op.value);
        }
        else {
            var receiver = weakReceiver.deref();
            if (!receiver) {
                console.log('ProjectLocalStorage: object released: ' + op.id);
                return;
            }
            receiver.processSet(op.value);
        }
    };
    ProjectLocalStorage.prototype.queueChange = function (op) {
        this._changeQueue.push(op);
        if (!this._updatePending) {
            this._updatePending = true;
            this._onChange.invokeWithCompletion(this.onInvokeComplete, this._changeQueue);
            this._changeQueue = [];
        }
    };
    ProjectLocalStorage.prototype.onInvokeComplete = function () {
        this._updatePending = false;
        if (this._changeQueue.length === 0) {
            return;
        }
        this._updatePending = true;
        this._onChange.invokeWithCompletion(this.onInvokeComplete, this._changeQueue);
        this._changeQueue = [];
    };
    ProjectLocalStorage.prototype.registerOnChange = function (func) {
        var ops = this.makePopulateList();
        func(ops);
        this._onChange.add(func);
    };
    ProjectLocalStorage.prototype.unregisterOnChange = function (func) {
        this._onChange.remove(func);
    };
    ProjectLocalStorage.prototype.registerReceiver = function (id, receiver) {
        this._receivers[id] = new WeakRef(receiver);
    };
    ProjectLocalStorage.prototype.makePopulateOp = function (id, ops, writtenOps) {
        if (writtenOps.has(id)) {
            return;
        }
        var data = this._data[id];
        if (data.parent !== undefined) {
            if (!writtenOps.has(data.parent)) {
                this.makePopulateOp(data.parent, ops, writtenOps);
            }
        }
        if (Array.isArray(data)) {
            console.log('append : ' + data.value.length);
            ops.push(new _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOp(_IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.append, id, data.parent, data.value));
        }
        else {
            ops.push(new _IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOp(_IProjectStorage__WEBPACK_IMPORTED_MODULE_0__.StorageOpKind.set, id, data.parent, data.value));
        }
        writtenOps.add(id);
    };
    ProjectLocalStorage.prototype.makePopulateList = function () {
        var ops = [];
        var writtenOps = new Set();
        for (var id in this._data) {
            this.makePopulateOp(id, ops, writtenOps);
        }
        return ops;
    };
    ProjectLocalStorage.prototype.toJson = function () {
        var ops = this.makePopulateList();
        return JSON.stringify(ops);
    };
    return ProjectLocalStorage;
}());



/***/ }),

/***/ "./src/Screen.ts":
/*!***********************!*\
  !*** ./src/Screen.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Screen": function() { return /* binding */ Screen; }
/* harmony export */ });
/* harmony import */ var _TileLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TileLevel */ "./src/TileLevel.ts");

var Screen = (function () {
    function Screen(def) {
        var _this = this;
        this._level = undefined;
        this._canvas = undefined;
        this._width = 0;
        this._height = 0;
        this._cameraX = 0;
        this._cameraY = 0;
        this._scrollX = 0;
        this._editMode = true;
        this._def = def;
        this.onScreenChange();
        this._def.onChange.add(function () { return _this.onScreenChange(); });
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
    Screen.prototype.onScreenChange = function () {
        if (this._width !== this._def.props.screenWidth ||
            this._height !== this._def.props.screenHeight) {
            console.log('update parameters');
            this._width = this._def.props.screenWidth;
            this._height = this._def.props.screenHeight;
            if (this._canvas !== undefined) {
                this._canvas.width = this._width;
                this._canvas.height = this._height;
            }
        }
        if (this._level === null && this._def.level !== undefined) {
            console.log('create level');
            this._level = new _TileLevel__WEBPACK_IMPORTED_MODULE_0__.TileLevel(this._def.level);
        }
    };
    Screen.prototype._repaint = function () {
        var ctx = this._canvas.getContext('2d');
        var frameTime = performance.now();
        ctx.save();
        ctx.clearRect(0, 0, this._width, this._height);
        ctx.translate(-this.scrollX, 0);
        if (this._level !== undefined) {
            this._level.draw(ctx, 0, this._width);
        }
        ctx.restore();
        var self = this;
        window.requestAnimationFrame(function () { return self._repaint(); });
    };
    Screen.prototype.relativePosX = function (x) {
        return x - this.scrollX;
    };
    return Screen;
}());



/***/ }),

/***/ "./src/ScreenDef.ts":
/*!**************************!*\
  !*** ./src/ScreenDef.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScreenDef": function() { return /* binding */ ScreenDef; }
/* harmony export */ });
/* harmony import */ var _ObjectDef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectDef */ "./src/ObjectDef.ts");
/* harmony import */ var _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeFileDef */ "./src/CodeFileDef.ts");
/* harmony import */ var _SpriteDef__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SpriteDef */ "./src/SpriteDef.ts");
/* harmony import */ var _TileLevelDef__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TileLevelDef */ "./src/TileLevelDef.ts");
/* harmony import */ var _AsyncEventSource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AsyncEventSource */ "./src/AsyncEventSource.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var ScreenDef = (function (_super) {
    __extends(ScreenDef, _super);
    function ScreenDef(storage, props) {
        if (props === void 0) { props = undefined; }
        var _this = _super.call(this, storage, undefined, 'screen') || this;
        _this._sprites = new _SpriteDef__WEBPACK_IMPORTED_MODULE_2__.SpriteDefCollection();
        _this.onChange = new _AsyncEventSource__WEBPACK_IMPORTED_MODULE_4__["default"]();
        _this._storage = storage;
        storage.registerReceiver(_this.id, _this);
        if (props !== undefined) {
            _this.props = props;
            _this._codeFile = new _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__.CodeFileDef(storage, _this, undefined, 'game');
            storage.setItem(_this.id, undefined, _this.createUpdateOp());
        }
        return _this;
    }
    Object.defineProperty(ScreenDef.prototype, "sprites", {
        get: function () { return this._sprites; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScreenDef.prototype, "level", {
        get: function () { return this._level; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScreenDef.prototype, "codeFile", {
        get: function () { return this._codeFile; },
        enumerable: false,
        configurable: true
    });
    ScreenDef.prototype.createLevel = function (props) {
        this._level = new _TileLevelDef__WEBPACK_IMPORTED_MODULE_3__.TileLevelDef(this._storage, this, undefined, props, this._sprites);
        return this.level;
    };
    ScreenDef.prototype.processSet = function (op) {
        this.props = op.props;
    };
    ScreenDef.prototype.processAdd = function (childId, op) {
        console.log('processAdd:' + op.target + ' ' + childId);
        if (op.target === 'Sprite') {
            this.sprites.push(_SpriteDef__WEBPACK_IMPORTED_MODULE_2__.SpriteDef.fromOp(this._storage, this, childId, op));
        }
        else if (op.target === 'TileLevel') {
            this._level = _TileLevelDef__WEBPACK_IMPORTED_MODULE_3__.TileLevelDef.fromOp(this._storage, this, childId, this._sprites, op);
        }
        else {
            this._codeFile = _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__.CodeFileDef.fromOp(this._storage, this, childId, op);
        }
    };
    ScreenDef.prototype.createUpdateOp = function () {
        return {
            target: 'Project',
            props: this.props,
        };
    };
    ScreenDef.prototype.setSize = function (screenWidth, screenHeight) {
        this.props.screenWidth = screenWidth;
        this.props.screenHeight = screenHeight;
        this._storage.setItem('screen', undefined, this.createUpdateOp());
    };
    ScreenDef.prototype.createSprite = function (name) {
        var sprite = new _SpriteDef__WEBPACK_IMPORTED_MODULE_2__.SpriteDef(this._storage, this, undefined, name);
        this.sprites.push(sprite);
        return sprite;
    };
    return ScreenDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_0__.ObjectDef));



/***/ }),

/***/ "./src/Sprite.ts":
/*!***********************!*\
  !*** ./src/Sprite.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sprite": function() { return /* binding */ Sprite; }
/* harmony export */ });
/* harmony import */ var _animator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animator */ "./src/animator.ts");

var Sprite = (function () {
    function Sprite(def, props) {
        this._def = def;
        this.id = _animator__WEBPACK_IMPORTED_MODULE_0__.animator.nextId();
        this.props = props;
        this._costumeIndex = 0;
    }
    Object.defineProperty(Sprite.prototype, "top", {
        get: function () { return this.props.y; },
        set: function (newValue) { this.props.y = newValue; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "bottom", {
        get: function () { return this.props.y + this.props.h; },
        set: function (newValue) { this.props.y = newValue - this.props.h; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "left", {
        get: function () { return this.props.x; },
        set: function (newValue) { this.props.x = newValue; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "right", {
        get: function () { return this.props.x + this.props.w; },
        set: function (newValue) { this.props.x = newValue - this.props.w; },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.draw = function (ctx) {
        if (this._costumeIndex >= this._def.costumes.length) {
            throw "invalid skin index";
        }
        var restore = false;
        var x = this.props.x;
        if (this.props.flipH) {
            ctx.save();
            ctx.scale(-1, 1);
            x = -x - this.props.w;
            restore = true;
        }
        this._def.costumes[this._costumeIndex].getSpriteSource().draw(ctx, x, this.props.y, this.props.w, this.props.h);
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
        this.props.x = x;
        this.props.y = y;
    };
    return Sprite;
}());



/***/ }),

/***/ "./src/SpriteDef.ts":
/*!**************************!*\
  !*** ./src/SpriteDef.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpriteDef": function() { return /* binding */ SpriteDef; },
/* harmony export */   "SpriteDefCollection": function() { return /* binding */ SpriteDefCollection; }
/* harmony export */ });
/* harmony import */ var _AsyncEventSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncEventSource */ "./src/AsyncEventSource.ts");
/* harmony import */ var _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeFileDef */ "./src/CodeFileDef.ts");
/* harmony import */ var _ObjectDef__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ObjectDef */ "./src/ObjectDef.ts");
/* harmony import */ var _CostumeDef__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CostumeDef */ "./src/CostumeDef.ts");
/* harmony import */ var _Sprite__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Sprite */ "./src/Sprite.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var SpriteDef = (function (_super) {
    __extends(SpriteDef, _super);
    function SpriteDef(storage, parent, id, name) {
        var _a;
        var _this = _super.call(this, storage, parent, id, 'Sprite') || this;
        _this.name = 'No name';
        _this.width = 0;
        _this.height = 0;
        _this.costumes = [];
        _this.onCostumeChange = new _AsyncEventSource__WEBPACK_IMPORTED_MODULE_0__["default"]();
        _this.name = name;
        storage.registerReceiver(_this.id, _this);
        if (id === undefined) {
            _this.codeFile = new _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__.CodeFileDef(storage, _this, undefined, name);
            storage.setItem(_this.id, (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.id, _this.createUpdateOp());
            _this.costumes.push(new _CostumeDef__WEBPACK_IMPORTED_MODULE_3__.CostumeDef(storage, _this, undefined));
        }
        return _this;
    }
    Object.defineProperty(SpriteDef.prototype, "firstCostume", {
        get: function () { return this.costumes[0]; },
        enumerable: false,
        configurable: true
    });
    SpriteDef.prototype.findCostume = function (id) {
        for (var i = 0; i < this.costumes.length; i++) {
            if (this.costumes[i].id == id) {
                return this.costumes[i];
            }
        }
        return undefined;
    };
    SpriteDef.fromOp = function (storage, parent, id, op) {
        var sprite = new SpriteDef(storage, parent, id, op.name);
        sprite.processSet(op);
        return sprite;
    };
    SpriteDef.prototype.processSet = function (op) {
        this.name = op.name;
        this.width = op.width;
        this.height = op.height;
    };
    SpriteDef.prototype.processAdd = function (childId, op) {
        this.costumes.push(_CostumeDef__WEBPACK_IMPORTED_MODULE_3__.CostumeDef.fromOp(this._storage, this, childId, op));
    };
    SpriteDef.prototype.createUpdateOp = function () {
        return {
            target: 'Sprite',
            name: this.name,
            width: this.width,
            height: this.height,
            costumeCount: this.costumes.length
        };
    };
    SpriteDef.isEqual = function (a, b) {
        if (a === undefined && b === undefined) {
            return true;
        }
        else if (a === undefined || b === undefined) {
            return false;
        }
        else {
            return a === b;
        }
    };
    SpriteDef.prototype.createSprite = function (args) {
        return new _Sprite__WEBPACK_IMPORTED_MODULE_4__.Sprite(this, { x: args.x, y: args.y, w: this.width, h: this.height, flipH: false });
    };
    return SpriteDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_2__.ObjectDef));

var SpriteDefCollection = (function () {
    function SpriteDefCollection() {
        this._sprites = [];
    }
    SpriteDefCollection.prototype.asArray = function () { return this._sprites; };
    Object.defineProperty(SpriteDefCollection.prototype, "length", {
        get: function () { return this._sprites.length; },
        enumerable: false,
        configurable: true
    });
    SpriteDefCollection.prototype.push = function (sprite) {
        this._sprites.push(sprite);
    };
    SpriteDefCollection.prototype.getByName = function (name) {
        for (var i = 0; i < this._sprites.length; i++) {
            if (this._sprites[i].name == name) {
                return this._sprites[i];
            }
        }
        return undefined;
    };
    SpriteDefCollection.prototype.getByNameOrThrow = function (name) {
        var sprite = this.getByName(name);
        if (sprite === undefined) {
            throw 'sprite not found:' + name;
        }
        return sprite;
    };
    SpriteDefCollection.prototype.getById = function (id) {
        for (var spriteKey in this._sprites) {
            var sprite = this._sprites[spriteKey];
            if (sprite.id === id) {
                return sprite;
            }
        }
        return undefined;
    };
    SpriteDefCollection.prototype.forEach = function (func) {
        this._sprites.forEach(function (x) { return func(x); });
    };
    SpriteDefCollection.prototype.find = function (pred) {
        for (var spriteKey in this._sprites) {
            var sprite = this._sprites[spriteKey];
            if (pred(sprite)) {
                return sprite;
            }
        }
        return undefined;
    };
    SpriteDefCollection.prototype.map = function (func) {
        return this._sprites.map(func);
    };
    ;
    return SpriteDefCollection;
}());



/***/ }),

/***/ "./src/SpriteSource.ts":
/*!*****************************!*\
  !*** ./src/SpriteSource.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpriteImage": function() { return /* binding */ SpriteImage; },
/* harmony export */   "DynamicImage": function() { return /* binding */ DynamicImage; }
/* harmony export */ });
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



/***/ }),

/***/ "./src/TileLevel.ts":
/*!**************************!*\
  !*** ./src/TileLevel.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PosKind": function() { return /* binding */ PosKind; },
/* harmony export */   "Pos": function() { return /* binding */ Pos; },
/* harmony export */   "TileLevel": function() { return /* binding */ TileLevel; }
/* harmony export */ });
var PosKind;
(function (PosKind) {
    PosKind[PosKind["Pixel"] = 0] = "Pixel";
    PosKind[PosKind["Grid"] = 1] = "Grid";
})(PosKind || (PosKind = {}));
var Pos = (function () {
    function Pos(kind, x, y) {
        this.kind = kind;
        this.x = x;
        this.y = y;
    }
    return Pos;
}());

var TileLevel = (function () {
    function TileLevel(def) {
        this._tileSprites = new Map();
        this._sprites = [];
        this._editMode = true;
        this._def = def;
    }
    Object.defineProperty(TileLevel.prototype, "TileLevelProps", {
        get: function () { return this._def.props; },
        enumerable: false,
        configurable: true
    });
    TileLevel.prototype.setEditMode = function (edit) {
        this._editMode = edit;
    };
    TileLevel.prototype.draw = function (ctx, x, y) {
        var _this = this;
        this._def.forEachTile(function (tile, sprites) {
            if (tile === null) {
                return;
            }
            var sprite = _this._tileSprites.get(tile.viewId);
            if (sprite === undefined) {
                var spriteDef = sprites.getById(tile.id);
                sprite = spriteDef === null || spriteDef === void 0 ? void 0 : spriteDef.createSprite({ x: tile.x, y: tile.y });
                if (sprite === undefined) {
                    throw 'unknown sprite';
                }
                _this._tileSprites.set(tile.viewId, sprite);
            }
            sprite.draw(ctx);
        });
        if (this._editMode) {
            this.drawGrid(ctx);
        }
        this._sprites.forEach(function (element) {
            element.draw(ctx);
        });
    };
    TileLevel.prototype.getGridPosByPixelPos = function (x, y) {
        return new Pos(PosKind.Grid, Math.round(x / this._def.props.tileWidth), Math.round(y / this._def.props.tileHeight));
    };
    TileLevel.prototype.drawGrid = function (ctx) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#969696';
        var props = this._def.props;
        for (var i = 0; i < props.gridWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(i * props.tileWidth, 0);
            ctx.lineTo(i * props.tileWidth, props.gridHeight * props.tileHeight);
            ctx.stroke();
        }
        for (var i = 0; i < props.gridWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * props.tileHeight);
            ctx.lineTo(props.gridWidth * props.tileWidth, i * props.tileHeight);
            ctx.stroke();
        }
    };
    return TileLevel;
}());



/***/ }),

/***/ "./src/TileLevelDef.ts":
/*!*****************************!*\
  !*** ./src/TileLevelDef.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileLevelDef": function() { return /* binding */ TileLevelDef; }
/* harmony export */ });
/* harmony import */ var _ObjectDef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectDef */ "./src/ObjectDef.ts");
/* harmony import */ var _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeFileDef */ "./src/CodeFileDef.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TileLevelDef = (function (_super) {
    __extends(TileLevelDef, _super);
    function TileLevelDef(storage, parent, id, props, sprites) {
        var _a;
        var _this = _super.call(this, storage, parent, id, 'TileLevel') || this;
        _this.rows = [];
        _this._nextViewId = 1.0;
        _this._tilesId = _this.id + '.tiles';
        _this.props = props;
        _this._sprites = sprites;
        _this._storage.registerReceiver(_this.id, _this);
        if (id === undefined) {
            _this._storage.setItem(_this.id, (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.id, _this.createUpdateOp());
            _this.codeFile = new _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__.CodeFileDef(storage, _this, undefined);
            _this.updateTiles();
        }
        return _this;
    }
    TileLevelDef.fromOp = function (storage, parent, id, sprites, op) {
        var level = new TileLevelDef(storage, parent, id, op.props, sprites);
        level.processSet(op);
        return level;
    };
    TileLevelDef.prototype.processSet = function (op) {
        this.props = op.props;
        this.rows = op.rows;
    };
    TileLevelDef.prototype.processAdd = function (childId, op) {
        var _this = this;
        if (childId === this._tilesId) {
            var tileOps = op;
            tileOps.forEach(function (spriteDef) {
                var row = _this.rows[spriteDef.y];
                row[spriteDef.x] = _this._sprites.getById(spriteDef.id);
            });
        }
        else {
            this.codeFile = _CodeFileDef__WEBPACK_IMPORTED_MODULE_1__.CodeFileDef.fromOp(this._storage, this, childId, op);
        }
    };
    TileLevelDef.prototype.createUpdateOp = function () {
        return {
            target: 'TileLevel',
            props: this.props,
            rows: this.rows
        };
    };
    TileLevelDef.prototype.setSize = function (gridWidth, gridHeight) {
        var _a;
        this.props.gridWidth = gridWidth;
        this.props.gridHeight = gridHeight;
        this._storage.setItem(this.id, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id, this.createUpdateOp());
    };
    TileLevelDef.prototype.setTiles = function (tiles) {
        var _this = this;
        var updateTiles = [];
        tiles.forEach(function (tile) {
            var row = _this.rows[tile.y];
            var spriteDef = _this.createSpriteRef(tile.sprite.id, tile.x * _this.props.tileWidth, tile.y * _this.props.tileHeight);
            row[tile.x] = spriteDef;
            updateTiles.push(spriteDef);
        });
        this._storage.appendItems(this._tilesId, this.id, updateTiles);
        tiles.forEach(function (tile) {
            var row = _this.rows[tile.y];
            var spriteDef = _this.createSpriteRef(tile.sprite.id, tile.x * _this.props.tileWidth, tile.y * _this.props.tileHeight);
            row[tile.x] = spriteDef;
            updateTiles.push(spriteDef);
        });
    };
    TileLevelDef.prototype.forEachTile = function (func) {
        var _this = this;
        this.rows.forEach(function (row) {
            row.forEach(function (tileRef) {
                func(tileRef, _this._sprites);
            });
        });
    };
    TileLevelDef.prototype.updateTiles = function () {
        if (this.props.gridHeight > this.rows.length) {
            for (var i = this.rows.length; i < this.props.gridHeight; i++) {
                this.rows.push([]);
            }
        }
        else {
            this.rows.length = this.props.gridHeight;
        }
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            if (row.length < this.props.gridWidth) {
                for (var j = row.length; j < this.props.gridWidth; j++) {
                    row.push(null);
                }
            }
            else {
                row.length = this.props.gridWidth;
            }
        }
    };
    TileLevelDef.prototype.createSpriteRef = function (id, x, y) {
        return {
            id: id,
            x: x,
            y: y,
            viewId: this._nextViewId++,
        };
    };
    return TileLevelDef;
}(_ObjectDef__WEBPACK_IMPORTED_MODULE_0__.ObjectDef));



/***/ }),

/***/ "./src/animator.ts":
/*!*************************!*\
  !*** ./src/animator.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NumberProperty": function() { return /* binding */ NumberProperty; },
/* harmony export */   "LinearAnimator": function() { return /* binding */ LinearAnimator; },
/* harmony export */   "LinearAnimator2": function() { return /* binding */ LinearAnimator2; },
/* harmony export */   "LoopLinearAnimator": function() { return /* binding */ LoopLinearAnimator; },
/* harmony export */   "DiscreteAnimator": function() { return /* binding */ DiscreteAnimator; },
/* harmony export */   "PropertyAnimationManager": function() { return /* binding */ PropertyAnimationManager; },
/* harmony export */   "animator": function() { return /* binding */ animator; }
/* harmony export */ });
var NumberProperty = (function () {
    function NumberProperty(value) {
        this._value = (value !== undefined) ? value : 0;
        this.id = animator.nextId();
    }
    NumberProperty.prototype.glide = function (delta, step) {
        animator.animateLinear(this, delta, step);
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

var PropertyAnimationManager = (function () {
    function PropertyAnimationManager() {
        this._props = {};
        this._props2 = {};
        this._nextKey = 0;
        this.onUpdateScene = null;
        var self = this;
        setInterval(function () { return self.processAnimation(); }, 100);
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

var animator = new PropertyAnimationManager();


/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": function() { return /* binding */ Game; }
/* harmony export */ });
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



/***/ }),

/***/ "./src/help.ts":
/*!*********************!*\
  !*** ./src/help.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Help": function() { return /* binding */ Help; }
/* harmony export */ });
var Help = (function () {
    function Help() {
        this._content = {};
    }
    Help.prototype.add = function (key, content) {
        this._content[key] = content;
    };
    return Help;
}());



/***/ }),

/***/ "./src/input.ts":
/*!**********************!*\
  !*** ./src/input.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Input": function() { return /* binding */ Input; }
/* harmony export */ });
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



/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rng; }
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ __webpack_exports__["default"] = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ __webpack_exports__["default"] = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ __webpack_exports__["default"] = (validate);

/***/ }),

/***/ "./src/hash/murmurhash3.js":
/*!*********************************!*\
  !*** ./src/hash/murmurhash3.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x86Hash32": function() { return /* binding */ x86Hash32; },
/* harmony export */   "x86Hash128": function() { return /* binding */ x86Hash128; },
/* harmony export */   "x64Hash64": function() { return /* binding */ x64Hash64; },
/* harmony export */   "x64Hash128": function() { return /* binding */ x64Hash128; },
/* harmony export */   "hash": function() { return /* binding */ hash; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/hash/util.js");
//
// This implementation is completely based on @karanlyons's project:
// https://github.com/karanlyons/murmurHash3.js
// Except:
// 1) This project adds a function x64Hash64 by triming the higher
//    64 bits for result of function x64Hash128.
// 2) Original project assumes that key is ascii string, this project
//    fix this problem by applying util.toU8IntArray to fix this.
//
// function hash(key) {...} is an alias for x64Hash128
//
// Input:
// string key, int seed
// output:
// (32 or 64 or 128) bits hash in hex string





// PRIVATE FUNCTIONS
// -----------------
function _x86Multiply(m, n) {
    //
    // Given two 32bit ints, returns the two multiplied together as a
    // 32bit int.
    //
    return ((m & 0xffff) * n) + ((((m >>> 16) * n) & 0xffff) << 16);
}

function _x86Rotl(m, n) {
    //
    // Given a 32bit int and an int representing a number of bit positions,
    // returns the 32bit int rotated left by that number of positions.
    //
    return (m << n) | (m >>> (32 - n));
}

function _x86Fmix(h) {
    //
    // Given a block, returns murmurHash3's final x86 mix of that block.
    //
    h ^= h >>> 16;
    h = _x86Multiply(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = _x86Multiply(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h;
}

function _x64Add(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}

function _x64Multiply(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}

function _x64Rotl(m, n) {
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    n %= 64;
    if (n === 32) {
        return [m[1], m[0]];
    } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    } else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
}

function _x64LeftShift(m, n) {
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    n %= 64;
    if (n === 0) {
        return m;
    } else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    } else {
        return [m[1] << (n - 32), 0];
    }
}

function _x64Xor(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    return [m[0] ^ n[0], m[1] ^ n[1]];
}

function _x64Fmix(h) {
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    h = _x64Xor(h, [0, h[0] >>> 1]);
    h = _x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = _x64Xor(h, [0, h[0] >>> 1]);
    h = _x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = _x64Xor(h, [0, h[0] >>> 1]);
    return h;
}

// PUBLIC FUNCTIONS
// ----------------
let x86Hash32 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 32 bit hash
    // using the x86 flavor of MurmurHash3, as an unsigned int.

    key = "" + key || "";

    var u8IntArray = _util__WEBPACK_IMPORTED_MODULE_0__.toU8IntArray(key);
    key = {
        charCodeAt: function (index) {
            return u8IntArray[index];
        },
        length: u8IntArray.length
    }

    seed = seed || 0;
    var remainder = key.length % 4;
    var bytes = key.length - remainder;
    var h1 = seed;
    var k1 = 0;
    var c1 = 0xcc9e2d51;
    var c2 = 0x1b873593;
    for (var i = 0; i < bytes; i = i + 4) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24);
        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);
        h1 ^= k1;
        h1 = _x86Rotl(h1, 13);
        h1 = _x86Multiply(h1, 5) + 0xe6546b64;
    }
    k1 = 0;
    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
    }
    h1 ^= key.length;
    h1 = _x86Fmix(h1);
    return (h1 >>> 0).toString(16);
};

let x86Hash128 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x86 flavor of MurmurHash3, as an unsigned hex.
    //
    key = "" + key || '';

    var u8IntArray = _util__WEBPACK_IMPORTED_MODULE_0__.toU8IntArray(key);
    key = {
        charCodeAt: function (index) {
            return u8IntArray[index];
        },
        length: u8IntArray.length
    }

    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = seed;
    var h2 = seed;
    var h3 = seed;
    var h4 = seed;
    var k1 = 0;
    var k2 = 0;
    var k3 = 0;
    var k4 = 0;
    var c1 = 0x239b961b;
    var c2 = 0xab0e9789;
    var c3 = 0x38b34ae5;
    var c4 = 0xa1e38b93;
    for (var i = 0; i < bytes; i = i + 16) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24);
        k2 = ((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24);
        k3 = ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24);
        k4 = ((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24);
        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);
        h1 ^= k1;
        h1 = _x86Rotl(h1, 19);
        h1 += h2;
        h1 = _x86Multiply(h1, 5) + 0x561ccd1b;
        k2 = _x86Multiply(k2, c2);
        k2 = _x86Rotl(k2, 16);
        k2 = _x86Multiply(k2, c3);
        h2 ^= k2;
        h2 = _x86Rotl(h2, 17);
        h2 += h3;
        h2 = _x86Multiply(h2, 5) + 0x0bcaa747;
        k3 = _x86Multiply(k3, c3);
        k3 = _x86Rotl(k3, 17);
        k3 = _x86Multiply(k3, c4);
        h3 ^= k3;
        h3 = _x86Rotl(h3, 15);
        h3 += h4;
        h3 = _x86Multiply(h3, 5) + 0x96cd1c35;
        k4 = _x86Multiply(k4, c4);
        k4 = _x86Rotl(k4, 18);
        k4 = _x86Multiply(k4, c1);
        h4 ^= k4;
        h4 = _x86Rotl(h4, 13);
        h4 += h1;
        h4 = _x86Multiply(h4, 5) + 0x32ac3b17;
    }
    k1 = 0;
    k2 = 0;
    k3 = 0;
    k4 = 0;
    switch (remainder) {
        case 15:
            k4 ^= key.charCodeAt(i + 14) << 16;
        case 14:
            k4 ^= key.charCodeAt(i + 13) << 8;
        case 13:
            k4 ^= key.charCodeAt(i + 12);
            k4 = _x86Multiply(k4, c4);
            k4 = _x86Rotl(k4, 18);
            k4 = _x86Multiply(k4, c1);
            h4 ^= k4;
        case 12:
            k3 ^= key.charCodeAt(i + 11) << 24;
        case 11:
            k3 ^= key.charCodeAt(i + 10) << 16;
        case 10:
            k3 ^= key.charCodeAt(i + 9) << 8;
        case 9:
            k3 ^= key.charCodeAt(i + 8);
            k3 = _x86Multiply(k3, c3);
            k3 = _x86Rotl(k3, 17);
            k3 = _x86Multiply(k3, c4);
            h3 ^= k3;
        case 8:
            k2 ^= key.charCodeAt(i + 7) << 24;
        case 7:
            k2 ^= key.charCodeAt(i + 6) << 16;
        case 6:
            k2 ^= key.charCodeAt(i + 5) << 8;
        case 5:
            k2 ^= key.charCodeAt(i + 4);
            k2 = _x86Multiply(k2, c2);
            k2 = _x86Rotl(k2, 16);
            k2 = _x86Multiply(k2, c3);
            h2 ^= k2;
        case 4:
            k1 ^= key.charCodeAt(i + 3) << 24;
        case 3:
            k1 ^= key.charCodeAt(i + 2) << 16;
        case 2:
            k1 ^= key.charCodeAt(i + 1) << 8;
        case 1:
            k1 ^= key.charCodeAt(i);
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
    }
    h1 ^= key.length;
    h2 ^= key.length;
    h3 ^= key.length;
    h4 ^= key.length;
    h1 += h2;
    h1 += h3;
    h1 += h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    h1 = _x86Fmix(h1);
    h2 = _x86Fmix(h2);
    h3 = _x86Fmix(h3);
    h4 = _x86Fmix(h4);
    h1 += h2;
    h1 += h3;
    h1 += h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
};

let x64Hash64 = function (key, seed) {
    var result = x64Hash128(key, seed).slice(8);
    return result;
};

let x64Hash128 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    key = "" + key || '';

    var u8IntArray = _util__WEBPACK_IMPORTED_MODULE_0__.toU8IntArray(key);
    key = {
        charCodeAt: function (index) {
            return u8IntArray[index];
        },
        length: u8IntArray.length
    }

    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = _x64Multiply(k1, c1);
        k1 = _x64Rotl(k1, 31);
        k1 = _x64Multiply(k1, c2);
        h1 = _x64Xor(h1, k1);
        h1 = _x64Rotl(h1, 27);
        h1 = _x64Add(h1, h2);
        h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = _x64Multiply(k2, c2);
        k2 = _x64Rotl(k2, 33);
        k2 = _x64Multiply(k2, c1);
        h2 = _x64Xor(h2, k2);
        h2 = _x64Rotl(h2, 31);
        h2 = _x64Add(h2, h1);
        h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
        case 15:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        case 14:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        case 13:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        case 12:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        case 11:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        case 10:
            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        case 9:
            k2 = _x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = _x64Multiply(k2, c2);
            k2 = _x64Rotl(k2, 33);
            k2 = _x64Multiply(k2, c1);
            h2 = _x64Xor(h2, k2);
        case 8:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        case 7:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        case 6:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        case 5:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        case 4:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        case 3:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        case 2:
            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        case 1:
            k1 = _x64Xor(k1, [0, key.charCodeAt(i)]);
            k1 = _x64Multiply(k1, c1);
            k1 = _x64Rotl(k1, 31);
            k1 = _x64Multiply(k1, c2);
            h1 = _x64Xor(h1, k1);
    }
    h1 = _x64Xor(h1, [0, key.length]);
    h2 = _x64Xor(h2, [0, key.length]);
    h1 = _x64Add(h1, h2);
    h2 = _x64Add(h2, h1);
    h1 = _x64Fmix(h1);
    h2 = _x64Fmix(h2);
    h1 = _x64Add(h1, h2);
    h2 = _x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
};

let hash = function (key, seed) {
    return x64Hash128(key, seed);
};



/***/ }),

/***/ "./src/hash/util.js":
/*!**************************!*\
  !*** ./src/hash/util.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toU8IntArray": function() { return /* binding */ toU8IntArray; },
/* harmony export */   "intToUnsignedHex": function() { return /* binding */ intToUnsignedHex; }
/* harmony export */ });
function toU8IntArray(inputString) {
    var array = [];
    var tempArrayOfChar = [];
    for (var i = 0; i < inputString.length; i++) {
        var charCode = inputString.charCodeAt(i);
        var temp;
        tempArrayOfChar.length = 0;
        while ((temp = charCode & 0xff) || charCode) {
            // pushing one byte
            tempArrayOfChar.push(temp);
            // shifting 8 bit right
            charCode >>>= 8;
        }
        array = array.concat(tempArrayOfChar.reverse());
    }
    return array;
}

function intToUnsignedHex(number) {
    var temp;
    var hexArray = [];
    while ((temp = number & 0xffff) || number) {
        temp = temp.toString(16);
        temp = '0000'.slice(temp.length) + temp;
        hexArray.push(temp);
        number >>>= 16;
    }
    return hexArray.reverse().join('');
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Help": function() { return /* reexport safe */ _help__WEBPACK_IMPORTED_MODULE_0__.Help; },
/* harmony export */   "CostumeDef": function() { return /* reexport safe */ _CostumeDef__WEBPACK_IMPORTED_MODULE_1__.CostumeDef; },
/* harmony export */   "CostumeImage": function() { return /* reexport safe */ _CostumeDef__WEBPACK_IMPORTED_MODULE_1__.CostumeImage; },
/* harmony export */   "ImageData": function() { return /* reexport safe */ _CostumeDef__WEBPACK_IMPORTED_MODULE_1__.ImageData; },
/* harmony export */   "ImageFormat": function() { return /* reexport safe */ _CostumeDef__WEBPACK_IMPORTED_MODULE_1__.ImageFormat; },
/* harmony export */   "CodeBlockDef": function() { return /* reexport safe */ _CodeFileDef__WEBPACK_IMPORTED_MODULE_2__.CodeBlockDef; },
/* harmony export */   "CodeFileDef": function() { return /* reexport safe */ _CodeFileDef__WEBPACK_IMPORTED_MODULE_2__.CodeFileDef; },
/* harmony export */   "ScreenDef": function() { return /* reexport safe */ _ScreenDef__WEBPACK_IMPORTED_MODULE_3__.ScreenDef; },
/* harmony export */   "TileLevelDef": function() { return /* reexport safe */ _TileLevelDef__WEBPACK_IMPORTED_MODULE_4__.TileLevelDef; },
/* harmony export */   "Project": function() { return /* reexport safe */ _Project__WEBPACK_IMPORTED_MODULE_5__.Project; },
/* harmony export */   "Game": function() { return /* reexport safe */ _game__WEBPACK_IMPORTED_MODULE_6__.Game; },
/* harmony export */   "Screen": function() { return /* reexport safe */ _Screen__WEBPACK_IMPORTED_MODULE_7__.Screen; },
/* harmony export */   "Sprite": function() { return /* reexport safe */ _Sprite__WEBPACK_IMPORTED_MODULE_8__.Sprite; },
/* harmony export */   "DynamicImage": function() { return /* reexport safe */ _SpriteSource__WEBPACK_IMPORTED_MODULE_9__.DynamicImage; },
/* harmony export */   "SpriteImage": function() { return /* reexport safe */ _SpriteSource__WEBPACK_IMPORTED_MODULE_9__.SpriteImage; },
/* harmony export */   "Input": function() { return /* reexport safe */ _input__WEBPACK_IMPORTED_MODULE_10__.Input; },
/* harmony export */   "ProjectLocalStorage": function() { return /* reexport safe */ _ProjectStorage__WEBPACK_IMPORTED_MODULE_11__.ProjectLocalStorage; },
/* harmony export */   "Pos": function() { return /* reexport safe */ _TileLevel__WEBPACK_IMPORTED_MODULE_12__.Pos; },
/* harmony export */   "PosKind": function() { return /* reexport safe */ _TileLevel__WEBPACK_IMPORTED_MODULE_12__.PosKind; },
/* harmony export */   "TileLevel": function() { return /* reexport safe */ _TileLevel__WEBPACK_IMPORTED_MODULE_12__.TileLevel; },
/* harmony export */   "SpriteDef": function() { return /* reexport safe */ _SpriteDef__WEBPACK_IMPORTED_MODULE_13__.SpriteDef; },
/* harmony export */   "SpriteDefCollection": function() { return /* reexport safe */ _SpriteDef__WEBPACK_IMPORTED_MODULE_13__.SpriteDefCollection; },
/* harmony export */   "Help2": function() { return /* binding */ Help2; }
/* harmony export */ });
/* harmony import */ var _help__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./help */ "./src/help.ts");
/* harmony import */ var _CostumeDef__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CostumeDef */ "./src/CostumeDef.ts");
/* harmony import */ var _CodeFileDef__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeFileDef */ "./src/CodeFileDef.ts");
/* harmony import */ var _ScreenDef__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ScreenDef */ "./src/ScreenDef.ts");
/* harmony import */ var _TileLevelDef__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TileLevelDef */ "./src/TileLevelDef.ts");
/* harmony import */ var _Project__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Project */ "./src/Project.ts");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game */ "./src/game.ts");
/* harmony import */ var _Screen__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Screen */ "./src/Screen.ts");
/* harmony import */ var _Sprite__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Sprite */ "./src/Sprite.ts");
/* harmony import */ var _SpriteSource__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SpriteSource */ "./src/SpriteSource.ts");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./input */ "./src/input.ts");
/* harmony import */ var _ProjectStorage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ProjectStorage */ "./src/ProjectStorage.ts");
/* harmony import */ var _TileLevel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./TileLevel */ "./src/TileLevel.ts");
/* harmony import */ var _SpriteDef__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SpriteDef */ "./src/SpriteDef.ts");














var Help2 = (function () {
    function Help2() {
        this._content = {};
    }
    Help2.prototype.add = function (key, content) {
        this._content[key] = content;
    };
    return Help2;
}());


}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiwrQ0FBaUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsY087QUFDUDtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQzVCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051QjtBQUNNO0FBQ0M7QUFDRjtBQUNHO0FBQ0w7QUFDSDtBQUNFO0FBQ0E7QUFDTTtBQUNQO0FBQ1M7QUFDTDtBQUNBO0FBRTVCO0lBQUE7UUFDVSxhQUFRLEdBQThCLEVBQUUsQ0FBQztJQUtuRCxDQUFDO0lBSFEsbUJBQUcsR0FBVixVQUFXLEdBQVcsRUFBRSxPQUFlO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQy9CLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhcmstY29yZS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL0FzeW5jRXZlbnRTb3VyY2UudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL0NvZGVGaWxlRGVmLnRzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9Db3N0dW1lRGVmLnRzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9JUHJvamVjdFN0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL09iamVjdERlZi50cyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9zcmMvUHJvamVjdC50cyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9zcmMvUHJvamVjdFN0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL1NjcmVlbi50cyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9zcmMvU2NyZWVuRGVmLnRzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9TcHJpdGUudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL1Nwcml0ZURlZi50cyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9zcmMvU3ByaXRlU291cmNlLnRzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9UaWxlTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL1RpbGVMZXZlbERlZi50cyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9zcmMvYW5pbWF0b3IudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL2dhbWUudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL2hlbHAudHMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL2lucHV0LnRzIiwid2VicGFjazovL2JhcmstY29yZS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9iYXJrLWNvcmUvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9oYXNoL211cm11cmhhc2gzLmpzIiwid2VicGFjazovL2JhcmstY29yZS8uL3NyYy9oYXNoL3V0aWwuanMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhcmstY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmFyay1jb3JlLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImJhcmstY29yZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJiYXJrLWNvcmVcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJcbi8qKlxuICogc3RvcmVzIGxpc3Qgb2YgY2FsbGJhY2tzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzeW5jRXZlbnRTb3VyY2U8VD4ge1xuICBwcml2YXRlIF9jYWxsYmFja3M6IChXZWFrUmVmPGFueT4gfCBudWxsKVtdID0gW107XG5cbiAgcHVibGljIGFkZChmdW5jOiBUKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2gobmV3IFdlYWtSZWY8YW55PihmdW5jKSk7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlcyByZWdpc3RlcmVkIGNhbGxiYWNrLCBjbGVhcnMgb3RoZXIgcmVmZXJlbmNlc1xuICAgKi9cbiAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XG4gICAgbGV0IGogPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgd2Vha1N0b3JlZCA9IHRoaXMuX2NhbGxiYWNrc1tpXTtcbiAgICAgIGlmICh3ZWFrU3RvcmVkICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBzdG9yZWQgPSB3ZWFrU3RvcmVkLmRlcmVmKCk7XG4gICAgICAgIGlmIChzdG9yZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChzdG9yZWQgPT0gZnVuYykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGRvIG5vdCBpbmNyZW1lbnQgalxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRvIG5vdCBpbmNyZW1lbnQgalxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkbyBub3QgaW5jcmVtZW50IGpcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChpICE9IGopIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW2pdID0gdGhpcy5fY2FsbGJhY2tzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc2l6ZSBhcnJheSBpZiBuZWVkZWRcbiAgICBpZiAoaiAhPSB0aGlzLl9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MubGVuZ3RoID0gajtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGludm9rZVdvcmtlciguLi5hcmdzOiBhbnlbXSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgd2Vha09uQ2hhbmdlID0gdGhpcy5fY2FsbGJhY2tzW2ldIGFzIFdlYWtSZWY8YW55PjtcbiAgICAgIGxldCBmdW5jID0gd2Vha09uQ2hhbmdlLmRlcmVmKCkgYXMgYW55O1xuICAgICAgaWYgKGZ1bmMpIHtcbiAgICAgICAgZnVuYyguLi5hcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtaXNzaW5nIGZ1bmMnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW52b2tlKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgLy8gcnVuIG91dHNpZGUgY3VycmVudCBjYWxsc3RhY2tcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaW52b2tlV29ya2VyKC4uLmFyZ3MpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgcHVibGljIGludm9rZVdpdGhDb21wbGV0aW9uKG9uSW52b2tlOiAoKSA9PiB2b2lkLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIC8vIHJ1biBvdXRzaWRlIGN1cnJlbnQgY2FsbHN0YWNrXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmludm9rZVdvcmtlciguLi5hcmdzKTtcbiAgICAgIG9uSW52b2tlKCk7XG4gICAgfSwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHg2NEhhc2g2NCB9IGZyb20gXCIuL2hhc2gvbXVybXVyaGFzaDNcIjtcbmltcG9ydCB7IElPYmplY3REZWYsIE9iamVjdERlZiB9IGZyb20gXCIuL09iamVjdERlZlwiO1xuaW1wb3J0IHsgSVByb2plY3RTdG9yYWdlLCBJU3RvcmFnZU9wUmVjZWl2ZXIgfSBmcm9tIFwiLi9JUHJvamVjdFN0b3JhZ2VcIjtcblxuZXhwb3J0IGNsYXNzIENvZGVCbG9ja0RlZiBleHRlbmRzIE9iamVjdERlZiBpbXBsZW1lbnRzIElTdG9yYWdlT3BSZWNlaXZlciB7XG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XG4gIHB1YmxpYyBjb2RlSWQ6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgc3RvcmFnZTogSVByb2plY3RTdG9yYWdlLFxuICAgIHBhcmVudDogSU9iamVjdERlZixcbiAgICBpZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBjb2RlOiBzdHJpbmcsXG4gICAgY29kZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcblxuICAgIHN1cGVyKHN0b3JhZ2UsIHBhcmVudCwgaWQsICdDb2RlQmxvY2snKTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgdGhpcy5jb2RlSWQgPSAoY29kZUlkKSA/IGNvZGVJZCA6IHg2NEhhc2g2NChjb2RlKTtcbiAgICBzdG9yYWdlLnJlZ2lzdGVyUmVjZWl2ZXIodGhpcy5pZCwgdGhpcyk7XG5cbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMucGFyZW50Py5pZCwgdGhpcy5jcmVhdGVVcGRhdGVPcCgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQ29kZShjb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIHRoaXMuY29kZUlkID0geDY0SGFzaDY0KGNvZGUpO1xuXG4gICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMucGFyZW50Py5pZCwgdGhpcy5jcmVhdGVVcGRhdGVPcCgpKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU9wKHN0b3JhZ2U6IElQcm9qZWN0U3RvcmFnZSwgcGFyZW50OiBJT2JqZWN0RGVmLCBpZDogc3RyaW5nLCBvcDogYW55KTogQ29kZUJsb2NrRGVmIHtcbiAgICByZXR1cm4gbmV3IENvZGVCbG9ja0RlZihzdG9yYWdlLCBwYXJlbnQsIG9wLm5hbWUsIG9wLmNvZGUsIG9wLmNvZGVJZCk7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc1NldChvcDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5uYW1lID0gb3AubmFtZTtcbiAgICB0aGlzLmNvZGUgPSBvcC5jb2RlO1xuICAgIHRoaXMuY29kZUlkID0gb3AuY29kZUlkO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NBZGQoY2hpbGRJZDogc3RyaW5nLCBvcDogYW55KTogdm9pZCB7XG4gICAgdGhyb3cgJ25vdCBpbXBsZW1lbnRlZCc7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVVwZGF0ZU9wKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0YXJnZXQ6ICdDb2RlQmxvY2snLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgY29kZTogdGhpcy5jb2RlLFxuICAgICAgY29kZUlkOiB0aGlzLmNvZGVJZFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29kZUZpbGVEZWYgZXh0ZW5kcyBPYmplY3REZWYgaW1wbGVtZW50cyBJU3RvcmFnZU9wUmVjZWl2ZXIge1xuICAvLyBuYW1lIG9mIGNvZGUgZmlsZTsgZm9yIHNwcml0ZXMgdGhlIHNhbWUgYXMgc3ByaXRlIG5hbWVcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgcHVibGljIGNvZGVCbG9ja3M6IENvZGVCbG9ja0RlZltdID0gW107XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHN0b3JhZ2U6IElQcm9qZWN0U3RvcmFnZSxcbiAgICBwYXJlbnQ6IElPYmplY3REZWYgfCB1bmRlZmluZWQsXG4gICAgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcblxuICAgIHN1cGVyKHN0b3JhZ2UsIHBhcmVudCwgaWQsICdDb2RlRmlsZScpO1xuICAgIHRoaXMubmFtZSA9IChuYW1lKSA/IG5hbWUgOiAnTm8gbmFtZSc7XG5cbiAgICBzdG9yYWdlLnJlZ2lzdGVyUmVjZWl2ZXIodGhpcy5pZCwgdGhpcyk7XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCB0aGlzLnBhcmVudD8uaWQsIHRoaXMuY3JlYXRlVXBkYXRlT3AoKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNyZWF0ZUJsb2NrKG5hbWU6IHN0cmluZywgY29kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2RlQmxvY2tzLnB1c2gobmV3IENvZGVCbG9ja0RlZih0aGlzLl9zdG9yYWdlLCB0aGlzLCB1bmRlZmluZWQsIG5hbWUsIGNvZGUpKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZmlyc3RCbG9jaygpOiBDb2RlQmxvY2tEZWYgfCB1bmRlZmluZWQgeyByZXR1cm4gKHRoaXMuY29kZUJsb2Nrcy5sZW5ndGggPiAwKSA/IHRoaXMuY29kZUJsb2Nrc1swXSA6IHVuZGVmaW5lZCB9XG5cbiAgcHVibGljIHN0YXRpYyBmcm9tT3Aoc3RvcmFnZTogSVByb2plY3RTdG9yYWdlLCBwYXJlbnQ6IElPYmplY3REZWYsIGlkOiBzdHJpbmcsIG9wOiBhbnkpOiBDb2RlRmlsZURlZiB7XG4gICAgcmV0dXJuIG5ldyBDb2RlRmlsZURlZihzdG9yYWdlLCBwYXJlbnQsIGlkLCBvcC5uYW1lKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9jZXNzU2V0KG9wOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm5hbWUgPSBvcC5uYW1lO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NBZGQoY2hpbGRJZDogc3RyaW5nLCBvcDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jb2RlQmxvY2tzLnB1c2goQ29kZUJsb2NrRGVmLmZyb21PcCh0aGlzLl9zdG9yYWdlLCB0aGlzLCBjaGlsZElkLCBvcCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVVcGRhdGVPcCgpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICB0YXJnZXQ6ICdDb2RlRmlsZScsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBjb2RlQmxvY2tDb3VudDogdGhpcy5jb2RlQmxvY2tzLmxlbmd0aFxuICAgIH1cbiAgfVxufVxuXG4iLCJpbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHg2NEhhc2g2NCB9IGZyb20gJy4vaGFzaC9tdXJtdXJoYXNoMyc7XG5pbXBvcnQgQXN5bmNFdmVudFNvdXJjZSBmcm9tICcuL0FzeW5jRXZlbnRTb3VyY2UnO1xuaW1wb3J0IHsgSVByb2plY3RTdG9yYWdlLCBJU3RvcmFnZU9wUmVjZWl2ZXIsIFN0b3JhZ2VPcCwgU3RvcmFnZU9wS2luZCB9IGZyb20gJy4vSVByb2plY3RTdG9yYWdlJztcbmltcG9ydCB7IE9iamVjdERlZiwgSU9iamVjdERlZiB9IGZyb20gJy4vT2JqZWN0RGVmJztcbmltcG9ydCB7IFNwcml0ZURlZiB9IGZyb20gJy4vU3ByaXRlRGVmJztcbmltcG9ydCB7IElTcHJpdGVTb3VyY2UgfSBmcm9tICcuL1Nwcml0ZVNvdXJjZSc7XG5cbmV4cG9ydCBlbnVtIEltYWdlRm9ybWF0IHtcbiAgc3ZnLFxuICBwbmdcbn1cblxuZXhwb3J0IGNsYXNzIEltYWdlRGF0YSB7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VGb3JtYXQ6IEltYWdlRm9ybWF0ID0gSW1hZ2VGb3JtYXQuc3ZnO1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VJZDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihpbWFnZUZvcm1hdDogSW1hZ2VGb3JtYXQsIGltYWdlOiBzdHJpbmcsIGltYWdlSWQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW1hZ2VGb3JtYXQgPSBpbWFnZUZvcm1hdDtcbiAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgdGhpcy5pbWFnZUlkID0gKGltYWdlSWQpID8gaW1hZ2VJZCA6IHg2NEhhc2g2NChpbWFnZSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGlzRXF1YWwoYTogSW1hZ2VEYXRhIHwgdW5kZWZpbmVkLCBiOiBJbWFnZURhdGEgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkICYmIGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBhLmltYWdlSWQgPT09IGIuaW1hZ2VJZDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBVFQ6IGFsbCBtZXRob2RzIHNob3VsZCBiZSBzdGF0aWMuIFdlIHdpbGwgZGVzZXJpYWxpemUgSlMgaW50byB0aGlzIGNsYXNzIHdpdGhvdXQgY2FzdGluZ1xuICovXG5leHBvcnQgY2xhc3MgQ29zdHVtZURlZiBleHRlbmRzIE9iamVjdERlZiBpbXBsZW1lbnRzIElTdG9yYWdlT3BSZWNlaXZlciB7XG4gIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnTm8gbmFtZSc7XG4gIHB1YmxpYyBpbWFnZURhdGE6IEltYWdlRGF0YSB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBfdmVyc2lvbjogbnVtYmVyID0gMS4wO1xuICBwcml2YXRlIF9jYWNoZWRTcHJpdGVTb3VyY2U6IENvc3R1bWVJbWFnZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgZ2V0IHZlcnNpb24oKSB7IHJldHVybiB0aGlzLl92ZXJzaW9uOyB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHN0b3JhZ2U6IElQcm9qZWN0U3RvcmFnZSxcbiAgICBwYXJlbnQ6IElPYmplY3REZWYsXG4gICAgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuXG4gICAgc3VwZXIoc3RvcmFnZSwgcGFyZW50LCBpZCwgJ0Nvc3R1bWUnKTtcbiAgICBzdG9yYWdlLnJlZ2lzdGVyUmVjZWl2ZXIodGhpcy5pZCwgdGhpcyk7XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCB0aGlzLnBhcmVudD8uaWQsIHRoaXMuY3JlYXRlVXBkYXRlT3AoKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUltYWdlKGltYWdlRGF0YTogSW1hZ2VEYXRhKSB7XG4gICAgdGhpcy5pbWFnZURhdGEgPSBpbWFnZURhdGE7XG4gICAgdGhpcy5fdmVyc2lvbisrO1xuXG4gICAgbGV0IHNwcml0ZSA9IHRoaXMucGFyZW50IGFzIFNwcml0ZURlZjtcbiAgICBpZiAoc3ByaXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNwcml0ZS5vbkNvc3R1bWVDaGFuZ2UuaW52b2tlKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0b3JhZ2Uuc2V0SXRlbSh0aGlzLmlkLCB0aGlzLnBhcmVudD8uaWQsIHRoaXMuY3JlYXRlVXBkYXRlT3AoKSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21PcChzdG9yYWdlOiBJUHJvamVjdFN0b3JhZ2UsIHBhcmVudDogSU9iamVjdERlZiwgaWQ6IHN0cmluZywgb3A6IGFueSkge1xuICAgIGxldCBjb3N0dW1lID0gbmV3IENvc3R1bWVEZWYoc3RvcmFnZSwgcGFyZW50LCBpZCk7XG4gICAgY29zdHVtZS5wcm9jZXNzU2V0KG9wKTtcbiAgICByZXR1cm4gY29zdHVtZTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9jZXNzU2V0KG9wOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm5hbWUgPSBvcC5uYW1lO1xuICAgIHRoaXMuaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShvcC5pbWFnZUZvcm1hdCwgb3AuaW1hZ2UsIG9wLmltYWdlSWQpO1xuICAgIHRoaXMuX3ZlcnNpb24rKztcbiAgfVxuXG4gIHB1YmxpYyBwcm9jZXNzQWRkKGNoaWxkSWQ6IHN0cmluZywgb3A6IGFueSk6IHZvaWQge1xuICAgIHRocm93ICdub3QgaW1wbGVtZW50ZWQnO1xuICB9XG5cbiAgcHVibGljIGdldFNwcml0ZVNvdXJjZSgpIHtcbiAgICBpZiAodGhpcy5fY2FjaGVkU3ByaXRlU291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX2NhY2hlZFNwcml0ZVNvdXJjZSA9IG5ldyBDb3N0dW1lSW1hZ2UodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jYWNoZWRTcHJpdGVTb3VyY2U7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVVwZGF0ZU9wKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0YXJnZXQ6ICdDb3N0dW1lJyxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGltYWdlOiB0aGlzLmltYWdlRGF0YT8uaW1hZ2UsXG4gICAgICBpbWFnZUZvcm1hdDogdGhpcy5pbWFnZURhdGE/LmltYWdlRm9ybWF0LFxuICAgICAgaW1hZ2VJZDogdGhpcy5pbWFnZURhdGE/LmltYWdlSWRcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvc3R1bWVJbWFnZSBpbXBsZW1lbnRzIElTcHJpdGVTb3VyY2Uge1xuICBwcml2YXRlIF9pbWFnZTogYW55O1xuICBwcml2YXRlIF9jb3N0dW1lVmVyc2lvbjogbnVtYmVyO1xuICBwcml2YXRlIF9jb3N0dW1lOiBDb3N0dW1lRGVmO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb3N0dW1lOiBDb3N0dW1lRGVmKSB7XG4gICAgdGhpcy5fY29zdHVtZSA9IGNvc3R1bWU7XG4gICAgdGhpcy5fY29zdHVtZVZlcnNpb24gPSB0aGlzLl9jb3N0dW1lLnZlcnNpb247XG4gICAgdGhpcy5sb2FkSW1hZ2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KGN0eDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY29zdHVtZVZlcnNpb24gIT09IHRoaXMuX2Nvc3R1bWUudmVyc2lvbikge1xuICAgICAgdGhpcy5sb2FkSW1hZ2UoKTtcbiAgICB9XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuX2ltYWdlLCB4LCB5LCB3LCBoKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEltYWdlKCkge1xuICAgIHRoaXMuX2ltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5faW1hZ2Uuc3JjID0gdGhpcy5fY29zdHVtZS5pbWFnZURhdGE/LmltYWdlO1xuICAgIHRoaXMuX2Nvc3R1bWVWZXJzaW9uID0gdGhpcy5fY29zdHVtZS52ZXJzaW9uO1xuICB9XG59XG4iLCJleHBvcnQgZW51bSBTdG9yYWdlT3BLaW5kIHtcbiAgcmVtb3ZlID0gJ3JlbW92ZScsXG4gIC8qKiB1cGRhdGUgaXRlbSAqL1xuICBzZXQgPSAnc2V0JyxcbiAgYXBwZW5kID0gJ2FwcGVuZCcsXG4gIHNjcmVlblJlYWR5ID0gJ3NjcmVlblJlYWR5JyxcbiAgc2VsZWN0U3ByaXRlID0gJ3NlbGVjdFNwcml0ZSdcbn1cblxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VPcCB7XG4gIHB1YmxpYyByZWFkb25seSBraW5kOiBTdG9yYWdlT3BLaW5kO1xuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBhcmVudDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioa2luZDogU3RvcmFnZU9wS2luZCwgaWQ6IHN0cmluZywgcGFyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsIHZhbHVlOiBhbnkgPSBudWxsKSB7XG4gICAgdGhpcy5raW5kID0ga2luZDtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0b3JhZ2VPcFJlY2VpdmVyIHtcbiAgcHJvY2Vzc1NldChvcDogYW55KTogdm9pZDtcbiAgcHJvY2Vzc0FkZChjaGlsZElkOiBzdHJpbmcsIG9wOiBhbnkpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0U3RvcmFnZSB7XG4gIHVwZGF0ZVNuYXBzaG90KGpzb246IHN0cmluZyk6IHZvaWQ7XG4gIHNldEl0ZW0oaWQ6IHN0cmluZywgcGFyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQsIHZhbHVlOiBhbnkpOiB2b2lkO1xuICByZW1vdmVJdGVtKGlkOiBzdHJpbmcpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiB0cmVhdHMgaXRlbXMgYXMgYXJyYXkgb2YgdmFsdWVzXG4gICAqL1xuICBhcHBlbmRJdGVtcyhpZDogc3RyaW5nLCBwYXJlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgdmFsdWU6IGFueVtdKTogdm9pZDtcblxuICBwcm9jZXNzUmVtb3RlT3Aob3A6IFN0b3JhZ2VPcCk6IHZvaWQ7XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmdW5jOiAob3A6IFN0b3JhZ2VPcFtdKSA9PiB2b2lkKTogdm9pZDtcbiAgdW5yZWdpc3Rlck9uQ2hhbmdlKGZ1bmM6IChvcDogU3RvcmFnZU9wW10pID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiByZWdpc3RlciByZWNlaXZlciBmb3IgcHJvY2Vzc2luZyBvZiByZW1vdGUgb3BzXG4gICAqL1xuICByZWdpc3RlclJlY2VpdmVyKGlkOiBzdHJpbmcsIHJlY2VpdmVyOiBJU3RvcmFnZU9wUmVjZWl2ZXIpOiB2b2lkO1xuXG4gIHRvSnNvbigpOiBzdHJpbmc7XG59XG5cbiIsImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgSVByb2plY3RTdG9yYWdlIH0gZnJvbSAnLi9JUHJvamVjdFN0b3JhZ2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPYmplY3REZWYge1xuICBnZXQgaWQoKTogc3RyaW5nO1xuICAvLyBnZXQgcGF0aCgpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3REZWYgaW1wbGVtZW50cyBJT2JqZWN0RGVmIHtcbiAgcHVibGljIGlkOiBzdHJpbmc7XG4gIHB1YmxpYyBwYXJlbnQ6IElPYmplY3REZWYgfCB1bmRlZmluZWQ7XG4gIHByb3RlY3RlZCBfc3RvcmFnZTogSVByb2plY3RTdG9yYWdlO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBzdG9yYWdlOiBJUHJvamVjdFN0b3JhZ2UsXG4gICAgcGFyZW50OiBJT2JqZWN0RGVmIHwgdW5kZWZpbmVkLFxuICAgIGlkOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gICAgdGFnOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcblxuICAgIHRoaXMuaWQgPSAoaWQpID8gaWQgOiB1dWlkdjQoKTtcbiAgICAvLyBjb25zb2xlLmxvZygnT2JqZWN0UmVmOiAnICsgdGhpcy5pZCArICcgJyArIHRhZyk7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fc3RvcmFnZSA9IHN0b3JhZ2U7XG4gIH1cbn1cbiIsImltcG9ydCBBc3luY0V2ZW50U291cmNlIGZyb20gJy4vQXN5bmNFdmVudFNvdXJjZSc7XG5pbXBvcnQgeyBJUHJvamVjdFN0b3JhZ2UsIElTdG9yYWdlT3BSZWNlaXZlciwgU3RvcmFnZU9wLCBTdG9yYWdlT3BLaW5kIH0gZnJvbSAnLi9JUHJvamVjdFN0b3JhZ2UnO1xuaW1wb3J0IHsgUHJvamVjdExvY2FsU3RvcmFnZSB9IGZyb20gJy4vUHJvamVjdFN0b3JhZ2UnO1xuaW1wb3J0IHsgT2JqZWN0RGVmLCBJT2JqZWN0RGVmIH0gZnJvbSAnLi9PYmplY3REZWYnO1xuaW1wb3J0IHsgQ29kZUZpbGVEZWYgfSBmcm9tICcuL0NvZGVGaWxlRGVmJztcbmltcG9ydCB7IFNwcml0ZURlZiwgU3ByaXRlRGVmQ29sbGVjdGlvbiB9IGZyb20gJy4vU3ByaXRlRGVmJztcbmltcG9ydCB7IFRpbGVMZXZlbERlZiwgVGlsZUxldmVsUHJvcHMgfSBmcm9tICcuL1RpbGVMZXZlbERlZic7XG5pbXBvcnQgeyBTY3JlZW5EZWYgfSBmcm9tICcuL1NjcmVlbkRlZic7XG5cbi8qKlxuICogdXRpbGl0eSBtZXRob2QgZm9yIG1hbmFnaW5nIHByb2plY3RcbiAqL1xuZXhwb3J0IGNsYXNzIFByb2plY3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgc2NyZWVuOiBTY3JlZW5EZWY7XG4gIHB1YmxpYyByZWFkb25seSBfc3RvcmFnZTogUHJvamVjdExvY2FsU3RvcmFnZTtcblxuICBwdWJsaWMgZ2V0IHN0b3JhZ2UoKTogSVByb2plY3RTdG9yYWdlIHsgcmV0dXJuIHRoaXMuX3N0b3JhZ2U7IH1cblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc3RvcmFnZTogUHJvamVjdExvY2FsU3RvcmFnZSwgZGVmOiBTY3JlZW5EZWYpIHtcbiAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcbiAgICB0aGlzLnNjcmVlbiA9IGRlZjtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlRW1wdHlQcm9qZWN0KCk6IFByb2plY3Qge1xuICAgIGxldCBzdG9yYWdlID0gbmV3IFByb2plY3RMb2NhbFN0b3JhZ2UoKTtcblxuICAgIGxldCBsZXZlbFByb3BzID0ge1xuICAgICAgZ3JpZFdpZHRoOiA0OCxcbiAgICAgIGdyaWRIZWlnaHQ6IDgsXG4gICAgICB0aWxlV2lkdGg6IDMyLFxuICAgICAgdGlsZUhlaWdodDogMzJcbiAgICB9O1xuXG4gICAgbGV0IGdyaWRIZWlnaHQgPSA4O1xuICAgIGxldCBzY3JlZW4gPSBuZXcgU2NyZWVuRGVmKFxuICAgICAgc3RvcmFnZSxcbiAgICAgIHtcbiAgICAgICAgc2NyZWVuV2lkdGg6IGxldmVsUHJvcHMudGlsZVdpZHRoICogMjAsXG4gICAgICAgIHNjcmVlbkhlaWdodDogbGV2ZWxQcm9wcy50aWxlSGVpZ2h0ICogOFxuICAgICAgfSk7XG5cbiAgICBzY3JlZW4uY3JlYXRlTGV2ZWwobGV2ZWxQcm9wcyk7XG5cbiAgICAvLyBjcmVhdGUgYSBkZWZhdWx0IHNwcml0ZVxuICAgIHNjcmVlbi5jcmVhdGVTcHJpdGUoJ0xlaWEnKTtcbiAgICBzY3JlZW4uY3JlYXRlU3ByaXRlKCdGbG9vcicpO1xuICAgIHNjcmVlbi5jcmVhdGVTcHJpdGUoJ0FpcicpO1xuXG4gICAgc2NyZWVuLmxldmVsLnNldFRpbGVzKFtcbiAgICAgIHsgc3ByaXRlOiBzY3JlZW4uc3ByaXRlcy5nZXRCeU5hbWVPclRocm93KCdMZWlhJyksIHg6IDAsIHk6IDAgfSxcbiAgICAgIHsgc3ByaXRlOiBzY3JlZW4uc3ByaXRlcy5nZXRCeU5hbWVPclRocm93KCdMZWlhJyksIHg6IDEsIHk6IDAgfSxcbiAgICAgIHsgc3ByaXRlOiBzY3JlZW4uc3ByaXRlcy5nZXRCeU5hbWVPclRocm93KCdMZWlhJyksIHg6IDIsIHk6IDAgfV0pO1xuXG4gICAgc2NyZWVuLmNvZGVGaWxlLmNyZWF0ZUJsb2NrKCd1cGRhdGVTY2VuZScsICcvLyBwdXQgY29kZSB0byB1cGRhdGUgc2NlbmUgaGVyZScpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9qZWN0KHN0b3JhZ2UsIHNjcmVlbik7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaFNwcml0ZShmdW5jOiAoZmlsZTogU3ByaXRlRGVmKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5zY3JlZW4uc3ByaXRlcy5mb3JFYWNoKCh4OiBTcHJpdGVEZWYpID0+IGZ1bmMoeCkpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2hDb2RlRmlsZShmdW5jOiAoZmlsZTogQ29kZUZpbGVEZWYpID0+IHZvaWQpIHtcbiAgICBmdW5jKHRoaXMuc2NyZWVuLmNvZGVGaWxlKTtcbiAgICBpZiAodGhpcy5zY3JlZW4ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVuYyh0aGlzLnNjcmVlbi5sZXZlbD8uY29kZUZpbGUpO1xuICAgIH1cbiAgICB0aGlzLnNjcmVlbi5zcHJpdGVzLmZvckVhY2goKHg6IFNwcml0ZURlZikgPT4gZnVuYyh4LmNvZGVGaWxlKSk7XG4gIH1cblxuICBwdWJsaWMgZmluZENvZGVGaWxlQnlJZChpZDogc3RyaW5nKTogQ29kZUZpbGVEZWYgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLnNjcmVlbi5jb2RlRmlsZS5pZCA9PT0gaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNjcmVlbi5jb2RlRmlsZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JlZW4ubGV2ZWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNjcmVlbi5sZXZlbC5jb2RlRmlsZS5pZCA9PT0gaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNjcmVlbi5sZXZlbC5jb2RlRmlsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zY3JlZW4uc3ByaXRlcy5maW5kKCh4OiBTcHJpdGVEZWYpID0+IHguY29kZUZpbGUuaWQgPT09IGlkKT8uY29kZUZpbGU7XG4gIH1cblxuICBwdWJsaWMgZmluZFNwcml0ZUJ5SWQoaWQ6IHN0cmluZyk6IFNwcml0ZURlZiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuLnNwcml0ZXMuZ2V0QnlJZChpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZSgpIHtcblxuICB9XG59XG5cbi8vbGV0IHByb2plY3QgPSBQcm9qZWN0LmNyZWF0ZUVtcHR5UHJvamVjdCgpO1xuLy9leHBvcnQgeyBwcm9qZWN0IH07IiwiaW1wb3J0IHsgSVByb2plY3RTdG9yYWdlLCBJU3RvcmFnZU9wUmVjZWl2ZXIsIFN0b3JhZ2VPcCwgU3RvcmFnZU9wS2luZCB9IGZyb20gJy4vSVByb2plY3RTdG9yYWdlJztcbmltcG9ydCBBc3luY0V2ZW50U291cmNlIGZyb20gJy4vQXN5bmNFdmVudFNvdXJjZSc7XG5cbmV4cG9ydCBjbGFzcyBQcm9qZWN0TG9jYWxTdG9yYWdlIGltcGxlbWVudHMgSVByb2plY3RTdG9yYWdlIHtcbiAgcHJpdmF0ZSBfZGF0YTogeyBba2V5OiBzdHJpbmddOiB7IHBhcmVudDogc3RyaW5nIHwgdW5kZWZpbmVkLCB2YWx1ZTogYW55IH0gfSA9IHt9O1xuICBwcml2YXRlIF9yZWNlaXZlcnM6IHsgW2tleTogc3RyaW5nXTogV2Vha1JlZjxJU3RvcmFnZU9wUmVjZWl2ZXI+IH0gPSB7fVxuICBwcml2YXRlIF9vbkNoYW5nZTogQXN5bmNFdmVudFNvdXJjZTwoY29zdHVtZTogU3RvcmFnZU9wW10pID0+IHZvaWQ+ID0gbmV3IEFzeW5jRXZlbnRTb3VyY2U8KGNvc3R1bWU6IFN0b3JhZ2VPcFtdKSA9PiB2b2lkPigpO1xuICBwcml2YXRlIF9jaGFuZ2VRdWV1ZTogU3RvcmFnZU9wW10gPSBbXTtcbiAgcHJpdmF0ZSBfdXBkYXRlUGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm9uSW52b2tlQ29tcGxldGUgPSB0aGlzLm9uSW52b2tlQ29tcGxldGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVTbmFwc2hvdChqc29uOiBzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgfVxuICBwdWJsaWMgc2V0SXRlbShpZDogc3RyaW5nLCBwYXJlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCwgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2RhdGFbaWRdID0geyBwYXJlbnQ6IHBhcmVudCwgdmFsdWU6IHZhbHVlIH07XG4gICAgdGhpcy5xdWV1ZUNoYW5nZShuZXcgU3RvcmFnZU9wKFN0b3JhZ2VPcEtpbmQuc2V0LCBpZCwgcGFyZW50LCB2YWx1ZSkpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUl0ZW0oaWQ6IHN0cmluZykge1xuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2lkXTtcbiAgICB0aGlzLnF1ZXVlQ2hhbmdlKG5ldyBTdG9yYWdlT3AoU3RvcmFnZU9wS2luZC5yZW1vdmUsIGlkKSk7XG4gIH1cblxuICBwdWJsaWMgYXBwZW5kSXRlbXMoaWQ6IHN0cmluZywgcGFyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQsIHZhbHVlOiBhbnlbXSkge1xuICAgIGxldCBpdGVtID0gdGhpcy5fZGF0YVtpZF07XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgaXRlbSA9IHsgcGFyZW50OiBwYXJlbnQsIHZhbHVlOiBbXSB9O1xuICAgICAgdGhpcy5fZGF0YVtpZF0gPSBpdGVtO1xuICAgIH1cblxuICAgIHZhbHVlLmZvckVhY2goeCA9PiBpdGVtLnZhbHVlLnB1c2goeCkpO1xuXG4gICAgdGhpcy5xdWV1ZUNoYW5nZShuZXcgU3RvcmFnZU9wKFN0b3JhZ2VPcEtpbmQuYXBwZW5kLCBpZCwgdW5kZWZpbmVkLCB2YWx1ZSkpO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NSZW1vdGVPcChvcDogU3RvcmFnZU9wKSB7XG4gICAgc3dpdGNoIChvcC5raW5kKSB7XG4gICAgICBjYXNlIFN0b3JhZ2VPcEtpbmQuc2V0OlxuICAgICAgICB0aGlzLnByb2Nlc3NTZXRPcChvcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTdG9yYWdlT3BLaW5kLmFwcGVuZDpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFN0b3JhZ2VPcEtpbmQucmVtb3ZlOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtvcC5pZF07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGVzIG5ldyBvciB1cGRhdGVzIGV4aXN0aW5nIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc1NldE9wKG9wOiBTdG9yYWdlT3ApIHtcbiAgICBsZXQgd2Vha1JlY2VpdmVyID0gdGhpcy5fcmVjZWl2ZXJzW29wLmlkXTtcblxuICAgIC8vIGlmIHdlIGRvIG5vdCBoYXZlIG9iamVjdCwgdHJ5IHRvIGNyZWF0ZSBvbmUgaW4gcGFyZW50XG4gICAgaWYgKCF3ZWFrUmVjZWl2ZXIpIHtcbiAgICAgIGlmIChvcC5wYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyAnUHJvamVjdExvY2FsU3RvcmFnZTogb3AucGFyZW50IHVuZGVmaW5lZCc7XG4gICAgICB9XG4gICAgICBsZXQgd2Vha1BhcmVudCA9IHRoaXMuX3JlY2VpdmVyc1tvcC5wYXJlbnRdO1xuICAgICAgaWYgKCF3ZWFrUGFyZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQcm9qZWN0TG9jYWxTdG9yYWdlOiBwYXJlbnQgbm90IHJlZ2lzdGVyZWQ6ICcgKyBvcC5wYXJlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBwYXJlbnQgPSB3ZWFrUGFyZW50LmRlcmVmKCk7XG4gICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnUHJvamVjdExvY2FsU3RvcmFnZTogcGFyZW50IHJlbGVhc2VkOiAnICsgb3AucGFyZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQucHJvY2Vzc0FkZChvcC5pZCwgb3AudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVjZWl2ZXIgPSB3ZWFrUmVjZWl2ZXIuZGVyZWYoKTtcbiAgICAgIGlmICghcmVjZWl2ZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1Byb2plY3RMb2NhbFN0b3JhZ2U6IG9iamVjdCByZWxlYXNlZDogJyArIG9wLmlkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWNlaXZlci5wcm9jZXNzU2V0KG9wLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHF1ZXVlQ2hhbmdlKG9wOiBTdG9yYWdlT3ApIHtcbiAgICB0aGlzLl9jaGFuZ2VRdWV1ZS5wdXNoKG9wKTtcbiAgICBpZiAoIXRoaXMuX3VwZGF0ZVBlbmRpbmcpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBlbmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fb25DaGFuZ2UuaW52b2tlV2l0aENvbXBsZXRpb24odGhpcy5vbkludm9rZUNvbXBsZXRlLCB0aGlzLl9jaGFuZ2VRdWV1ZSk7XG4gICAgICB0aGlzLl9jaGFuZ2VRdWV1ZSA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25JbnZva2VDb21wbGV0ZSgpIHtcbiAgICB0aGlzLl91cGRhdGVQZW5kaW5nID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuX2NoYW5nZVF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVBlbmRpbmcgPSB0cnVlO1xuICAgIHRoaXMuX29uQ2hhbmdlLmludm9rZVdpdGhDb21wbGV0aW9uKHRoaXMub25JbnZva2VDb21wbGV0ZSwgdGhpcy5fY2hhbmdlUXVldWUpO1xuICAgIHRoaXMuX2NoYW5nZVF1ZXVlID0gW107XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmdW5jOiAob3A6IFN0b3JhZ2VPcFtdKSA9PiB2b2lkKSB7XG4gICAgLy8gc2VuZCBjdXJyZW50IHN0YXRlIHRvIHNpbmtcbiAgICBsZXQgb3BzID0gdGhpcy5tYWtlUG9wdWxhdGVMaXN0KCk7XG5cbiAgICBmdW5jKG9wcyk7XG5cbiAgICAvLyByZWdpc3RlciB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnNcbiAgICB0aGlzLl9vbkNoYW5nZS5hZGQoZnVuYyk7XG4gIH1cblxuICBwdWJsaWMgdW5yZWdpc3Rlck9uQ2hhbmdlKGZ1bmM6IChvcDogU3RvcmFnZU9wW10pID0+IHZvaWQpIHtcbiAgICB0aGlzLl9vbkNoYW5nZS5yZW1vdmUoZnVuYyk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSZWNlaXZlcihpZDogc3RyaW5nLCByZWNlaXZlcjogSVN0b3JhZ2VPcFJlY2VpdmVyKTogdm9pZCB7XG4gICAgdGhpcy5fcmVjZWl2ZXJzW2lkXSA9IG5ldyBXZWFrUmVmPElTdG9yYWdlT3BSZWNlaXZlcj4ocmVjZWl2ZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYWtlUG9wdWxhdGVPcChcbiAgICBpZDogc3RyaW5nLFxuICAgIG9wczogYW55W10sXG4gICAgd3JpdHRlbk9wczogU2V0PHN0cmluZz4pIHtcblxuICAgIGlmICh3cml0dGVuT3BzLmhhcyhpZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFbaWRdO1xuICAgIGlmIChkYXRhLnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXdyaXR0ZW5PcHMuaGFzKGRhdGEucGFyZW50KSkge1xuICAgICAgICB0aGlzLm1ha2VQb3B1bGF0ZU9wKGRhdGEucGFyZW50LCBvcHMsIHdyaXR0ZW5PcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBjb25zb2xlLmxvZygnYXBwZW5kIDogJyArIGRhdGEudmFsdWUubGVuZ3RoKTtcbiAgICAgIG9wcy5wdXNoKG5ldyBTdG9yYWdlT3AoU3RvcmFnZU9wS2luZC5hcHBlbmQsIGlkLCBkYXRhLnBhcmVudCwgZGF0YS52YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHMucHVzaChuZXcgU3RvcmFnZU9wKFN0b3JhZ2VPcEtpbmQuc2V0LCBpZCwgZGF0YS5wYXJlbnQsIGRhdGEudmFsdWUpKTtcbiAgICB9XG4gICAgd3JpdHRlbk9wcy5hZGQoaWQpO1xuICB9XG5cbiAgLyoqIGdlbmVyYXRlcyBsaXN0IG9mIG9wcyBpbiBkZXBlbmRlbmN5IG9yZGVyXG4gICAqIG9wcyB3aXRob3V0IGRlcGVuZGVuY2llcyBnbyBmaXJzdFxuICAgKi9cbiAgcHJpdmF0ZSBtYWtlUG9wdWxhdGVMaXN0KCk6IGFueVtdIHtcbiAgICBsZXQgb3BzOiBhbnlbXSA9IFtdO1xuICAgIGxldCB3cml0dGVuT3BzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMuX2RhdGEpIHtcbiAgICAgIHRoaXMubWFrZVBvcHVsYXRlT3AoaWQsIG9wcywgd3JpdHRlbk9wcyk7XG4gICAgfVxuICAgIHJldHVybiBvcHM7XG4gIH1cblxuICBwdWJsaWMgdG9Kc29uKCk6IHN0cmluZyB7XG4gICAgbGV0IG9wcyA9IHRoaXMubWFrZVBvcHVsYXRlTGlzdCgpO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9wcyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjcmVlbkRlZiB9IGZyb20gJy4vU2NyZWVuRGVmJztcbmltcG9ydCB7IElMZXZlbCwgVGlsZUxldmVsIH0gZnJvbSAnLi9UaWxlTGV2ZWwnXG5cbmV4cG9ydCBjbGFzcyBTY3JlZW4ge1xuICBwcml2YXRlIF9kZWY6IFNjcmVlbkRlZjtcbiAgcHJpdmF0ZSBfbGV2ZWw6IElMZXZlbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBfY2FudmFzOiBhbnkgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgX3dpZHRoOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX2NhbWVyYVg6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX2NhbWVyYVk6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX3Njcm9sbFg6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX2VkaXRNb2RlOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZ2V0IHNjcm9sbFgoKSB7IHJldHVybiB0aGlzLl9zY3JvbGxYOyB9XG4gIHB1YmxpYyBnZXQgd2lkdGgoKSB7IHJldHVybiB0aGlzLl93aWR0aDsgfVxuICBwdWJsaWMgZ2V0IGhlaWdodCgpIHsgcmV0dXJuIHRoaXMuX2hlaWdodDsgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihkZWY6IFNjcmVlbkRlZikge1xuICAgIHRoaXMuX2RlZiA9IGRlZjtcblxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgICB0aGlzLl9kZWYub25DaGFuZ2UuYWRkKCgpID0+IHRoaXMub25TY3JlZW5DaGFuZ2UoKSlcbiAgfVxuXG4gIC8vIHNjcmVlbiBpcyBhIG1haW4gb2JqZWN0IG9mIHRoZSBnYW1lXG4gIHB1YmxpYyBzZXRMZXZlbChsZXZlbDogSUxldmVsKSB7XG4gICAgdGhpcy5fbGV2ZWwgPSBsZXZlbDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDYW52YXMoY2FudmFzOiBhbnkpIHtcbiAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XG4gICAgY2FudmFzLndpZHRoID0gdGhpcy5fd2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHRoaXMuX2hlaWdodDtcbiAgICB0aGlzLl9jYW1lcmFYID0gMDtcbiAgICB0aGlzLl9jYW1lcmFZID0gMDtcblxuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHNlbGYuX3JlcGFpbnQoKSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RWRpdE1vZGUoZWRpdDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VkaXRNb2RlID0gZWRpdDtcbiAgICB0aGlzLl9sZXZlbD8uc2V0RWRpdE1vZGUoZWRpdCk7XG4gIH1cblxuICBwdWJsaWMgb25TY3JlZW5DaGFuZ2UoKSB7XG4gICAgaWYgKHRoaXMuX3dpZHRoICE9PSB0aGlzLl9kZWYucHJvcHMuc2NyZWVuV2lkdGggfHxcbiAgICAgIHRoaXMuX2hlaWdodCAhPT0gdGhpcy5fZGVmLnByb3BzLnNjcmVlbkhlaWdodCkge1xuXG4gICAgICBjb25zb2xlLmxvZygndXBkYXRlIHBhcmFtZXRlcnMnKTtcbiAgICAgIHRoaXMuX3dpZHRoID0gdGhpcy5fZGVmLnByb3BzLnNjcmVlbldpZHRoO1xuICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5fZGVmLnByb3BzLnNjcmVlbkhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2NhbnZhcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NhbnZhcy53aWR0aCA9IHRoaXMuX3dpZHRoO1xuICAgICAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9sZXZlbCA9PT0gbnVsbCAmJiB0aGlzLl9kZWYubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZSBsZXZlbCcpO1xuICAgICAgdGhpcy5fbGV2ZWwgPSBuZXcgVGlsZUxldmVsKHRoaXMuX2RlZi5sZXZlbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVwYWludCBzY3JlZW4gYmFzZWQgb24gY3VycmVudCBzY3JvbGxpbmcgcG9zaXRpb25cbiAgcHVibGljIF9yZXBhaW50KCkge1xuICAgIHZhciBjdHggPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xuXG4gICAgY3R4LnRyYW5zbGF0ZSgtdGhpcy5zY3JvbGxYLCAwKTtcblxuICAgIGlmICh0aGlzLl9sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9sZXZlbC5kcmF3KGN0eCwgMCwgdGhpcy5fd2lkdGgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZWxmLl9yZXBhaW50KCkpO1xuICB9XG5cbiAgLy8gcmV0dXJucyByZWxhdGl2ZSBwb3NpdGlvbiB0byB0aGUgbGVmdCBzaWRlXG4gIHB1YmxpYyByZWxhdGl2ZVBvc1goeDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHggLSB0aGlzLnNjcm9sbFg7XG4gIH1cblxuICAvKlxuICBwdWJsaWMgc2V0Q2FtZXJhKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX2xldmVsID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWdub3JlIGJvdW5kYXJ5IGlmIHVuZGVmaW5lZFxuICAgIGlmICh0aGlzLl9jYW1lcmFYICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBzaGlmdFggPSAwO1xuXG4gICAgICBpZiAoeCA+IHRoaXMuX2NhbWVyYVgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVsYXRpdmVQb3NYKHgpID4gc2NyZWVuLndpZHRoICogMyAvIDQpIHtcbiAgICAgICAgICBzaGlmdFggPSB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoeCA8IHRoaXMuX2NhbWVyYVgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVsYXRpdmVQb3NYKHgpID4gdGhpcy53aWR0aCAqIDMgLyA0KSB7XG4gICAgICAgICAgc2hpZnRYID0gLXRoaXMud2lkdGggLyAyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNjcm9sbFggKyBzaGlmdFggPiB0aGlzLl9sZXZlbC5waXhlbFdpZHRoIC0gdGhpcy5fd2lkdGgpIHtcbiAgICAgICAgc2hpZnRYID0gdGhpcy5fbGV2ZWwucGl4ZWxXaWR0aCAtIHRoaXMuX3dpZHRoIC0gdGhpcy5zY3JvbGxYO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hpZnRYICE9PSAwKSB7XG4gICAgICAgIC8vdGhpcy4kc2Nyb2xsWC5nbGlkZShzaGlmdFgsIHNoaWZ0WCAvIDEwKTtcbiAgICAgICAgdGhpcy5fc2Nyb2xsWCAtPSBzaGlmdFg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fY2FtZXJhWCA9IHg7XG4gICAgdGhpcy5fY2FtZXJhWSA9IHk7XG4gIH1cbiAgKi9cbn1cbiIsImltcG9ydCB7IElQcm9qZWN0U3RvcmFnZSwgSVN0b3JhZ2VPcFJlY2VpdmVyIH0gZnJvbSAnLi9JUHJvamVjdFN0b3JhZ2UnO1xuaW1wb3J0IHsgT2JqZWN0RGVmLCBJT2JqZWN0RGVmIH0gZnJvbSAnLi9PYmplY3REZWYnO1xuaW1wb3J0IHsgQ29kZUZpbGVEZWYgfSBmcm9tICcuL0NvZGVGaWxlRGVmJztcbmltcG9ydCB7IFNwcml0ZURlZiwgU3ByaXRlRGVmQ29sbGVjdGlvbiB9IGZyb20gJy4vU3ByaXRlRGVmJztcbmltcG9ydCB7IFRpbGVMZXZlbERlZiwgVGlsZUxldmVsUHJvcHMgfSBmcm9tICcuL1RpbGVMZXZlbERlZic7XG5pbXBvcnQgQXN5bmNFdmVudFNvdXJjZSBmcm9tICcuL0FzeW5jRXZlbnRTb3VyY2UnO1xuXG5leHBvcnQgY2xhc3MgU2NyZWVuRGVmIGV4dGVuZHMgT2JqZWN0RGVmIGltcGxlbWVudHMgSVN0b3JhZ2VPcFJlY2VpdmVyIHtcbiAgLyoqXG4gICAqIGNvbGxlY3Rpb24gb2YgYWxsIHNwcml0ZXMgaW4gYSBnYW1lXG4gICAqL1xuICBwcml2YXRlIF9zcHJpdGVzOiBTcHJpdGVEZWZDb2xsZWN0aW9uID0gbmV3IFNwcml0ZURlZkNvbGxlY3Rpb24oKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBwcml2YXRlIF9sZXZlbDogVGlsZUxldmVsRGVmO1xuICAvLyBAdHMtaWdub3JlXG4gIHByaXZhdGUgX2NvZGVGaWxlOiBDb2RlRmlsZURlZjtcblxuICBwdWJsaWMgZ2V0IHNwcml0ZXMoKTogU3ByaXRlRGVmQ29sbGVjdGlvbiB7IHJldHVybiB0aGlzLl9zcHJpdGVzOyB9XG4gIHB1YmxpYyBnZXQgbGV2ZWwoKTogVGlsZUxldmVsRGVmIHsgcmV0dXJuIHRoaXMuX2xldmVsOyB9XG4gIHB1YmxpYyBnZXQgY29kZUZpbGUoKTogQ29kZUZpbGVEZWYgeyByZXR1cm4gdGhpcy5fY29kZUZpbGU7IH1cbiAgcHVibGljIHJlYWRvbmx5IG9uQ2hhbmdlOiBBc3luY0V2ZW50U291cmNlPCgpID0+IHZvaWQ+ID0gbmV3IEFzeW5jRXZlbnRTb3VyY2U8KCkgPT4gdm9pZD4oKTtcblxuICAvLyBAdHMtaWdub3JlXG4gIHB1YmxpYyBwcm9wczoge1xuICAgIHNjcmVlbldpZHRoOiBudW1iZXIsXG4gICAgc2NyZWVuSGVpZ2h0OiBudW1iZXIsXG4gIH07XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHN0b3JhZ2U6IElQcm9qZWN0U3RvcmFnZSxcbiAgICBwcm9wczoge1xuICAgICAgc2NyZWVuV2lkdGg6IG51bWJlcixcbiAgICAgIHNjcmVlbkhlaWdodDogbnVtYmVyXG4gICAgfSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xuXG4gICAgc3VwZXIoc3RvcmFnZSwgdW5kZWZpbmVkLCAnc2NyZWVuJyk7XG5cbiAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcbiAgICBzdG9yYWdlLnJlZ2lzdGVyUmVjZWl2ZXIodGhpcy5pZCwgdGhpcyk7XG5cbiAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgdGhpcy5fY29kZUZpbGUgPSBuZXcgQ29kZUZpbGVEZWYoc3RvcmFnZSwgdGhpcywgdW5kZWZpbmVkLCAnZ2FtZScpO1xuICAgICAgc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHVuZGVmaW5lZCwgdGhpcy5jcmVhdGVVcGRhdGVPcCgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTGV2ZWwocHJvcHM6IFRpbGVMZXZlbFByb3BzKTogVGlsZUxldmVsRGVmIHtcbiAgICB0aGlzLl9sZXZlbCA9IG5ldyBUaWxlTGV2ZWxEZWYodGhpcy5fc3RvcmFnZSwgdGhpcywgdW5kZWZpbmVkLCBwcm9wcywgdGhpcy5fc3ByaXRlcyk7XG4gICAgcmV0dXJuIHRoaXMubGV2ZWw7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc1NldChvcDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wcm9wcyA9IG9wLnByb3BzO1xuICB9XG5cbiAgcHVibGljIHByb2Nlc3NBZGQoY2hpbGRJZDogc3RyaW5nLCBvcDogYW55KTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ3Byb2Nlc3NBZGQ6JyArIG9wLnRhcmdldCArICcgJyArIGNoaWxkSWQpO1xuICAgIGlmIChvcC50YXJnZXQgPT09ICdTcHJpdGUnKSB7XG4gICAgICB0aGlzLnNwcml0ZXMucHVzaChTcHJpdGVEZWYuZnJvbU9wKHRoaXMuX3N0b3JhZ2UsIHRoaXMsIGNoaWxkSWQsIG9wKSk7XG4gICAgfSBlbHNlIGlmIChvcC50YXJnZXQgPT09ICdUaWxlTGV2ZWwnKSB7XG4gICAgICB0aGlzLl9sZXZlbCA9IFRpbGVMZXZlbERlZi5mcm9tT3AodGhpcy5fc3RvcmFnZSwgdGhpcywgY2hpbGRJZCwgdGhpcy5fc3ByaXRlcywgb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb2RlRmlsZSA9IENvZGVGaWxlRGVmLmZyb21PcCh0aGlzLl9zdG9yYWdlLCB0aGlzLCBjaGlsZElkLCBvcCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVVcGRhdGVPcCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFyZ2V0OiAnUHJvamVjdCcsXG4gICAgICBwcm9wczogdGhpcy5wcm9wcyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0U2l6ZShzY3JlZW5XaWR0aDogbnVtYmVyLCBzY3JlZW5IZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMucHJvcHMuc2NyZWVuV2lkdGggPSBzY3JlZW5XaWR0aDtcbiAgICB0aGlzLnByb3BzLnNjcmVlbkhlaWdodCA9IHNjcmVlbkhlaWdodDtcblxuICAgIHRoaXMuX3N0b3JhZ2Uuc2V0SXRlbSgnc2NyZWVuJywgdW5kZWZpbmVkLCB0aGlzLmNyZWF0ZVVwZGF0ZU9wKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBzcHJpdGUgYW5kIGFkZHMgaXQgdG8gdGhlIGxpc3RcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTcHJpdGUobmFtZTogc3RyaW5nKTogU3ByaXRlRGVmIHtcbiAgICBsZXQgc3ByaXRlID0gbmV3IFNwcml0ZURlZih0aGlzLl9zdG9yYWdlLCB0aGlzLCB1bmRlZmluZWQsIG5hbWUpO1xuICAgIHRoaXMuc3ByaXRlcy5wdXNoKHNwcml0ZSk7XG4gICAgcmV0dXJuIHNwcml0ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3ByaXRlRGVmIH0gZnJvbSAnLi9TcHJpdGVEZWYnO1xuaW1wb3J0IHsgYW5pbWF0b3IgfSBmcm9tICcuL2FuaW1hdG9yJztcbmltcG9ydCB7IElTcHJpdGVTb3VyY2UsIFNwcml0ZUltYWdlIH0gZnJvbSAnLi9TcHJpdGVTb3VyY2UnO1xuXG5leHBvcnQgdHlwZSBTcHJpdGVQcm9wcyA9IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHc6IG51bWJlcjtcbiAgaDogbnVtYmVyO1xuICBmbGlwSDogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjbGFzcyBTcHJpdGUge1xuICBwcml2YXRlIF9kZWY6IFNwcml0ZURlZjtcbiAgcHJpdmF0ZSBfY29zdHVtZUluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgaWQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBwcm9wczogU3ByaXRlUHJvcHM7XG5cbiAgcHVibGljIGdldCB0b3AoKSB7IHJldHVybiB0aGlzLnByb3BzLnk7IH1cbiAgcHVibGljIHNldCB0b3AobmV3VmFsdWUpIHsgdGhpcy5wcm9wcy55ID0gbmV3VmFsdWU7IH1cblxuICBwdWJsaWMgZ2V0IGJvdHRvbSgpIHsgcmV0dXJuIHRoaXMucHJvcHMueSArIHRoaXMucHJvcHMuaDsgfVxuICBwdWJsaWMgc2V0IGJvdHRvbShuZXdWYWx1ZSkgeyB0aGlzLnByb3BzLnkgPSBuZXdWYWx1ZSAtIHRoaXMucHJvcHMuaDsgfVxuXG4gIHB1YmxpYyBnZXQgbGVmdCgpIHsgcmV0dXJuIHRoaXMucHJvcHMueDsgfVxuICBwdWJsaWMgc2V0IGxlZnQobmV3VmFsdWUpIHsgdGhpcy5wcm9wcy54ID0gbmV3VmFsdWU7IH1cblxuICBwdWJsaWMgZ2V0IHJpZ2h0KCkgeyByZXR1cm4gdGhpcy5wcm9wcy54ICsgdGhpcy5wcm9wcy53OyB9XG4gIHB1YmxpYyBzZXQgcmlnaHQobmV3VmFsdWUpIHsgdGhpcy5wcm9wcy54ID0gbmV3VmFsdWUgLSB0aGlzLnByb3BzLnc7IH1cblxuXG4gIC8vIGNyZWF0ZSBzcHJpdGUgb2JqZWN0XG4gIC8vIHggLSB4IGNvb3JkaW5hdGUgb2Ygc3ByaXRlXG4gIC8vIHkgLSB5IGNvb3JkaW5hdGUgb2Ygc3ByaXRlXG4gIC8vIHcgLSBzcHJpdGUgd2lkdGhcbiAgLy8gaCAtIHNwcml0ZSBoZWlnaHRcbiAgLy8gc2tpbnMgLSBhcnJheSBvZiBlaXRoZXIgc3RyaW5nIHJlc291cmNlIG5hbWVzIG9yIFNwcml0ZUltYWdlIHR5cGUgb2JqZWN0c1xuICAvLyBhbmltYXRpb25zIC0gYXJyYXkgb2YgZnVuY3Rpb25zIHdoaWNoIGluaXRpYWxpemUgYW5pbWF0aW9ucyBmb3IgdGhpcyBzcHJpdGVcbiAgLy8gICAgICAgICAgICAgIGZ1bmN0aW9ucyBzaG91bGQgdGFrZSBzcHJpdGUgYXMgcGFyYW1ldGVyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihkZWY6IFNwcml0ZURlZiwgcHJvcHM6IFNwcml0ZVByb3BzKSB7XG4gICAgdGhpcy5fZGVmID0gZGVmO1xuICAgIHRoaXMuaWQgPSBhbmltYXRvci5uZXh0SWQoKTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG5cbiAgICB0aGlzLl9jb3N0dW1lSW5kZXggPSAwO1xuICB9XG5cbiAgcHVibGljIGRyYXcoY3R4OiBhbnkpIHtcbiAgICBpZiAodGhpcy5fY29zdHVtZUluZGV4ID49IHRoaXMuX2RlZi5jb3N0dW1lcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IFwiaW52YWxpZCBza2luIGluZGV4XCI7XG4gICAgfVxuXG4gICAgbGV0IHJlc3RvcmUgPSBmYWxzZTtcbiAgICBsZXQgeCA9IHRoaXMucHJvcHMueDtcbiAgICBpZiAodGhpcy5wcm9wcy5mbGlwSCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zY2FsZSgtMSwgMSk7XG4gICAgICB4ID0gLXggLSB0aGlzLnByb3BzLnc7XG4gICAgICByZXN0b3JlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZWYuY29zdHVtZXNbdGhpcy5fY29zdHVtZUluZGV4XS5nZXRTcHJpdGVTb3VyY2UoKS5kcmF3KGN0eCwgeCwgdGhpcy5wcm9wcy55LCB0aGlzLnByb3BzLncsIHRoaXMucHJvcHMuaCk7XG5cbiAgICBpZiAocmVzdG9yZSkge1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBleGVjdXRlcyB0aW1lciBpbiBzZWNvbmRzXG4gIHB1YmxpYyBzZXRUaW1lcih0aW1lb3V0OiBudW1iZXIsIGZ1bmM6IGFueSkge1xuICAgIGlmICh0eXBlb2YgKHRpbWVvdXQpICE9ICdudW1iZXInKVxuICAgICAgdGhyb3cgJ3Bhc3MgdGltZW91dCBhcyBwYXJhbWV0ZXInO1xuXG4gICAgaWYgKHRpbWVvdXQgPCAwLjEpIHtcbiAgICAgIHRpbWVvdXQgPSAwLjE7XG4gICAgfVxuICAgIHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jLCB0aW1lb3V0KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRYWSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMucHJvcHMueCA9IHg7XG4gICAgdGhpcy5wcm9wcy55ID0geTtcbiAgfVxufVxuIiwiaW1wb3J0IEFzeW5jRXZlbnRTb3VyY2UgZnJvbSAnLi9Bc3luY0V2ZW50U291cmNlJ1xuaW1wb3J0IHsgQ29kZUZpbGVEZWYgfSBmcm9tICcuL0NvZGVGaWxlRGVmJztcbmltcG9ydCB7IE9iamVjdERlZiwgSU9iamVjdERlZiB9IGZyb20gJy4vT2JqZWN0RGVmJztcbmltcG9ydCB7IENvc3R1bWVEZWYgfSBmcm9tICcuL0Nvc3R1bWVEZWYnO1xuaW1wb3J0IHsgSVByb2plY3RTdG9yYWdlLCBJU3RvcmFnZU9wUmVjZWl2ZXIgfSBmcm9tICcuL0lQcm9qZWN0U3RvcmFnZSc7XG5pbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL1Nwcml0ZSc7XG5pbXBvcnQgeyBJU3ByaXRlU291cmNlIH0gZnJvbSAnLi9TcHJpdGVTb3VyY2UnO1xuXG4vKipcbiAqIEFUVDogYWxsIG1ldGhvZHMgc2hvdWxkIGJlIHN0YXRpYy4gV2Ugd2lsbCBkZXNlcmlhbGl6ZSBKUyBpbnRvIHRoaXMgY2xhc3Mgd2l0aG91dCBjYXN0aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBTcHJpdGVEZWYgZXh0ZW5kcyBPYmplY3REZWYgaW1wbGVtZW50cyBJU3RvcmFnZU9wUmVjZWl2ZXIge1xuICAvLyB1c2VyIGRlZmluZWQgbmFtZSBvZiB0aGUgc3ByaXRlXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnTm8gbmFtZSc7XG4gIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMDtcbiAgcHVibGljIGhlaWdodDogbnVtYmVyID0gMDtcbiAgLy8gQHRzLWlnbm9yZVxuICBwdWJsaWMgY29kZUZpbGU6IENvZGVGaWxlRGVmO1xuICBwdWJsaWMgY29zdHVtZXM6IENvc3R1bWVEZWZbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBjYWxsZWQgd2hlbiBjb3N0dW1lIGNoYW5nZXNcbiAgICovXG4gIHB1YmxpYyBvbkNvc3R1bWVDaGFuZ2UgPSBuZXcgQXN5bmNFdmVudFNvdXJjZTwoY29zdHVtZTogQ29zdHVtZURlZikgPT4gdm9pZD4oKTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgc3RvcmFnZTogSVByb2plY3RTdG9yYWdlLFxuICAgIHBhcmVudDogSU9iamVjdERlZiB8IHVuZGVmaW5lZCxcbiAgICBpZDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIG5hbWU6IHN0cmluZykge1xuXG4gICAgc3VwZXIoc3RvcmFnZSwgcGFyZW50LCBpZCwgJ1Nwcml0ZScpO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICBzdG9yYWdlLnJlZ2lzdGVyUmVjZWl2ZXIodGhpcy5pZCwgdGhpcyk7XG5cbiAgICAvLyBhZGQgb25lIGNvc3R1bWUgYnkgZGVmYXVsdFxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvZGVGaWxlID0gbmV3IENvZGVGaWxlRGVmKHN0b3JhZ2UsIHRoaXMsIHVuZGVmaW5lZCwgbmFtZSk7XG4gICAgICBzdG9yYWdlLnNldEl0ZW0odGhpcy5pZCwgdGhpcy5wYXJlbnQ/LmlkLCB0aGlzLmNyZWF0ZVVwZGF0ZU9wKCkpO1xuICAgICAgdGhpcy5jb3N0dW1lcy5wdXNoKG5ldyBDb3N0dW1lRGVmKHN0b3JhZ2UsIHRoaXMsIHVuZGVmaW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgZmlyc3RDb3N0dW1lKCk6IENvc3R1bWVEZWYgeyByZXR1cm4gdGhpcy5jb3N0dW1lc1swXSB9XG5cbiAgcHVibGljIGZpbmRDb3N0dW1lKGlkOiBzdHJpbmcpOiBDb3N0dW1lRGVmIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29zdHVtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmNvc3R1bWVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvc3R1bWVzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21PcChzdG9yYWdlOiBJUHJvamVjdFN0b3JhZ2UsIHBhcmVudDogSU9iamVjdERlZiwgaWQ6IHN0cmluZywgb3A6IGFueSk6IFNwcml0ZURlZiB7XG4gICAgbGV0IHNwcml0ZSA9IG5ldyBTcHJpdGVEZWYoc3RvcmFnZSwgcGFyZW50LCBpZCwgb3AubmFtZSk7XG4gICAgc3ByaXRlLnByb2Nlc3NTZXQob3ApO1xuICAgIHJldHVybiBzcHJpdGU7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc1NldChvcDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5uYW1lID0gb3AubmFtZTtcbiAgICB0aGlzLndpZHRoID0gb3Aud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBvcC5oZWlnaHQ7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0FkZChjaGlsZElkOiBzdHJpbmcsIG9wOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNvc3R1bWVzLnB1c2goQ29zdHVtZURlZi5mcm9tT3AodGhpcy5fc3RvcmFnZSwgdGhpcywgY2hpbGRJZCwgb3ApKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVXBkYXRlT3AoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRhcmdldDogJ1Nwcml0ZScsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBjb3N0dW1lQ291bnQ6IHRoaXMuY29zdHVtZXMubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBpc0VxdWFsKGE6IFNwcml0ZURlZiB8IHVuZGVmaW5lZCwgYjogU3ByaXRlRGVmIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgaWYgKGEgPT09IHVuZGVmaW5lZCAmJiBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICB9XG4gIH1cblxuICAvKiogXG4gICAqIGNyZWF0ZSBzcHJpdGUgb2JqZWN0LiBUaGUgc3ByaXRlIHdpbGwgaW5oZXJpdCBjb2RlIGFuZCBpbWFnZSBmcm9tIGRlZmluaXRpb24gXG4gICAqIEFUVDogaXQgc2hvdWxkIHVzZSBjdXN0b20gZHJhdyBtZXRob2QgaWYgYXZhaWxhYmxlXG4gICovXG4gIHB1YmxpYyBjcmVhdGVTcHJpdGUoYXJnczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KTogU3ByaXRlIHtcbiAgICByZXR1cm4gbmV3IFNwcml0ZSh0aGlzLCB7IHg6IGFyZ3MueCwgeTogYXJncy55LCB3OiB0aGlzLndpZHRoLCBoOiB0aGlzLmhlaWdodCwgZmxpcEg6IGZhbHNlIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwcml0ZURlZkNvbGxlY3Rpb24ge1xuICAvKipcbiAgICogY29sbGVjdGlvbiBvZiBhbGwgc3ByaXRlcyBpbiBhIGdhbWVcbiAgICovXG4gIHByaXZhdGUgX3Nwcml0ZXM6IFNwcml0ZURlZltdID0gW107XG4gIHB1YmxpYyBhc0FycmF5KCk6IFNwcml0ZURlZltdIHsgcmV0dXJuIHRoaXMuX3Nwcml0ZXM7IH1cbiAgcHVibGljIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Nwcml0ZXMubGVuZ3RoOyB9XG5cbiAgcHVibGljIHB1c2goc3ByaXRlOiBTcHJpdGVEZWYpIHtcbiAgICB0aGlzLl9zcHJpdGVzLnB1c2goc3ByaXRlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRCeU5hbWUobmFtZTogc3RyaW5nKTogU3ByaXRlRGVmIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Nwcml0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9zcHJpdGVzW2ldLm5hbWUgPT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldEJ5TmFtZU9yVGhyb3cobmFtZTogc3RyaW5nKTogU3ByaXRlRGVmIHtcbiAgICBsZXQgc3ByaXRlID0gdGhpcy5nZXRCeU5hbWUobmFtZSk7XG4gICAgaWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyAnc3ByaXRlIG5vdCBmb3VuZDonICsgbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcml0ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRCeUlkKGlkOiBzdHJpbmcpIHtcbiAgICBmb3IgKGxldCBzcHJpdGVLZXkgaW4gdGhpcy5fc3ByaXRlcykge1xuICAgICAgbGV0IHNwcml0ZSA9IHRoaXMuX3Nwcml0ZXNbc3ByaXRlS2V5XTtcbiAgICAgIGlmIChzcHJpdGUuaWQgPT09IGlkKSB7XG4gICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaChmdW5jOiBhbnkpIHtcbiAgICB0aGlzLl9zcHJpdGVzLmZvckVhY2goKHgpID0+IGZ1bmMoeCkpO1xuICB9XG5cbiAgcHVibGljIGZpbmQocHJlZDogKHg6IFNwcml0ZURlZikgPT4gYm9vbGVhbik6IFNwcml0ZURlZiB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgc3ByaXRlS2V5IGluIHRoaXMuX3Nwcml0ZXMpIHtcbiAgICAgIGxldCBzcHJpdGUgPSB0aGlzLl9zcHJpdGVzW3Nwcml0ZUtleV07XG4gICAgICBpZiAocHJlZChzcHJpdGUpKSB7XG4gICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgbWFwKGZ1bmM6IChzcHJpdGU6IFNwcml0ZURlZikgPT4gYW55KSB7XG5cbiAgICByZXR1cm4gdGhpcy5fc3ByaXRlcy5tYXAoZnVuYyk7XG4gIH07XG59XG5cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVNwcml0ZVNvdXJjZSB7XG4gIGRyYXcoY3R4OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQ7XG5cbn1cblxuZXhwb3J0IGNsYXNzIFNwcml0ZUltYWdlIGltcGxlbWVudHMgSVNwcml0ZVNvdXJjZSB7XG4gIHByaXZhdGUgX3c6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaDogbnVtYmVyO1xuICBwcml2YXRlIF9pbWFnZTogYW55O1xuXG4gIC8vIGNyZWF0ZSBzcHJpdGUgb2JqZWN0XG4gIC8vIHggLSB4IGNvb3JkaW5hdGUgb2Ygc3ByaXRlXG4gIC8vIHkgLSB5IGNvb3JkaW5hdGUgb2Ygc3ByaXRlXG4gIC8vIHcgLSBzcHJpdGUgd2lkdGhcbiAgLy8gaCAtIHNwcml0ZSBoZWlnaHRcbiAgLy8gc2tpbnMgLSBhcnJheSBvZiBlaXRoZXIgc3RyaW5nIHJlc291cmNlIG5hbWVzIG9yIFNwcml0ZUltYWdlIHR5cGUgb2JqZWN0c1xuICAvLyBhbmltYXRpb25zIC0gYXJyYXkgb2YgZnVuY3Rpb25zIHdoaWNoIGluaXRpYWxpemUgYW5pbWF0aW9ucyBmb3IgdGhpcyBzcHJpdGVcbiAgLy8gICAgICAgICAgICAgIGZ1bmN0aW9ucyBzaG91bGQgdGFrZSBzcHJpdGUgYXMgcGFyYW1ldGVyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gICAgdGhpcy5faW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLl9pbWFnZS5zcmMgPSBuYW1lO1xuICAgIHRoaXMuX3cgPSB3O1xuICAgIHRoaXMuX2ggPSBoO1xuICB9XG5cbiAgcHVibGljIGRyYXcoY3R4OiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQge1xuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5faW1hZ2UsIHgsIHksIHcsIGgpO1xuICB9XG59XG5cbi8vIER5bmFtaWNJbWFnZSBpcyBhYnN0cmFjdGlvbiBmb3IgYXRsYXMgdnMgYml0bWFwIGltYWdlc1xuZXhwb3J0IGNsYXNzIER5bmFtaWNJbWFnZSBpbXBsZW1lbnRzIElTcHJpdGVTb3VyY2Uge1xuICBwcml2YXRlIF9kcmF3RnVuYzogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGZ1bmM6IGFueSkge1xuICAgIHRoaXMuX2RyYXdGdW5jID0gZnVuYztcbiAgfVxuXG4gIHB1YmxpYyBkcmF3KGN0eDogYW55LCB4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoeCwgeSk7XG4gICAgdGhpcy5fZHJhd0Z1bmMoY3R4KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTcHJpdGVEZWZDb2xsZWN0aW9uIH0gZnJvbSBcIi4vU3ByaXRlRGVmXCI7XG5pbXBvcnQgeyBUaWxlRGVmLCBUaWxlTGV2ZWxEZWYgfSBmcm9tIFwiLi9UaWxlTGV2ZWxEZWZcIjtcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gXCIuL1Nwcml0ZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElMZXZlbCB7XG4gIGRyYXcoY3R4OiBhbnksIHg6IG51bWJlciwgdzogbnVtYmVyKTogdm9pZDtcbiAgc2V0RWRpdE1vZGUoZWRpdDogYm9vbGVhbik6IHZvaWQ7XG59XG5cbmV4cG9ydCBlbnVtIFBvc0tpbmQge1xuICBQaXhlbCxcbiAgR3JpZFxufVxuXG5leHBvcnQgY2xhc3MgUG9zIHtcbiAgcHVibGljIGtpbmQ6IFBvc0tpbmQ7XG4gIHB1YmxpYyB4OiBudW1iZXI7XG4gIHB1YmxpYyB5OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioa2luZDogUG9zS2luZCwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxufVxuXG4vLyBUaWxlTGV2ZWwgcHJvdmlkZXMgYSB3YXkgdG8gcmVuZGVyIGEgbWFwIGJhc2VkIG9uIHNldCBvZiBjaGFyYWN0ZXJzXG4vLyBlYWNoIGNoYXJhY3RlciByZWZlcmVuY2VzIHNwcml0ZSByZWdpc3RlcmVkIHdpdGggYWRkU3ByaXRlIGNhbGxcbmV4cG9ydCBjbGFzcyBUaWxlTGV2ZWwgaW1wbGVtZW50cyBJTGV2ZWwge1xuICBwcml2YXRlIF9kZWY6IFRpbGVMZXZlbERlZjtcbiAgcHJpdmF0ZSBfdGlsZVNwcml0ZXM6IE1hcDxudW1iZXIsIFNwcml0ZT4gPSBuZXcgTWFwPG51bWJlciwgU3ByaXRlPigpO1xuICBwcml2YXRlIF9zcHJpdGVzOiBTcHJpdGVbXSA9IFtdO1xuICBwcml2YXRlIF9lZGl0TW9kZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIGdldCBUaWxlTGV2ZWxQcm9wcygpIHsgcmV0dXJuIHRoaXMuX2RlZi5wcm9wczsgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihkZWY6IFRpbGVMZXZlbERlZikge1xuICAgIHRoaXMuX2RlZiA9IGRlZjtcbiAgfVxuXG4gIHB1YmxpYyBzZXRFZGl0TW9kZShlZGl0OiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWRpdE1vZGUgPSBlZGl0O1xuICB9XG5cbiAgLy8gZHJhdyBtYXAgZnJvbSBwb3NpdGlvbiB4LCB5IHdpdGggKHcsaCkgc2l6ZVxuICBwdWJsaWMgZHJhdyhjdHg6IGFueSwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAvL2xldCBzdGFydFggPSB4IC8gdGhpcy5fZGVmLnByb3BzLnRpbGVXaWR0aDtcbiAgICAvL2xldCBzdGFydE9mZnNldCA9IHggJSB0aGlzLl9kZWYucHJvcHMudGlsZUhlaWdodDtcbiAgICAvL2xldCBlbmRYID0gc3RhcnRYICsgdGhpcy5waXhlbFdpZHRoIC8gdGhpcy5fZGVmLnByb3BzLnRpbGVXaWR0aCArIDE7XG4gICAgLy9sZXQgY3VycmVudFkgPSAwO1xuICAgIC8vIFRPRE86IGFkZCBmaWx0ZXJpbmdcbiAgICB0aGlzLl9kZWYuZm9yRWFjaFRpbGUoKHRpbGU6IFRpbGVEZWYgfCBudWxsLCBzcHJpdGVzOiBTcHJpdGVEZWZDb2xsZWN0aW9uKSA9PiB7XG4gICAgICBpZiAodGlsZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBzcHJpdGUgPSB0aGlzLl90aWxlU3ByaXRlcy5nZXQodGlsZS52aWV3SWQpO1xuICAgICAgaWYgKHNwcml0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBzcHJpdGVEZWYgPSBzcHJpdGVzLmdldEJ5SWQodGlsZS5pZCk7XG4gICAgICAgIHNwcml0ZSA9IHNwcml0ZURlZj8uY3JlYXRlU3ByaXRlKHsgeDogdGlsZS54LCB5OiB0aWxlLnkgfSk7XG4gICAgICAgIGlmIChzcHJpdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93ICd1bmtub3duIHNwcml0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGlsZVNwcml0ZXMuc2V0KHRpbGUudmlld0lkLCBzcHJpdGUpO1xuICAgICAgfVxuXG4gICAgICBzcHJpdGUuZHJhdyhjdHgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX2VkaXRNb2RlKSB7XG4gICAgICB0aGlzLmRyYXdHcmlkKGN0eCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3ByaXRlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5kcmF3KGN0eCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0R3JpZFBvc0J5UGl4ZWxQb3MoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFBvcyhQb3NLaW5kLkdyaWQsIE1hdGgucm91bmQoeCAvIHRoaXMuX2RlZi5wcm9wcy50aWxlV2lkdGgpLCBNYXRoLnJvdW5kKHkgLyB0aGlzLl9kZWYucHJvcHMudGlsZUhlaWdodCkpO1xuICB9XG5cbiAgLypcbiAgLy8gcmV0dXJucyBibG9jayBjb2RlIGJ5IHBvc2l0aW9uXG4gIHB1YmxpYyBnZXRUaWxlQnlQaXhlbFBvcyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFNwcml0ZSB7XG4gICAgbGV0IGJsb2NrUG9zID0gdGhpcy5nZXRHcmlkUG9zQnlQaXhlbFBvcyh4LCB5KTtcbiAgICByZXR1cm4gdGhpcy5nZXRUaWxlKHgsIHkpO1xuICB9XG5cbiAgcHVibGljIGdldFBpeGVsUG9zQnlHcmlkUG9zKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQb3MoUG9zS2luZC5QaXhlbCwgeCAqIHRoaXMuX2RlZi5wcm9wcy50aWxlV2lkdGgsIHkgKiB0aGlzLl9kZWYucHJvcHMudGlsZUhlaWdodCk7XG4gIH1cblxuICAvLyBzZWFyY2ggZG93biBmb3IgdGhlIGZpcnN0IHRpbGUgd2Ugb3ZlcmxhcFxuICAvLyBUT0RPOiBzaG91bGQgdGFrZSBzcHJpdGVcbiAgcHVibGljIGxvb2tEb3duKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgbGV0IG1hcFBvcyA9IHRoaXMuZ2V0R3JpZFBvc0J5UGl4ZWxQb3MoeCwgeSk7XG5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5fZGVmLnByb3BzLmdyaWRIZWlnaHQgKyAxOyBpIDwgdGhpcy5fZGVmLnByb3BzLmdyaWRIZWlnaHQ7IGkrKykge1xuICAgICAgbGV0IHRpbGUgPSB0aGlzLmdldFRpbGUobWFwUG9zLngsIGkpO1xuICAgICAgaWYgKHRpbGUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRpbGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0qL1xuXG4gIHByaXZhdGUgZHJhd0dyaWQoY3R4OiBhbnkpIHtcbiAgICBjdHgubGluZVdpZHRoID0gMC41O1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjOTY5Njk2JztcblxuICAgIGxldCBwcm9wcyA9IHRoaXMuX2RlZi5wcm9wcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmdyaWRXaWR0aDsgaSsrKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKGkgKiBwcm9wcy50aWxlV2lkdGgsIDApO1xuICAgICAgY3R4LmxpbmVUbyhpICogcHJvcHMudGlsZVdpZHRoLCBwcm9wcy5ncmlkSGVpZ2h0ICogcHJvcHMudGlsZUhlaWdodCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5ncmlkV2lkdGg7IGkrKykge1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygwLCBpICogcHJvcHMudGlsZUhlaWdodCk7XG4gICAgICBjdHgubGluZVRvKHByb3BzLmdyaWRXaWR0aCAqIHByb3BzLnRpbGVXaWR0aCwgaSAqIHByb3BzLnRpbGVIZWlnaHQpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyB4NjRIYXNoNjQgfSBmcm9tICcuL2hhc2gvbXVybXVyaGFzaDMnO1xuaW1wb3J0IEFzeW5jRXZlbnRTb3VyY2UgZnJvbSAnLi9Bc3luY0V2ZW50U291cmNlJztcbmltcG9ydCB7IElQcm9qZWN0U3RvcmFnZSwgSVN0b3JhZ2VPcFJlY2VpdmVyLCBTdG9yYWdlT3AsIFN0b3JhZ2VPcEtpbmQgfSBmcm9tICcuL0lQcm9qZWN0U3RvcmFnZSc7XG5pbXBvcnQgeyBQcm9qZWN0TG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9Qcm9qZWN0U3RvcmFnZSc7XG5pbXBvcnQgeyBPYmplY3REZWYsIElPYmplY3REZWYgfSBmcm9tICcuL09iamVjdERlZic7XG5pbXBvcnQgeyBDb3N0dW1lRGVmIH0gZnJvbSAnLi9Db3N0dW1lRGVmJztcbmltcG9ydCB7IENvZGVGaWxlRGVmIH0gZnJvbSAnLi9Db2RlRmlsZURlZic7XG5pbXBvcnQgeyBTcHJpdGVEZWYsIFNwcml0ZURlZkNvbGxlY3Rpb24gfSBmcm9tICcuL1Nwcml0ZURlZic7XG5pbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL1Nwcml0ZSc7XG5cbmV4cG9ydCB0eXBlIFRpbGVMZXZlbFByb3BzID0ge1xuICAvKipcbiAgICogd2lkdGggaW4gdGlsZXNcbiAgICovXG4gIGdyaWRXaWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBoZWlnaHQgaW4gdGlsZXNcbiAgICovXG4gIGdyaWRIZWlnaHQ6IG51bWJlcjtcblxuICAvKipcbiAgICogd2lkdGggb2YgdGlsZSBpbiBwaXhlbHNcbiAgICovXG4gIHRpbGVXaWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBoZWlnaHQgb2YgdGlsZSBpbiBwaXhlbHNcbiAgICovXG4gIHRpbGVIZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgVGlsZURlZiA9IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIGlkOiBzdHJpbmc7XG4gIHZpZXdJZDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEFUVDogYWxsIG1ldGhvZHMgc2hvdWxkIGJlIHN0YXRpYy4gV2Ugd2lsbCBkZXNlcmlhbGl6ZSBKUyBpbnRvIHRoaXMgY2xhc3Mgd2l0aG91dCBjYXN0aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlTGV2ZWxEZWYgZXh0ZW5kcyBPYmplY3REZWYgaW1wbGVtZW50cyBJU3RvcmFnZU9wUmVjZWl2ZXIge1xuICAvLyBAdHMtaWdub3JlXG4gIHB1YmxpYyBjb2RlRmlsZTogQ29kZUZpbGVEZWY7XG4gIC8qKiByb3dzIGNvbnRhaW5zIGFycmF5IG9mIFNwcml0ZURlZiAqL1xuICBwdWJsaWMgcm93czogYW55W10gPSBbXTtcbiAgcHVibGljIHByb3BzOiBUaWxlTGV2ZWxQcm9wcztcbiAgcHJpdmF0ZSBfdGlsZXNJZDogc3RyaW5nO1xuICBwcml2YXRlIF9zcHJpdGVzOiBTcHJpdGVEZWZDb2xsZWN0aW9uO1xuICBwcml2YXRlIF9uZXh0Vmlld0lkOiBudW1iZXIgPSAxLjA7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHN0b3JhZ2U6IElQcm9qZWN0U3RvcmFnZSxcbiAgICBwYXJlbnQ6IElPYmplY3REZWYsXG4gICAgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBwcm9wczogVGlsZUxldmVsUHJvcHMgfCB1bmRlZmluZWQsXG4gICAgc3ByaXRlczogU3ByaXRlRGVmQ29sbGVjdGlvbikge1xuXG4gICAgc3VwZXIoc3RvcmFnZSwgcGFyZW50LCBpZCwgJ1RpbGVMZXZlbCcpXG4gICAgdGhpcy5fdGlsZXNJZCA9IHRoaXMuaWQgKyAnLnRpbGVzJztcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnByb3BzID0gcHJvcHNcbiAgICB0aGlzLl9zcHJpdGVzID0gc3ByaXRlcztcblxuICAgIHRoaXMuX3N0b3JhZ2UucmVnaXN0ZXJSZWNlaXZlcih0aGlzLmlkLCB0aGlzKTtcbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMucGFyZW50Py5pZCwgdGhpcy5jcmVhdGVVcGRhdGVPcCgpKTtcbiAgICAgIHRoaXMuY29kZUZpbGUgPSBuZXcgQ29kZUZpbGVEZWYoc3RvcmFnZSwgdGhpcywgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMudXBkYXRlVGlsZXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21PcChcbiAgICBzdG9yYWdlOiBJUHJvamVjdFN0b3JhZ2UsXG4gICAgcGFyZW50OiBJT2JqZWN0RGVmLCBpZDogc3RyaW5nLFxuICAgIHNwcml0ZXM6IFNwcml0ZURlZkNvbGxlY3Rpb24sXG4gICAgb3A6IGFueSk6IFRpbGVMZXZlbERlZiB7XG5cbiAgICBsZXQgbGV2ZWwgPSBuZXcgVGlsZUxldmVsRGVmKHN0b3JhZ2UsIHBhcmVudCwgaWQsIG9wLnByb3BzLCBzcHJpdGVzKTtcbiAgICBsZXZlbC5wcm9jZXNzU2V0KG9wKTtcbiAgICByZXR1cm4gbGV2ZWw7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc1NldChvcDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wcm9wcyA9IG9wLnByb3BzO1xuICAgIHRoaXMucm93cyA9IG9wLnJvd3M7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0FkZChjaGlsZElkOiBzdHJpbmcsIG9wOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY2hpbGRJZCA9PT0gdGhpcy5fdGlsZXNJZCkge1xuICAgICAgbGV0IHRpbGVPcHMgPSBvcCBhcyBhbnlbXTtcbiAgICAgIHRpbGVPcHMuZm9yRWFjaChzcHJpdGVEZWYgPT4ge1xuICAgICAgICBsZXQgcm93ID0gdGhpcy5yb3dzW3Nwcml0ZURlZi55XTtcbiAgICAgICAgcm93W3Nwcml0ZURlZi54XSA9IHRoaXMuX3Nwcml0ZXMuZ2V0QnlJZChzcHJpdGVEZWYuaWQpXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2RlRmlsZSA9IENvZGVGaWxlRGVmLmZyb21PcCh0aGlzLl9zdG9yYWdlLCB0aGlzLCBjaGlsZElkLCBvcCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVVcGRhdGVPcCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFyZ2V0OiAnVGlsZUxldmVsJyxcbiAgICAgIHByb3BzOiB0aGlzLnByb3BzLFxuICAgICAgcm93czogdGhpcy5yb3dzXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldFNpemUoZ3JpZFdpZHRoOiBudW1iZXIsIGdyaWRIZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMucHJvcHMuZ3JpZFdpZHRoID0gZ3JpZFdpZHRoO1xuICAgIHRoaXMucHJvcHMuZ3JpZEhlaWdodCA9IGdyaWRIZWlnaHQ7XG4gICAgdGhpcy5fc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHRoaXMucGFyZW50Py5pZCwgdGhpcy5jcmVhdGVVcGRhdGVPcCgpKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRUaWxlcyh0aWxlczogeyBzcHJpdGU6IFNwcml0ZURlZiwgeDogbnVtYmVyLCB5OiBudW1iZXIgfVtdKSB7XG4gICAgbGV0IHVwZGF0ZVRpbGVzOiBhbnlbXSA9IFtdO1xuICAgIHRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICBsZXQgcm93OiBhbnlbXSA9IHRoaXMucm93c1t0aWxlLnldO1xuICAgICAgbGV0IHNwcml0ZURlZiA9IHRoaXMuY3JlYXRlU3ByaXRlUmVmKHRpbGUuc3ByaXRlLmlkLCB0aWxlLnggKiB0aGlzLnByb3BzLnRpbGVXaWR0aCwgdGlsZS55ICogdGhpcy5wcm9wcy50aWxlSGVpZ2h0KTtcbiAgICAgIHJvd1t0aWxlLnhdID0gc3ByaXRlRGVmO1xuICAgICAgdXBkYXRlVGlsZXMucHVzaChzcHJpdGVEZWYpO1xuICAgIH0pO1xuXG4gICAgLy8gdXNlIG91cnNlbGYgYXMgcGFyZW50IGZvciBvcFxuICAgIHRoaXMuX3N0b3JhZ2UuYXBwZW5kSXRlbXModGhpcy5fdGlsZXNJZCwgdGhpcy5pZCwgdXBkYXRlVGlsZXMpO1xuXG4gICAgdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIGxldCByb3c6IGFueVtdID0gdGhpcy5yb3dzW3RpbGUueV07XG4gICAgICBsZXQgc3ByaXRlRGVmID0gdGhpcy5jcmVhdGVTcHJpdGVSZWYodGlsZS5zcHJpdGUuaWQsIHRpbGUueCAqIHRoaXMucHJvcHMudGlsZVdpZHRoLCB0aWxlLnkgKiB0aGlzLnByb3BzLnRpbGVIZWlnaHQpO1xuICAgICAgcm93W3RpbGUueF0gPSBzcHJpdGVEZWY7XG4gICAgICB1cGRhdGVUaWxlcy5wdXNoKHNwcml0ZURlZik7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaFRpbGUoZnVuYzogKHRpbGU6IFRpbGVEZWYgfCBudWxsLCBzcHJpdGVzOiBTcHJpdGVEZWZDb2xsZWN0aW9uKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKCh0aWxlUmVmOiBUaWxlRGVmKSA9PiB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZnVuYyh0aWxlUmVmLCB0aGlzLl9zcHJpdGVzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUaWxlcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5ncmlkSGVpZ2h0ID4gdGhpcy5yb3dzLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMucm93cy5sZW5ndGg7IGkgPCB0aGlzLnByb3BzLmdyaWRIZWlnaHQ7IGkrKykge1xuICAgICAgICB0aGlzLnJvd3MucHVzaChbXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm93cy5sZW5ndGggPSB0aGlzLnByb3BzLmdyaWRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHNpemUgb2Ygcm93cyBpZiBuZWVkZWRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHJvdzogYW55W10gPSB0aGlzLnJvd3NbaV07XG4gICAgICBpZiAocm93Lmxlbmd0aCA8IHRoaXMucHJvcHMuZ3JpZFdpZHRoKSB7XG4gICAgICAgIGZvciAobGV0IGogPSByb3cubGVuZ3RoOyBqIDwgdGhpcy5wcm9wcy5ncmlkV2lkdGg7IGorKykge1xuICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb3cubGVuZ3RoID0gdGhpcy5wcm9wcy5ncmlkV2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTcHJpdGVSZWYoaWQ6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBUaWxlRGVmIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHksXG4gICAgICB2aWV3SWQ6IHRoaXMuX25leHRWaWV3SWQrKyxcbiAgICB9XG4gIH1cbn1cbiIsIi8vIG51bWJlciBwcm9wZXJ0aWVzIHdoaWNoIGNhbiBiZSBhbmltYXRlZFxuZXhwb3J0IGNsYXNzIE51bWJlclByb3BlcnR5IHtcbiAgcHJpdmF0ZSBfdmFsdWU6IG51bWJlcjtcbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHZhbHVlOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl92YWx1ZSA9ICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSA/IHZhbHVlIDogMDtcbiAgICB0aGlzLmlkID0gYW5pbWF0b3IubmV4dElkKCk7XG4gIH1cblxuICBwdWJsaWMgZ2xpZGUoZGVsdGE6IG51bWJlciwgc3RlcDogbnVtYmVyKSB7XG4gICAgYW5pbWF0b3IuYW5pbWF0ZUxpbmVhcih0aGlzLCBkZWx0YSwgc3RlcCk7XG4gIH1cblxuICBwdWJsaWMgYWRkKGRlbHRhOiBudW1iZXIpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMuX3ZhbHVlICsgZGVsdGE7XG4gIH1cblxuICBwdWJsaWMgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cbn1cblxuLy8gYXBwbGllcyBsaW5lYXIgYW5pbWF0aW9uIHRvIGEgcHJvcGVydHlcbi8vIGNoYW5nZXMgcHJvcGVydHkgYnkgc3RlcCB1bnRpbCB0aGUgdG90YWwgY2hhbmdlIGlzIGRlbHRhXG5leHBvcnQgY2xhc3MgTGluZWFyQW5pbWF0b3Ige1xuICBwdWJsaWMgcHJvcDogTnVtYmVyUHJvcGVydHk7XG4gIHB1YmxpYyBkZWx0YTogbnVtYmVyO1xuICBwdWJsaWMgc3RlcDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3A6IE51bWJlclByb3BlcnR5LCBkZWx0YTogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLnByb3AgPSBwcm9wO1xuICAgIHRoaXMuZGVsdGEgPSBkZWx0YTtcbiAgICB0aGlzLnN0ZXAgPSBzdGVwO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoZnJhbWVUaW1lOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5kZWx0YSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kZWx0YSA+IDApIHtcbiAgICAgIGlmICh0aGlzLmRlbHRhID4gdGhpcy5zdGVwKSB7XG4gICAgICAgIHRoaXMuZGVsdGEgLT0gdGhpcy5zdGVwO1xuICAgICAgICB0aGlzLnByb3AuYWRkKHRoaXMuc3RlcCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wLmFkZCh0aGlzLmRlbHRhKTtcbiAgICAgICAgdGhpcy5kZWx0YSA9IDA7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGVsdGEgPCB0aGlzLnN0ZXApIHtcbiAgICAgICAgdGhpcy5kZWx0YSAtPSB0aGlzLnN0ZXA7XG4gICAgICAgIHRoaXMucHJvcC5hZGQodGhpcy5zdGVwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3AuYWRkKHRoaXMuZGVsdGEpO1xuICAgICAgICB0aGlzLmRlbHRhID0gMDtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBhcHBsaWVzIGxpbmVhciBhbmltYXRpb24gdG8gYSBwcm9wZXJ0eVxuLy8gY2hhbmdlcyBwcm9wZXJ0eSBieSBzdGVwIHVudGlsIHRoZSB0b3RhbCBjaGFuZ2UgaXMgZGVsdGFcbmV4cG9ydCBjbGFzcyBMaW5lYXJBbmltYXRvcjIge1xuICBwdWJsaWMgb2JqOiBhbnk7XG4gIHB1YmxpYyBwcm9wOiBzdHJpbmc7XG4gIHB1YmxpYyBkZWx0YTogbnVtYmVyO1xuICBwdWJsaWMgc3RlcDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9iajogb2JqZWN0LCBwcm9wOiBzdHJpbmcsIGRlbHRhOiBudW1iZXIsIHN0ZXA6IG51bWJlcikge1xuICAgIHRoaXMub2JqID0gb2JqO1xuICAgIHRoaXMucHJvcCA9IHByb3A7XG4gICAgdGhpcy5kZWx0YSA9IGRlbHRhO1xuICAgIHRoaXMuc3RlcCA9IHN0ZXA7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZShmcmFtZVRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmRlbHRhID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRlbHRhID4gMCkge1xuICAgICAgaWYgKHRoaXMuZGVsdGEgPiB0aGlzLnN0ZXApIHtcbiAgICAgICAgdGhpcy5kZWx0YSAtPSB0aGlzLnN0ZXA7XG4gICAgICAgIHRoaXMub2JqW3RoaXMucHJvcF0gKz0gdGhpcy5zdGVwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2JqW3RoaXMucHJvcF0gKz0gdGhpcy5kZWx0YTtcbiAgICAgICAgdGhpcy5kZWx0YSA9IDA7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZGVsdGEgPCB0aGlzLnN0ZXApIHtcbiAgICAgICAgdGhpcy5kZWx0YSAtPSB0aGlzLnN0ZXA7XG4gICAgICAgIHRoaXMub2JqW3RoaXMucHJvcF0gKz0gdGhpcy5zdGVwO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub2JqW3RoaXMucHJvcF0gKz0gdGhpcy5kZWx0YTtcbiAgICAgICAgdGhpcy5kZWx0YSA9IDA7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gYXBwbGllcyBsaW5lYXIgYW5pbWF0aW9uIHRvIGEgcHJvcGVydHlcbi8vIGNoYW5nZXMgcHJvcGVydHkgYnkgc3RlcCB1bnRpbCB0aGUgdG90YWwgY2hhbmdlIGlzIGRlbHRhXG5leHBvcnQgY2xhc3MgTG9vcExpbmVhckFuaW1hdG9yIHtcbiAgcHVibGljIHByb3A6IE51bWJlclByb3BlcnR5O1xuICBwdWJsaWMgc3RhcnREZWx0YTogbnVtYmVyO1xuICBwdWJsaWMgZGVsdGE6IG51bWJlcjtcbiAgcHVibGljIHN0ZXA6IG51bWJlcjtcbiAgcHVibGljIGRpcmVjdGlvbjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3A6IE51bWJlclByb3BlcnR5LCBkZWx0YTogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLnByb3AgPSBwcm9wO1xuICAgIHRoaXMuc3RhcnREZWx0YSA9IE1hdGguYWJzKGRlbHRhKTtcbiAgICB0aGlzLmRlbHRhID0gdGhpcy5zdGFydERlbHRhO1xuICAgIHRoaXMuc3RlcCA9IE1hdGguYWJzKHN0ZXApO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gKGRlbHRhID4gMCkgPyAxIDogLTE7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZShmcmFtZVRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmRlbHRhID4gdGhpcy5zdGVwKSB7XG4gICAgICB0aGlzLmRlbHRhIC09IHRoaXMuc3RlcDtcbiAgICAgIHRoaXMucHJvcC5hZGQodGhpcy5zdGVwICogdGhpcy5kaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3Auc2V0KHRoaXMuZGVsdGEgKiB0aGlzLmRpcmVjdGlvbik7XG4gICAgICB0aGlzLmRlbHRhID0gdGhpcy5zdGFydERlbHRhO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSAtdGhpcy5kaXJlY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLy8gZ29lcyB0aHJvdWdoIGxpc3Qgb2YgdmFsdWVzIGluIGFycmF5XG5leHBvcnQgY2xhc3MgRGlzY3JldGVBbmltYXRvciB7XG4gIHB1YmxpYyBwcm9wOiBOdW1iZXJQcm9wZXJ0eTtcbiAgcHVibGljIHZhbHVlczogbnVtYmVyW107XG4gIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuICBwdWJsaWMgaW50ZXJ2YWxNczogbnVtYmVyO1xuICBwdWJsaWMgbGFzdEZyYW1lVGltZU1zOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHJvcDogTnVtYmVyUHJvcGVydHksIHZhbHVlczogbnVtYmVyW10sIGludGVydmFsU2Vjb25kczogbnVtYmVyKSB7XG4gICAgdGhpcy5wcm9wID0gcHJvcDtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB0aGlzLmludGVydmFsTXMgPSBpbnRlcnZhbFNlY29uZHMgKiAxMDAwO1xuICAgIHRoaXMubGFzdEZyYW1lVGltZU1zID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5wcm9wLnNldCh0aGlzLnZhbHVlc1t0aGlzLmluZGV4XSk7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZShmcmFtZVRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmxhc3RGcmFtZVRpbWVNcyArIHRoaXMuaW50ZXJ2YWxNcyA+IGZyYW1lVGltZSlcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgbGV0IG5ld0luZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgaWYgKG5ld0luZGV4ID49IHRoaXMudmFsdWVzLmxlbmd0aClcbiAgICAgIG5ld0luZGV4ID0gMDtcblxuICAgIHRoaXMuaW5kZXggPSBuZXdJbmRleDtcbiAgICB0aGlzLnByb3Auc2V0KHRoaXMudmFsdWVzW25ld0luZGV4XSk7XG4gICAgdGhpcy5sYXN0RnJhbWVUaW1lTXMgPSBmcmFtZVRpbWU7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vLyBrZWVwcyB0cmFjayBvZiBhbmltYXRlZCBwcm9wZXJ0aWVzXG5leHBvcnQgY2xhc3MgUHJvcGVydHlBbmltYXRpb25NYW5hZ2VyIHtcbiAgcHJpdmF0ZSBfcHJvcHM6IHsgW2tleTogbnVtYmVyXTogYW55IH07XG4gIHByaXZhdGUgX3Byb3BzMjogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbiAgcHJpdmF0ZSBfbmV4dEtleTogbnVtYmVyO1xuICBwcml2YXRlIG9uVXBkYXRlU2NlbmU6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wcm9wcyA9IHt9O1xuICAgIHRoaXMuX3Byb3BzMiA9IHt9O1xuICAgIHRoaXMuX25leHRLZXkgPSAwO1xuICAgIHRoaXMub25VcGRhdGVTY2VuZSA9IG51bGw7XG5cbiAgICAvLyBydW4gYW5pbWF0aW9uIG9uIDEwMCBtc1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiBzZWxmLnByb2Nlc3NBbmltYXRpb24oKSwgMTAwKTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlTGluZWFyKHByb3A6IE51bWJlclByb3BlcnR5LCBkZWx0YTogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5fcHJvcHNbcHJvcC5pZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3Byb3BzW3Byb3AuaWRdID0gbmV3IExpbmVhckFuaW1hdG9yKHByb3AsIGRlbHRhLCBzdGVwKTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlKHByb3A6IE51bWJlclByb3BlcnR5LCBhbmltYXRvcjogYW55KSB7XG4gICAgaWYgKHByb3AgPT09IHVuZGVmaW5lZCB8fCBhbmltYXRvciA9PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBcIm1pc3NpbmcgcmVxdWlyZWQgYXJnc1wiO1xuXG4gICAgaWYgKHRoaXMuX3Byb3BzW3Byb3AuaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9wcm9wc1twcm9wLmlkXSA9IGFuaW1hdG9yO1xuICB9XG5cbiAgLy8gYW5pbWF0ZXMgcHJvcGVydHkgb2YgYW4gb2JqZWN0LiBPYmplY3Qgc2hvdWxkIGhhdmUgXCJpZFwiIHByb3BlcnR5IHdoaWNoIHVzZWQgYXMgYSBrZXlcbiAgcHVibGljIGdsaWRlKGFyZ3M6IHsgb2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVsdGE6IG51bWJlciwgc3RlcDogbnVtYmVyIH0pIHtcbiAgICB0aGlzLl9wcm9wczJbYXJncy5vYmouaWQgKyBhcmdzLnByb3BdID0gbmV3IExpbmVhckFuaW1hdG9yMihhcmdzLm9iaiwgYXJncy5wcm9wLCBhcmdzLmRlbHRhLCBhcmdzLnN0ZXApO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGVQcm9wZXJ0eShhcmdzOiB7IG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGFuaW1hdG9yOiBhbnkgfSkge1xuICAgIHRoaXMuX3Byb3BzMlthcmdzLm9iai5pZCArIGFyZ3MucHJvcF0gPSBhcmdzLmFuaW1hdG9yO1xuICB9XG5cbiAgcHVibGljIG5leHRJZCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9uZXh0S2V5Kys7XG4gIH1cblxuICBwdWJsaWMgcHJvY2Vzc0FuaW1hdGlvbigpIHtcbiAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX3Byb3BzKSB7XG4gICAgICBsZXQgcHJvcCA9IHRoaXMuX3Byb3BzW2tleV07XG4gICAgICBpZiAoIXByb3AuYW5pbWF0ZShmcmFtZVRpbWUpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9wcm9wc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9wcm9wczIpIHtcbiAgICAgIGxldCBwcm9wID0gdGhpcy5fcHJvcHMyW2tleV07XG4gICAgICBpZiAoIXByb3AuYW5pbWF0ZShmcmFtZVRpbWUpKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9wcm9wczJba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblVwZGF0ZVNjZW5lICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5vblVwZGF0ZVNjZW5lKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB2YXIgYW5pbWF0b3IgPSBuZXcgUHJvcGVydHlBbmltYXRpb25NYW5hZ2VyKCk7XG4iLCJpbXBvcnQgeyBTY3JlZW4gfSBmcm9tICcuL1NjcmVlbic7XG5cbmV4cG9ydCBjbGFzcyBHYW1lIHtcbiAgcHJpdmF0ZSBfc2NyZWVuOiBTY3JlZW4gfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfY2FudmFzOiBhbnkgPSBudWxsO1xuXG4gIC8vIHJ1bnMgdGhlIGdhbWVcbiAgcHVibGljIHJ1bihzY3JlZW46IFNjcmVlbikge1xuICAgIHRoaXMuX3NjcmVlbiA9IHNjcmVlbjtcbiAgICB0aGlzLnRyeVJ1bigpO1xuICB9XG5cbiAgcHVibGljIGxvYWRDYW52YXMoY2FudmFzOiBhbnkpIHtcbiAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy50cnlSdW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJ5UnVuKCkge1xuICAgIC8vICAgICAgaWYgKHRoaXMuX3NjcmVlbiAhPT0gbnVsbCAmJiB0aGlzLl9jYW52YXMgIT09IG51bGwpIHtcbiAgICAvLyAgICAgICAgdGhpcy5fc2NyZWVuLnJ1bih0aGlzLl9jYW52YXMpO1xuICAgIC8vICAgICAgfVxuICB9XG59XG5cbiIsImV4cG9ydCBjbGFzcyBIZWxwIHtcbiAgcHJpdmF0ZSBfY29udGVudDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gIHB1YmxpYyBhZGQoa2V5OiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykge1xuICAgIHRoaXMuX2NvbnRlbnRba2V5XSA9IGNvbnRlbnQ7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBJbnB1dCB7XG4gIHB1YmxpYyBwcmVzc2VkS2V5czogYW55ID0ge307XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHNlbGYub25LZXlEb3duKGV2dCksIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZ0KSA9PiBzZWxmLm9uS2V5VXAoZXZ0KSwgZmFsc2UpO1xuICB9XG5cblxuICBwcml2YXRlIG9uS2V5RG93bihldnQ6IGFueSkge1xuICAgIHRoaXMucHJlc3NlZEtleXNbZXZ0LmNvZGVdID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlVcChldnQ6IGFueSkge1xuICAgIHRoaXMucHJlc3NlZEtleXNbZXZ0LmNvZGVdID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiLy9cbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgY29tcGxldGVseSBiYXNlZCBvbiBAa2FyYW5seW9ucydzIHByb2plY3Q6XG4vLyBodHRwczovL2dpdGh1Yi5jb20va2FyYW5seW9ucy9tdXJtdXJIYXNoMy5qc1xuLy8gRXhjZXB0OlxuLy8gMSkgVGhpcyBwcm9qZWN0IGFkZHMgYSBmdW5jdGlvbiB4NjRIYXNoNjQgYnkgdHJpbWluZyB0aGUgaGlnaGVyXG4vLyAgICA2NCBiaXRzIGZvciByZXN1bHQgb2YgZnVuY3Rpb24geDY0SGFzaDEyOC5cbi8vIDIpIE9yaWdpbmFsIHByb2plY3QgYXNzdW1lcyB0aGF0IGtleSBpcyBhc2NpaSBzdHJpbmcsIHRoaXMgcHJvamVjdFxuLy8gICAgZml4IHRoaXMgcHJvYmxlbSBieSBhcHBseWluZyB1dGlsLnRvVThJbnRBcnJheSB0byBmaXggdGhpcy5cbi8vXG4vLyBmdW5jdGlvbiBoYXNoKGtleSkgey4uLn0gaXMgYW4gYWxpYXMgZm9yIHg2NEhhc2gxMjhcbi8vXG4vLyBJbnB1dDpcbi8vIHN0cmluZyBrZXksIGludCBzZWVkXG4vLyBvdXRwdXQ6XG4vLyAoMzIgb3IgNjQgb3IgMTI4KSBiaXRzIGhhc2ggaW4gaGV4IHN0cmluZ1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJztcblxuLy8gUFJJVkFURSBGVU5DVElPTlNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBfeDg2TXVsdGlwbHkobSwgbikge1xuICAgIC8vXG4gICAgLy8gR2l2ZW4gdHdvIDMyYml0IGludHMsIHJldHVybnMgdGhlIHR3byBtdWx0aXBsaWVkIHRvZ2V0aGVyIGFzIGFcbiAgICAvLyAzMmJpdCBpbnQuXG4gICAgLy9cbiAgICByZXR1cm4gKChtICYgMHhmZmZmKSAqIG4pICsgKCgoKG0gPj4+IDE2KSAqIG4pICYgMHhmZmZmKSA8PCAxNik7XG59XG5cbmZ1bmN0aW9uIF94ODZSb3RsKG0sIG4pIHtcbiAgICAvL1xuICAgIC8vIEdpdmVuIGEgMzJiaXQgaW50IGFuZCBhbiBpbnQgcmVwcmVzZW50aW5nIGEgbnVtYmVyIG9mIGJpdCBwb3NpdGlvbnMsXG4gICAgLy8gcmV0dXJucyB0aGUgMzJiaXQgaW50IHJvdGF0ZWQgbGVmdCBieSB0aGF0IG51bWJlciBvZiBwb3NpdGlvbnMuXG4gICAgLy9cbiAgICByZXR1cm4gKG0gPDwgbikgfCAobSA+Pj4gKDMyIC0gbikpO1xufVxuXG5mdW5jdGlvbiBfeDg2Rm1peChoKSB7XG4gICAgLy9cbiAgICAvLyBHaXZlbiBhIGJsb2NrLCByZXR1cm5zIG11cm11ckhhc2gzJ3MgZmluYWwgeDg2IG1peCBvZiB0aGF0IGJsb2NrLlxuICAgIC8vXG4gICAgaCBePSBoID4+PiAxNjtcbiAgICBoID0gX3g4Nk11bHRpcGx5KGgsIDB4ODVlYmNhNmIpO1xuICAgIGggXj0gaCA+Pj4gMTM7XG4gICAgaCA9IF94ODZNdWx0aXBseShoLCAweGMyYjJhZTM1KTtcbiAgICBoIF49IGggPj4+IDE2O1xuICAgIHJldHVybiBoO1xufVxuXG5mdW5jdGlvbiBfeDY0QWRkKG0sIG4pIHtcbiAgICAvL1xuICAgIC8vIEdpdmVuIHR3byA2NGJpdCBpbnRzIChhcyBhbiBhcnJheSBvZiB0d28gMzJiaXQgaW50cykgcmV0dXJucyB0aGUgdHdvXG4gICAgLy8gYWRkZWQgdG9nZXRoZXIgYXMgYSA2NGJpdCBpbnQgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnRzKS5cbiAgICAvL1xuICAgIG0gPSBbbVswXSA+Pj4gMTYsIG1bMF0gJiAweGZmZmYsIG1bMV0gPj4+IDE2LCBtWzFdICYgMHhmZmZmXTtcbiAgICBuID0gW25bMF0gPj4+IDE2LCBuWzBdICYgMHhmZmZmLCBuWzFdID4+PiAxNiwgblsxXSAmIDB4ZmZmZl07XG4gICAgdmFyIG8gPSBbMCwgMCwgMCwgMF07XG4gICAgb1szXSArPSBtWzNdICsgblszXTtcbiAgICBvWzJdICs9IG9bM10gPj4+IDE2O1xuICAgIG9bM10gJj0gMHhmZmZmO1xuICAgIG9bMl0gKz0gbVsyXSArIG5bMl07XG4gICAgb1sxXSArPSBvWzJdID4+PiAxNjtcbiAgICBvWzJdICY9IDB4ZmZmZjtcbiAgICBvWzFdICs9IG1bMV0gKyBuWzFdO1xuICAgIG9bMF0gKz0gb1sxXSA+Pj4gMTY7XG4gICAgb1sxXSAmPSAweGZmZmY7XG4gICAgb1swXSArPSBtWzBdICsgblswXTtcbiAgICBvWzBdICY9IDB4ZmZmZjtcbiAgICByZXR1cm4gWyhvWzBdIDw8IDE2KSB8IG9bMV0sIChvWzJdIDw8IDE2KSB8IG9bM11dO1xufVxuXG5mdW5jdGlvbiBfeDY0TXVsdGlwbHkobSwgbikge1xuICAgIC8vXG4gICAgLy8gR2l2ZW4gdHdvIDY0Yml0IGludHMgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnRzKSByZXR1cm5zIHRoZSB0d29cbiAgICAvLyBtdWx0aXBsaWVkIHRvZ2V0aGVyIGFzIGEgNjRiaXQgaW50IChhcyBhbiBhcnJheSBvZiB0d28gMzJiaXQgaW50cykuXG4gICAgLy9cbiAgICBtID0gW21bMF0gPj4+IDE2LCBtWzBdICYgMHhmZmZmLCBtWzFdID4+PiAxNiwgbVsxXSAmIDB4ZmZmZl07XG4gICAgbiA9IFtuWzBdID4+PiAxNiwgblswXSAmIDB4ZmZmZiwgblsxXSA+Pj4gMTYsIG5bMV0gJiAweGZmZmZdO1xuICAgIHZhciBvID0gWzAsIDAsIDAsIDBdO1xuICAgIG9bM10gKz0gbVszXSAqIG5bM107XG4gICAgb1syXSArPSBvWzNdID4+PiAxNjtcbiAgICBvWzNdICY9IDB4ZmZmZjtcbiAgICBvWzJdICs9IG1bMl0gKiBuWzNdO1xuICAgIG9bMV0gKz0gb1syXSA+Pj4gMTY7XG4gICAgb1syXSAmPSAweGZmZmY7XG4gICAgb1syXSArPSBtWzNdICogblsyXTtcbiAgICBvWzFdICs9IG9bMl0gPj4+IDE2O1xuICAgIG9bMl0gJj0gMHhmZmZmO1xuICAgIG9bMV0gKz0gbVsxXSAqIG5bM107XG4gICAgb1swXSArPSBvWzFdID4+PiAxNjtcbiAgICBvWzFdICY9IDB4ZmZmZjtcbiAgICBvWzFdICs9IG1bMl0gKiBuWzJdO1xuICAgIG9bMF0gKz0gb1sxXSA+Pj4gMTY7XG4gICAgb1sxXSAmPSAweGZmZmY7XG4gICAgb1sxXSArPSBtWzNdICogblsxXTtcbiAgICBvWzBdICs9IG9bMV0gPj4+IDE2O1xuICAgIG9bMV0gJj0gMHhmZmZmO1xuICAgIG9bMF0gKz0gKG1bMF0gKiBuWzNdKSArIChtWzFdICogblsyXSkgKyAobVsyXSAqIG5bMV0pICsgKG1bM10gKiBuWzBdKTtcbiAgICBvWzBdICY9IDB4ZmZmZjtcbiAgICByZXR1cm4gWyhvWzBdIDw8IDE2KSB8IG9bMV0sIChvWzJdIDw8IDE2KSB8IG9bM11dO1xufVxuXG5mdW5jdGlvbiBfeDY0Um90bChtLCBuKSB7XG4gICAgLy9cbiAgICAvLyBHaXZlbiBhIDY0Yml0IGludCAoYXMgYW4gYXJyYXkgb2YgdHdvIDMyYml0IGludHMpIGFuZCBhbiBpbnRcbiAgICAvLyByZXByZXNlbnRpbmcgYSBudW1iZXIgb2YgYml0IHBvc2l0aW9ucywgcmV0dXJucyB0aGUgNjRiaXQgaW50IChhcyBhblxuICAgIC8vIGFycmF5IG9mIHR3byAzMmJpdCBpbnRzKSByb3RhdGVkIGxlZnQgYnkgdGhhdCBudW1iZXIgb2YgcG9zaXRpb25zLlxuICAgIC8vXG4gICAgbiAlPSA2NDtcbiAgICBpZiAobiA9PT0gMzIpIHtcbiAgICAgICAgcmV0dXJuIFttWzFdLCBtWzBdXTtcbiAgICB9IGVsc2UgaWYgKG4gPCAzMikge1xuICAgICAgICByZXR1cm4gWyhtWzBdIDw8IG4pIHwgKG1bMV0gPj4+ICgzMiAtIG4pKSwgKG1bMV0gPDwgbikgfCAobVswXSA+Pj4gKDMyIC0gbikpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuIC09IDMyO1xuICAgICAgICByZXR1cm4gWyhtWzFdIDw8IG4pIHwgKG1bMF0gPj4+ICgzMiAtIG4pKSwgKG1bMF0gPDwgbikgfCAobVsxXSA+Pj4gKDMyIC0gbikpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF94NjRMZWZ0U2hpZnQobSwgbikge1xuICAgIC8vXG4gICAgLy8gR2l2ZW4gYSA2NGJpdCBpbnQgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnRzKSBhbmQgYW4gaW50XG4gICAgLy8gcmVwcmVzZW50aW5nIGEgbnVtYmVyIG9mIGJpdCBwb3NpdGlvbnMsIHJldHVybnMgdGhlIDY0Yml0IGludCAoYXMgYW5cbiAgICAvLyBhcnJheSBvZiB0d28gMzJiaXQgaW50cykgc2hpZnRlZCBsZWZ0IGJ5IHRoYXQgbnVtYmVyIG9mIHBvc2l0aW9ucy5cbiAgICAvL1xuICAgIG4gJT0gNjQ7XG4gICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSBlbHNlIGlmIChuIDwgMzIpIHtcbiAgICAgICAgcmV0dXJuIFsobVswXSA8PCBuKSB8IChtWzFdID4+PiAoMzIgLSBuKSksIG1bMV0gPDwgbl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFttWzFdIDw8IChuIC0gMzIpLCAwXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF94NjRYb3IobSwgbikge1xuICAgIC8vXG4gICAgLy8gR2l2ZW4gdHdvIDY0Yml0IGludHMgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnRzKSByZXR1cm5zIHRoZSB0d29cbiAgICAvLyB4b3JlZCB0b2dldGhlciBhcyBhIDY0Yml0IGludCAoYXMgYW4gYXJyYXkgb2YgdHdvIDMyYml0IGludHMpLlxuICAgIC8vXG4gICAgcmV0dXJuIFttWzBdIF4gblswXSwgbVsxXSBeIG5bMV1dO1xufVxuXG5mdW5jdGlvbiBfeDY0Rm1peChoKSB7XG4gICAgLy9cbiAgICAvLyBHaXZlbiBhIGJsb2NrLCByZXR1cm5zIG11cm11ckhhc2gzJ3MgZmluYWwgeDY0IG1peCBvZiB0aGF0IGJsb2NrLlxuICAgIC8vIChgWzAsIGhbMF0gPj4+IDFdYCBpcyBhIDMzIGJpdCB1bnNpZ25lZCByaWdodCBzaGlmdC4gVGhpcyBpcyB0aGVcbiAgICAvLyBvbmx5IHBsYWNlIHdoZXJlIHdlIG5lZWQgdG8gcmlnaHQgc2hpZnQgNjRiaXQgaW50cy4pXG4gICAgLy9cbiAgICBoID0gX3g2NFhvcihoLCBbMCwgaFswXSA+Pj4gMV0pO1xuICAgIGggPSBfeDY0TXVsdGlwbHkoaCwgWzB4ZmY1MWFmZDcsIDB4ZWQ1NThjY2RdKTtcbiAgICBoID0gX3g2NFhvcihoLCBbMCwgaFswXSA+Pj4gMV0pO1xuICAgIGggPSBfeDY0TXVsdGlwbHkoaCwgWzB4YzRjZWI5ZmUsIDB4MWE4NWVjNTNdKTtcbiAgICBoID0gX3g2NFhvcihoLCBbMCwgaFswXSA+Pj4gMV0pO1xuICAgIHJldHVybiBoO1xufVxuXG4vLyBQVUJMSUMgRlVOQ1RJT05TXG4vLyAtLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgbGV0IHg4Nkhhc2gzMiA9IGZ1bmN0aW9uIChrZXksIHNlZWQpIHtcbiAgICAvL1xuICAgIC8vIEdpdmVuIGEgc3RyaW5nIGFuZCBhbiBvcHRpb25hbCBzZWVkIGFzIGFuIGludCwgcmV0dXJucyBhIDMyIGJpdCBoYXNoXG4gICAgLy8gdXNpbmcgdGhlIHg4NiBmbGF2b3Igb2YgTXVybXVySGFzaDMsIGFzIGFuIHVuc2lnbmVkIGludC5cblxuICAgIGtleSA9IFwiXCIgKyBrZXkgfHwgXCJcIjtcblxuICAgIHZhciB1OEludEFycmF5ID0gdXRpbC50b1U4SW50QXJyYXkoa2V5KTtcbiAgICBrZXkgPSB7XG4gICAgICAgIGNoYXJDb2RlQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHU4SW50QXJyYXlbaW5kZXhdO1xuICAgICAgICB9LFxuICAgICAgICBsZW5ndGg6IHU4SW50QXJyYXkubGVuZ3RoXG4gICAgfVxuXG4gICAgc2VlZCA9IHNlZWQgfHwgMDtcbiAgICB2YXIgcmVtYWluZGVyID0ga2V5Lmxlbmd0aCAlIDQ7XG4gICAgdmFyIGJ5dGVzID0ga2V5Lmxlbmd0aCAtIHJlbWFpbmRlcjtcbiAgICB2YXIgaDEgPSBzZWVkO1xuICAgIHZhciBrMSA9IDA7XG4gICAgdmFyIGMxID0gMHhjYzllMmQ1MTtcbiAgICB2YXIgYzIgPSAweDFiODczNTkzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXM7IGkgPSBpICsgNCkge1xuICAgICAgICBrMSA9ICgoa2V5LmNoYXJDb2RlQXQoaSkgJiAweGZmKSkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmYpIDw8IDgpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMikgJiAweGZmKSA8PCAxNikgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAzKSAmIDB4ZmYpIDw8IDI0KTtcbiAgICAgICAgazEgPSBfeDg2TXVsdGlwbHkoazEsIGMxKTtcbiAgICAgICAgazEgPSBfeDg2Um90bChrMSwgMTUpO1xuICAgICAgICBrMSA9IF94ODZNdWx0aXBseShrMSwgYzIpO1xuICAgICAgICBoMSBePSBrMTtcbiAgICAgICAgaDEgPSBfeDg2Um90bChoMSwgMTMpO1xuICAgICAgICBoMSA9IF94ODZNdWx0aXBseShoMSwgNSkgKyAweGU2NTQ2YjY0O1xuICAgIH1cbiAgICBrMSA9IDA7XG4gICAgc3dpdGNoIChyZW1haW5kZXIpIHtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgazEgXj0gKGtleS5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBrMSBePSAoa2V5LmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgODtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgazEgXj0gKGtleS5jaGFyQ29kZUF0KGkpICYgMHhmZik7XG4gICAgICAgICAgICBrMSA9IF94ODZNdWx0aXBseShrMSwgYzEpO1xuICAgICAgICAgICAgazEgPSBfeDg2Um90bChrMSwgMTUpO1xuICAgICAgICAgICAgazEgPSBfeDg2TXVsdGlwbHkoazEsIGMyKTtcbiAgICAgICAgICAgIGgxIF49IGsxO1xuICAgIH1cbiAgICBoMSBePSBrZXkubGVuZ3RoO1xuICAgIGgxID0gX3g4NkZtaXgoaDEpO1xuICAgIHJldHVybiAoaDEgPj4+IDApLnRvU3RyaW5nKDE2KTtcbn07XG5cbmV4cG9ydCBsZXQgeDg2SGFzaDEyOCA9IGZ1bmN0aW9uIChrZXksIHNlZWQpIHtcbiAgICAvL1xuICAgIC8vIEdpdmVuIGEgc3RyaW5nIGFuZCBhbiBvcHRpb25hbCBzZWVkIGFzIGFuIGludCwgcmV0dXJucyBhIDEyOCBiaXRcbiAgICAvLyBoYXNoIHVzaW5nIHRoZSB4ODYgZmxhdm9yIG9mIE11cm11ckhhc2gzLCBhcyBhbiB1bnNpZ25lZCBoZXguXG4gICAgLy9cbiAgICBrZXkgPSBcIlwiICsga2V5IHx8ICcnO1xuXG4gICAgdmFyIHU4SW50QXJyYXkgPSB1dGlsLnRvVThJbnRBcnJheShrZXkpO1xuICAgIGtleSA9IHtcbiAgICAgICAgY2hhckNvZGVBdDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdThJbnRBcnJheVtpbmRleF07XG4gICAgICAgIH0sXG4gICAgICAgIGxlbmd0aDogdThJbnRBcnJheS5sZW5ndGhcbiAgICB9XG5cbiAgICBzZWVkID0gc2VlZCB8fCAwO1xuICAgIHZhciByZW1haW5kZXIgPSBrZXkubGVuZ3RoICUgMTY7XG4gICAgdmFyIGJ5dGVzID0ga2V5Lmxlbmd0aCAtIHJlbWFpbmRlcjtcbiAgICB2YXIgaDEgPSBzZWVkO1xuICAgIHZhciBoMiA9IHNlZWQ7XG4gICAgdmFyIGgzID0gc2VlZDtcbiAgICB2YXIgaDQgPSBzZWVkO1xuICAgIHZhciBrMSA9IDA7XG4gICAgdmFyIGsyID0gMDtcbiAgICB2YXIgazMgPSAwO1xuICAgIHZhciBrNCA9IDA7XG4gICAgdmFyIGMxID0gMHgyMzliOTYxYjtcbiAgICB2YXIgYzIgPSAweGFiMGU5Nzg5O1xuICAgIHZhciBjMyA9IDB4MzhiMzRhZTU7XG4gICAgdmFyIGM0ID0gMHhhMWUzOGI5MztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzOyBpID0gaSArIDE2KSB7XG4gICAgICAgIGsxID0gKChrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYpKSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgOCkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2KSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDMpICYgMHhmZikgPDwgMjQpO1xuICAgICAgICBrMiA9ICgoa2V5LmNoYXJDb2RlQXQoaSArIDQpICYgMHhmZikpIHwgKChrZXkuY2hhckNvZGVBdChpICsgNSkgJiAweGZmKSA8PCA4KSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDYpICYgMHhmZikgPDwgMTYpIHwgKChrZXkuY2hhckNvZGVBdChpICsgNykgJiAweGZmKSA8PCAyNCk7XG4gICAgICAgIGszID0gKChrZXkuY2hhckNvZGVBdChpICsgOCkgJiAweGZmKSkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyA5KSAmIDB4ZmYpIDw8IDgpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMTApICYgMHhmZikgPDwgMTYpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMTEpICYgMHhmZikgPDwgMjQpO1xuICAgICAgICBrNCA9ICgoa2V5LmNoYXJDb2RlQXQoaSArIDEyKSAmIDB4ZmYpKSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDEzKSAmIDB4ZmYpIDw8IDgpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMTQpICYgMHhmZikgPDwgMTYpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMTUpICYgMHhmZikgPDwgMjQpO1xuICAgICAgICBrMSA9IF94ODZNdWx0aXBseShrMSwgYzEpO1xuICAgICAgICBrMSA9IF94ODZSb3RsKGsxLCAxNSk7XG4gICAgICAgIGsxID0gX3g4Nk11bHRpcGx5KGsxLCBjMik7XG4gICAgICAgIGgxIF49IGsxO1xuICAgICAgICBoMSA9IF94ODZSb3RsKGgxLCAxOSk7XG4gICAgICAgIGgxICs9IGgyO1xuICAgICAgICBoMSA9IF94ODZNdWx0aXBseShoMSwgNSkgKyAweDU2MWNjZDFiO1xuICAgICAgICBrMiA9IF94ODZNdWx0aXBseShrMiwgYzIpO1xuICAgICAgICBrMiA9IF94ODZSb3RsKGsyLCAxNik7XG4gICAgICAgIGsyID0gX3g4Nk11bHRpcGx5KGsyLCBjMyk7XG4gICAgICAgIGgyIF49IGsyO1xuICAgICAgICBoMiA9IF94ODZSb3RsKGgyLCAxNyk7XG4gICAgICAgIGgyICs9IGgzO1xuICAgICAgICBoMiA9IF94ODZNdWx0aXBseShoMiwgNSkgKyAweDBiY2FhNzQ3O1xuICAgICAgICBrMyA9IF94ODZNdWx0aXBseShrMywgYzMpO1xuICAgICAgICBrMyA9IF94ODZSb3RsKGszLCAxNyk7XG4gICAgICAgIGszID0gX3g4Nk11bHRpcGx5KGszLCBjNCk7XG4gICAgICAgIGgzIF49IGszO1xuICAgICAgICBoMyA9IF94ODZSb3RsKGgzLCAxNSk7XG4gICAgICAgIGgzICs9IGg0O1xuICAgICAgICBoMyA9IF94ODZNdWx0aXBseShoMywgNSkgKyAweDk2Y2QxYzM1O1xuICAgICAgICBrNCA9IF94ODZNdWx0aXBseShrNCwgYzQpO1xuICAgICAgICBrNCA9IF94ODZSb3RsKGs0LCAxOCk7XG4gICAgICAgIGs0ID0gX3g4Nk11bHRpcGx5KGs0LCBjMSk7XG4gICAgICAgIGg0IF49IGs0O1xuICAgICAgICBoNCA9IF94ODZSb3RsKGg0LCAxMyk7XG4gICAgICAgIGg0ICs9IGgxO1xuICAgICAgICBoNCA9IF94ODZNdWx0aXBseShoNCwgNSkgKyAweDMyYWMzYjE3O1xuICAgIH1cbiAgICBrMSA9IDA7XG4gICAgazIgPSAwO1xuICAgIGszID0gMDtcbiAgICBrNCA9IDA7XG4gICAgc3dpdGNoIChyZW1haW5kZXIpIHtcbiAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgIGs0IF49IGtleS5jaGFyQ29kZUF0KGkgKyAxNCkgPDwgMTY7XG4gICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICBrNCBePSBrZXkuY2hhckNvZGVBdChpICsgMTMpIDw8IDg7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICBrNCBePSBrZXkuY2hhckNvZGVBdChpICsgMTIpO1xuICAgICAgICAgICAgazQgPSBfeDg2TXVsdGlwbHkoazQsIGM0KTtcbiAgICAgICAgICAgIGs0ID0gX3g4NlJvdGwoazQsIDE4KTtcbiAgICAgICAgICAgIGs0ID0gX3g4Nk11bHRpcGx5KGs0LCBjMSk7XG4gICAgICAgICAgICBoNCBePSBrNDtcbiAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgIGszIF49IGtleS5jaGFyQ29kZUF0KGkgKyAxMSkgPDwgMjQ7XG4gICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICBrMyBePSBrZXkuY2hhckNvZGVBdChpICsgMTApIDw8IDE2O1xuICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgazMgXj0ga2V5LmNoYXJDb2RlQXQoaSArIDkpIDw8IDg7XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIGszIF49IGtleS5jaGFyQ29kZUF0KGkgKyA4KTtcbiAgICAgICAgICAgIGszID0gX3g4Nk11bHRpcGx5KGszLCBjMyk7XG4gICAgICAgICAgICBrMyA9IF94ODZSb3RsKGszLCAxNyk7XG4gICAgICAgICAgICBrMyA9IF94ODZNdWx0aXBseShrMywgYzQpO1xuICAgICAgICAgICAgaDMgXj0gazM7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIGsyIF49IGtleS5jaGFyQ29kZUF0KGkgKyA3KSA8PCAyNDtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgazIgXj0ga2V5LmNoYXJDb2RlQXQoaSArIDYpIDw8IDE2O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBrMiBePSBrZXkuY2hhckNvZGVBdChpICsgNSkgPDwgODtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgazIgXj0ga2V5LmNoYXJDb2RlQXQoaSArIDQpO1xuICAgICAgICAgICAgazIgPSBfeDg2TXVsdGlwbHkoazIsIGMyKTtcbiAgICAgICAgICAgIGsyID0gX3g4NlJvdGwoazIsIDE2KTtcbiAgICAgICAgICAgIGsyID0gX3g4Nk11bHRpcGx5KGsyLCBjMyk7XG4gICAgICAgICAgICBoMiBePSBrMjtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgazEgXj0ga2V5LmNoYXJDb2RlQXQoaSArIDMpIDw8IDI0O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBrMSBePSBrZXkuY2hhckNvZGVBdChpICsgMikgPDwgMTY7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGsxIF49IGtleS5jaGFyQ29kZUF0KGkgKyAxKSA8PCA4O1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBrMSBePSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIGsxID0gX3g4Nk11bHRpcGx5KGsxLCBjMSk7XG4gICAgICAgICAgICBrMSA9IF94ODZSb3RsKGsxLCAxNSk7XG4gICAgICAgICAgICBrMSA9IF94ODZNdWx0aXBseShrMSwgYzIpO1xuICAgICAgICAgICAgaDEgXj0gazE7XG4gICAgfVxuICAgIGgxIF49IGtleS5sZW5ndGg7XG4gICAgaDIgXj0ga2V5Lmxlbmd0aDtcbiAgICBoMyBePSBrZXkubGVuZ3RoO1xuICAgIGg0IF49IGtleS5sZW5ndGg7XG4gICAgaDEgKz0gaDI7XG4gICAgaDEgKz0gaDM7XG4gICAgaDEgKz0gaDQ7XG4gICAgaDIgKz0gaDE7XG4gICAgaDMgKz0gaDE7XG4gICAgaDQgKz0gaDE7XG4gICAgaDEgPSBfeDg2Rm1peChoMSk7XG4gICAgaDIgPSBfeDg2Rm1peChoMik7XG4gICAgaDMgPSBfeDg2Rm1peChoMyk7XG4gICAgaDQgPSBfeDg2Rm1peChoNCk7XG4gICAgaDEgKz0gaDI7XG4gICAgaDEgKz0gaDM7XG4gICAgaDEgKz0gaDQ7XG4gICAgaDIgKz0gaDE7XG4gICAgaDMgKz0gaDE7XG4gICAgaDQgKz0gaDE7XG4gICAgcmV0dXJuIChcIjAwMDAwMDAwXCIgKyAoaDEgPj4+IDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTgpICsgKFwiMDAwMDAwMDBcIiArIChoMiA+Pj4gMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtOCkgKyAoXCIwMDAwMDAwMFwiICsgKGgzID4+PiAwKS50b1N0cmluZygxNikpLnNsaWNlKC04KSArIChcIjAwMDAwMDAwXCIgKyAoaDQgPj4+IDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTgpO1xufTtcblxuZXhwb3J0IGxldCB4NjRIYXNoNjQgPSBmdW5jdGlvbiAoa2V5LCBzZWVkKSB7XG4gICAgdmFyIHJlc3VsdCA9IHg2NEhhc2gxMjgoa2V5LCBzZWVkKS5zbGljZSg4KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGxldCB4NjRIYXNoMTI4ID0gZnVuY3Rpb24gKGtleSwgc2VlZCkge1xuICAgIC8vXG4gICAgLy8gR2l2ZW4gYSBzdHJpbmcgYW5kIGFuIG9wdGlvbmFsIHNlZWQgYXMgYW4gaW50LCByZXR1cm5zIGEgMTI4IGJpdFxuICAgIC8vIGhhc2ggdXNpbmcgdGhlIHg2NCBmbGF2b3Igb2YgTXVybXVySGFzaDMsIGFzIGFuIHVuc2lnbmVkIGhleC5cbiAgICAvL1xuICAgIGtleSA9IFwiXCIgKyBrZXkgfHwgJyc7XG5cbiAgICB2YXIgdThJbnRBcnJheSA9IHV0aWwudG9VOEludEFycmF5KGtleSk7XG4gICAga2V5ID0ge1xuICAgICAgICBjaGFyQ29kZUF0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB1OEludEFycmF5W2luZGV4XTtcbiAgICAgICAgfSxcbiAgICAgICAgbGVuZ3RoOiB1OEludEFycmF5Lmxlbmd0aFxuICAgIH1cblxuICAgIHNlZWQgPSBzZWVkIHx8IDA7XG4gICAgdmFyIHJlbWFpbmRlciA9IGtleS5sZW5ndGggJSAxNjtcbiAgICB2YXIgYnl0ZXMgPSBrZXkubGVuZ3RoIC0gcmVtYWluZGVyO1xuICAgIHZhciBoMSA9IFswLCBzZWVkXTtcbiAgICB2YXIgaDIgPSBbMCwgc2VlZF07XG4gICAgdmFyIGsxID0gWzAsIDBdO1xuICAgIHZhciBrMiA9IFswLCAwXTtcbiAgICB2YXIgYzEgPSBbMHg4N2MzN2I5MSwgMHgxMTQyNTNkNV07XG4gICAgdmFyIGMyID0gWzB4NGNmNWFkNDMsIDB4Mjc0NTkzN2ZdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXM7IGkgPSBpICsgMTYpIHtcbiAgICAgICAgazEgPSBbKChrZXkuY2hhckNvZGVBdChpICsgNCkgJiAweGZmKSkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyA1KSAmIDB4ZmYpIDw8IDgpIHwgKChrZXkuY2hhckNvZGVBdChpICsgNikgJiAweGZmKSA8PCAxNikgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyA3KSAmIDB4ZmYpIDw8IDI0KSwgKChrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYpKSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgOCkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2KSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDMpICYgMHhmZikgPDwgMjQpXTtcbiAgICAgICAgazIgPSBbKChrZXkuY2hhckNvZGVBdChpICsgMTIpICYgMHhmZikpIHwgKChrZXkuY2hhckNvZGVBdChpICsgMTMpICYgMHhmZikgPDwgOCkgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAxNCkgJiAweGZmKSA8PCAxNikgfCAoKGtleS5jaGFyQ29kZUF0KGkgKyAxNSkgJiAweGZmKSA8PCAyNCksICgoa2V5LmNoYXJDb2RlQXQoaSArIDgpICYgMHhmZikpIHwgKChrZXkuY2hhckNvZGVBdChpICsgOSkgJiAweGZmKSA8PCA4KSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDEwKSAmIDB4ZmYpIDw8IDE2KSB8ICgoa2V5LmNoYXJDb2RlQXQoaSArIDExKSAmIDB4ZmYpIDw8IDI0KV07XG4gICAgICAgIGsxID0gX3g2NE11bHRpcGx5KGsxLCBjMSk7XG4gICAgICAgIGsxID0gX3g2NFJvdGwoazEsIDMxKTtcbiAgICAgICAgazEgPSBfeDY0TXVsdGlwbHkoazEsIGMyKTtcbiAgICAgICAgaDEgPSBfeDY0WG9yKGgxLCBrMSk7XG4gICAgICAgIGgxID0gX3g2NFJvdGwoaDEsIDI3KTtcbiAgICAgICAgaDEgPSBfeDY0QWRkKGgxLCBoMik7XG4gICAgICAgIGgxID0gX3g2NEFkZChfeDY0TXVsdGlwbHkoaDEsIFswLCA1XSksIFswLCAweDUyZGNlNzI5XSk7XG4gICAgICAgIGsyID0gX3g2NE11bHRpcGx5KGsyLCBjMik7XG4gICAgICAgIGsyID0gX3g2NFJvdGwoazIsIDMzKTtcbiAgICAgICAgazIgPSBfeDY0TXVsdGlwbHkoazIsIGMxKTtcbiAgICAgICAgaDIgPSBfeDY0WG9yKGgyLCBrMik7XG4gICAgICAgIGgyID0gX3g2NFJvdGwoaDIsIDMxKTtcbiAgICAgICAgaDIgPSBfeDY0QWRkKGgyLCBoMSk7XG4gICAgICAgIGgyID0gX3g2NEFkZChfeDY0TXVsdGlwbHkoaDIsIFswLCA1XSksIFswLCAweDM4NDk1YWI1XSk7XG4gICAgfVxuICAgIGsxID0gWzAsIDBdO1xuICAgIGsyID0gWzAsIDBdO1xuICAgIHN3aXRjaCAocmVtYWluZGVyKSB7XG4gICAgICAgIGNhc2UgMTU6XG4gICAgICAgICAgICBrMiA9IF94NjRYb3IoazIsIF94NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAxNCldLCA0OCkpO1xuICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgazIgPSBfeDY0WG9yKGsyLCBfeDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgMTMpXSwgNDApKTtcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIGsyID0gX3g2NFhvcihrMiwgX3g2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDEyKV0sIDMyKSk7XG4gICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICBrMiA9IF94NjRYb3IoazIsIF94NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAxMSldLCAyNCkpO1xuICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgazIgPSBfeDY0WG9yKGsyLCBfeDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgMTApXSwgMTYpKTtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIGsyID0gX3g2NFhvcihrMiwgX3g2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDkpXSwgOCkpO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICBrMiA9IF94NjRYb3IoazIsIFswLCBrZXkuY2hhckNvZGVBdChpICsgOCldKTtcbiAgICAgICAgICAgIGsyID0gX3g2NE11bHRpcGx5KGsyLCBjMik7XG4gICAgICAgICAgICBrMiA9IF94NjRSb3RsKGsyLCAzMyk7XG4gICAgICAgICAgICBrMiA9IF94NjRNdWx0aXBseShrMiwgYzEpO1xuICAgICAgICAgICAgaDIgPSBfeDY0WG9yKGgyLCBrMik7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIGsxID0gX3g2NFhvcihrMSwgX3g2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDcpXSwgNTYpKTtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgazEgPSBfeDY0WG9yKGsxLCBfeDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgNildLCA0OCkpO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICBrMSA9IF94NjRYb3IoazEsIF94NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA1KV0sIDQwKSk7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGsxID0gX3g2NFhvcihrMSwgX3g2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDQpXSwgMzIpKTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgazEgPSBfeDY0WG9yKGsxLCBfeDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgMyldLCAyNCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBrMSA9IF94NjRYb3IoazEsIF94NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAyKV0sIDE2KSk7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGsxID0gX3g2NFhvcihrMSwgX3g2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDEpXSwgOCkpO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBrMSA9IF94NjRYb3IoazEsIFswLCBrZXkuY2hhckNvZGVBdChpKV0pO1xuICAgICAgICAgICAgazEgPSBfeDY0TXVsdGlwbHkoazEsIGMxKTtcbiAgICAgICAgICAgIGsxID0gX3g2NFJvdGwoazEsIDMxKTtcbiAgICAgICAgICAgIGsxID0gX3g2NE11bHRpcGx5KGsxLCBjMik7XG4gICAgICAgICAgICBoMSA9IF94NjRYb3IoaDEsIGsxKTtcbiAgICB9XG4gICAgaDEgPSBfeDY0WG9yKGgxLCBbMCwga2V5Lmxlbmd0aF0pO1xuICAgIGgyID0gX3g2NFhvcihoMiwgWzAsIGtleS5sZW5ndGhdKTtcbiAgICBoMSA9IF94NjRBZGQoaDEsIGgyKTtcbiAgICBoMiA9IF94NjRBZGQoaDIsIGgxKTtcbiAgICBoMSA9IF94NjRGbWl4KGgxKTtcbiAgICBoMiA9IF94NjRGbWl4KGgyKTtcbiAgICBoMSA9IF94NjRBZGQoaDEsIGgyKTtcbiAgICBoMiA9IF94NjRBZGQoaDIsIGgxKTtcbiAgICByZXR1cm4gKFwiMDAwMDAwMDBcIiArIChoMVswXSA+Pj4gMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtOCkgKyAoXCIwMDAwMDAwMFwiICsgKGgxWzFdID4+PiAwKS50b1N0cmluZygxNikpLnNsaWNlKC04KSArIChcIjAwMDAwMDAwXCIgKyAoaDJbMF0gPj4+IDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTgpICsgKFwiMDAwMDAwMDBcIiArIChoMlsxXSA+Pj4gMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtOCk7XG59O1xuXG5leHBvcnQgbGV0IGhhc2ggPSBmdW5jdGlvbiAoa2V5LCBzZWVkKSB7XG4gICAgcmV0dXJuIHg2NEhhc2gxMjgoa2V5LCBzZWVkKTtcbn07XG5cbiIsImV4cG9ydCBmdW5jdGlvbiB0b1U4SW50QXJyYXkoaW5wdXRTdHJpbmcpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgdGVtcEFycmF5T2ZDaGFyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dFN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBpbnB1dFN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgdGVtcDtcbiAgICAgICAgdGVtcEFycmF5T2ZDaGFyLmxlbmd0aCA9IDA7XG4gICAgICAgIHdoaWxlICgodGVtcCA9IGNoYXJDb2RlICYgMHhmZikgfHwgY2hhckNvZGUpIHtcbiAgICAgICAgICAgIC8vIHB1c2hpbmcgb25lIGJ5dGVcbiAgICAgICAgICAgIHRlbXBBcnJheU9mQ2hhci5wdXNoKHRlbXApO1xuICAgICAgICAgICAgLy8gc2hpZnRpbmcgOCBiaXQgcmlnaHRcbiAgICAgICAgICAgIGNoYXJDb2RlID4+Pj0gODtcbiAgICAgICAgfVxuICAgICAgICBhcnJheSA9IGFycmF5LmNvbmNhdCh0ZW1wQXJyYXlPZkNoYXIucmV2ZXJzZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50VG9VbnNpZ25lZEhleChudW1iZXIpIHtcbiAgICB2YXIgdGVtcDtcbiAgICB2YXIgaGV4QXJyYXkgPSBbXTtcbiAgICB3aGlsZSAoKHRlbXAgPSBudW1iZXIgJiAweGZmZmYpIHx8IG51bWJlcikge1xuICAgICAgICB0ZW1wID0gdGVtcC50b1N0cmluZygxNik7XG4gICAgICAgIHRlbXAgPSAnMDAwMCcuc2xpY2UodGVtcC5sZW5ndGgpICsgdGVtcDtcbiAgICAgICAgaGV4QXJyYXkucHVzaCh0ZW1wKTtcbiAgICAgICAgbnVtYmVyID4+Pj0gMTY7XG4gICAgfVxuICAgIHJldHVybiBoZXhBcnJheS5yZXZlcnNlKCkuam9pbignJyk7XG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCAqIGZyb20gJy4vaGVscCc7XG5leHBvcnQgKiBmcm9tICcuL0Nvc3R1bWVEZWYnO1xuZXhwb3J0ICogZnJvbSAnLi9Db2RlRmlsZURlZic7XG5leHBvcnQgKiBmcm9tICcuL1NjcmVlbkRlZic7XG5leHBvcnQgKiBmcm9tICcuL1RpbGVMZXZlbERlZic7XG5leHBvcnQgKiBmcm9tICcuL1Byb2plY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9nYW1lJztcbmV4cG9ydCAqIGZyb20gJy4vU2NyZWVuJztcbmV4cG9ydCAqIGZyb20gJy4vU3ByaXRlJztcbmV4cG9ydCAqIGZyb20gJy4vU3ByaXRlU291cmNlJztcbmV4cG9ydCAqIGZyb20gJy4vaW5wdXQnO1xuZXhwb3J0ICogZnJvbSAnLi9Qcm9qZWN0U3RvcmFnZSc7XG5leHBvcnQgKiBmcm9tICcuL1RpbGVMZXZlbCc7XG5leHBvcnQgKiBmcm9tICcuL1Nwcml0ZURlZic7XG5cbmV4cG9ydCBjbGFzcyBIZWxwMiB7XG4gIHByaXZhdGUgX2NvbnRlbnQ6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICBwdWJsaWMgYWRkKGtleTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLl9jb250ZW50W2tleV0gPSBjb250ZW50O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=