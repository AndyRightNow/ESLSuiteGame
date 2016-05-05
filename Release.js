var Vector = function(r, e) { this.x = r || 0, this.y = e || 0 };
Vector.prototype.dot = function(r) {
    return this.x * r.x + this.y * r.y }, Vector.prototype.len2 = function() {
    return this.dot(this) }, Vector.prototype.len = function() {
    return Math.sqrt(this.len2()) }, Vector.prototype.copy = function(r) {
    return this.x = r.x, this.y = r.y, this }, Vector.prototype.clone = function() {
    return new Vector(this.x, this.y) }, Vector.prototype.perp = function() {
    var r = this.x;
    return this.x = this.y, this.y = -r, this }, Vector.prototype.reverse = function() {
    return this.x = -this.x, this.y = -this.y, this }, Vector.prototype.translate = function(r, e) {
    return this.x += r, this.y += e, this }, Vector.prototype.rotate = function(r) {
    var e = r * (Math.PI / 180),
        t = this.x;
    return this.x = this.x * Math.cos(e) + this.y * Math.sin(e), this.y = -t * Math.sin(e) + this.y * Math.cos(e), this }, Vector.prototype.scale = function(r, e) {
    return this.x *= r, this.y *= e || r, this }, Vector.prototype.normalize = function() {
    var r = this.len();
    return r > 0 && (this.x /= r, this.y /= r), this }, Vector.prototype.add = function(r) {
    return this.x += r.x, this.y += r.y, this }, Vector.prototype.sub = function(r) {
    return this.x -= r.x, this.y -= r.y, this }, Vector.prototype.project = function(r) {
    var e = this.dot(r) / r.len2();
    return r.scale(e) }, Vector.prototype.projectN = function(r) {
    var e = this.dot(r);
    return r.scale(e) };
var Circle = function(r, e) { this.center = r, this.r = e };
Circle.prototype.translate = function(r, e) {
    return this.center.translate(r, e), this }, Circle.prototype.scale = function(r) {
    return this.r *= r, this };
var Box = function(r, e, t) { this.points = [new Vector(r.x, r.y), new Vector(r.x + e, r.y), new Vector(r.x + e, r.y + t), new Vector(r.x, r.y + t)], this.topLeftPos = this.points[0], this.w = e, this.h = t };
Box.prototype._getCenter = function() {
    return new Vector((this.points[0].x + this.points[2].x) / 2, (this.points[0].y + this.points[2].y) / 2) }, Box.prototype.translate = function(r, e) {
    return this.points[0].translate(r, e), this.points[1].translate(r, e), this.points[2].translate(r, e), this.points[3].translate(r, e), this }, Box.prototype.rotate = function(r) {
    var e = this._getCenter(),
        t = e.x,
        i = e.y;
    return this.translate(-t, -i), this.points[0].rotate(r), this.points[1].rotate(r), this.points[2].rotate(r), this.points[3].rotate(r), this.translate(t, i), this }, Box.prototype.scale = function(r, e) {
    var t = this._getCenter(),
        i = t.x,
        n = t.y;
    return this.translate(-i, -n), this.points[0].scale(r, e), this.points[1].scale(r, e), this.points[2].scale(r, e), this.points[3].scale(r, e), this.translate(i, n), this };
var Polygon = function(r, e, t) { this._totalRotation = 0, this.points = [];
    for (var i = GraphicsContext.width(), n = GraphicsContext.height(), a = 0, o = 0, s = 0, c = 0, h = 0; h < arguments[0].length; h++) this.points.push(arguments[0][h]), arguments[0][h].x < i && (i = arguments[0][h].x), arguments[0][h].y < n && (n = arguments[0][h].y), arguments[0][h].x > a && (a = arguments[0][h].x), arguments[0][h].y > o && (o = arguments[0][h].y);
    switch (s = a - i, c = o - n, this.box = new Box(new Vector(i, n), s, c), arguments.length) {
        case 3:
            this.box = t, this.translate(-this.box.points[0].x, -this.box.points[0].y), this.translate(e.x, e.y);
            break;
        case 2:
            this.translate(-i, -n), this.translate(e.x, e.y) } };
Polygon.prototype._getCenter = function() {
    return this.box._getCenter() }, Polygon.prototype.translate = function(r, e) {
    for (var t = 0; t < this.points.length; t++) this.points[t].translate(r, e);
    return this.box.translate(r, e), this }, Polygon.prototype.rotate = function(r) { this._totalRotation += r;
    var e = this._getCenter(),
        t = e.x,
        i = e.y;
    this.translate(-t, -i);
    for (var n = 0; n < this.points.length; n++) this.points[n].rotate(r);
    this.box.rotate(r), this.translate(t, i) }, Polygon.prototype.clearRotation = function() { this.rotate(-this._totalRotation) }, Polygon.prototype.scale = function(r, e) {
    var t = this._getCenter(),
        i = t.x,
        n = t.y;
    this.translate(-i, -n);
    for (var a = 0; a < this.points.length; a++) this.points[a].scale(r, e);
    return this.box.scale(r, e), this.translate(i, n), this };
var Utility = { getRandIndex: function(r) {
            return parseInt((Math.random() * r + Math.random() * r) % r) }, getPosiOrNega: function() {
            var r = [1, -1];
            return r[parseInt(10 * Math.random() * Math.random() * 10 % 2)] } },
    colliDetectHelper = { getEdge: function(r, e) {
            return new Vector(e.x - r.x, e.y - r.y).perp() }, flattenPolygonOnAxis: function(r, e) {
            for (var t, i = GraphicsContext.width(), n = GraphicsContext.height(), a = [new Vector(i, n), new Vector(-GraphicsContext.width(), -GraphicsContext.height())], o = 0; o < r.points.length; o++) t = r.points[o].project(e), t.x < a[0].x && (a[0] = t.clone()), t.x > a[1].x && (a[1] = t.clone());
            return a } },
    colliDetect = { _isSeparatedAxis: function(r, e, t) {
            var i = colliDetectHelper.flattenPolygonOnAxis(r, t),
                n = colliDetectHelper.flattenPolygonOnAxis(e, t);
            i = [i[0].project(new Vector(1, 0)), i[1].project(new Vector(1, 0))], n = [n[0].project(new Vector(1, 0)), n[1].project(new Vector(1, 0))];
            var a, o;
            return i[0].x < n[0].x ? (a = n, o = i) : (a = i, o = n), a[0].x <= o[1].x ? !1 : !0 }, detect: function(r, e) {
            for (var t, i, n = r.points, a = 0; a < n.length; a++)
                if (i = a === n.length - 1 ? colliDetectHelper.getEdge(n[a], n[0]) : colliDetectHelper.getEdge(n[a], n[a + 1]), t = this._isSeparatedAxis(r, e, i)) return !1;
            n = e.points;
            for (var a = 0; a < n.length; a++)
                if (i = a === n.length - 1 ? colliDetectHelper.getEdge(n[a], n[0]) : colliDetectHelper.getEdge(n[a], n[a + 1]), t = this._isSeparatedAxis(r, e, i)) return !1;
            return !0 } },
    Timer = { _date: 0, _totalTime: 0, _startTime: 0, _started: !1, _reset: function() { this._startTime = 0, this._totalTime = 0, this._date = new Date }, start: function() { this._date = new Date;
            var r = this._date.getUTCHours(),
                e = this._date.getUTCMinutes(),
                t = this._date.getUTCSeconds(),
                i = this._date.getUTCMilliseconds(),
                n = 60 * r * 60 * 1e3 + 60 * e * 1e3 + 1e3 * t + i;
            this._startTime = n, this._started = !0 }, stop: function() { this._started = !1, this._reset() }, totalTime: function() { this._date = new Date;
            var r = this._date.getUTCHours(),
                e = this._date.getUTCMinutes(),
                t = this._date.getUTCSeconds(),
                i = this._date.getUTCMilliseconds(),
                n = 60 * r * 60 * 1e3 + 60 * e * 1e3 + 1e3 * t + i;
            return this._totalTime = n - this._startTime, this._totalTime }, isRunning: function() {
            return this._started } },
    GraphicsContext = { canvas: document.getElementById("canvas"), canvasCtx: canvas.getContext("2d"), width: function() {
            return this.canvas.width }, height: function() {
            return this.canvas.height }, clearCanvas: function() { this.canvasCtx.clearRect(0, 0, canvas.width, canvas.height) }, drawImage: function(r, e, t, i, n) {
            return this.canvasCtx.drawImage(r, e, t, i, n) }, drawCircle: function(r, e) { this.canvasCtx.beginPath(), this.canvasCtx.arc(r.center.x, r.center.y, r.r, 0, 2 * Math.PI), this.canvasCtx.fillStyle = e, this.canvasCtx.fill() }, drawPolygon: function(r, e) { this.canvasCtx.fillStyle = e, this.canvasCtx.beginPath();
            for (var t = 0; t < r.points.length; t++) 0 === t && this.canvasCtx.moveTo(r.points[t].x, r.points[t].y), this.canvasCtx.lineTo(r.points[t].x, r.points[t].y), t === r.points.length - 1 && this.canvasCtx.lineTo(r.points[r.points.length - 1].x, r.points[r.points.length - 1].y);
            this.canvasCtx.fill(), this.canvasCtx.closePath() }, translate: function(r, e) {
            return this.canvasCtx.translate(r, e) }, rotate: function(r) {
            return this.canvasCtx.rotate(r) }, scale: function(r, e) {
            return this.canvasCtx.scale(r, e) }, transfrom: function(r, e, t, i, n, a) {
            return this.canvasCtx.transfrom(r, e, t, i, n, a) }, save: function() {
            return this.canvasCtx.save() }, restore: function() {
            return this.canvasCtx.restore() }, setGlobalComposition: function(r) { this.canvasCtx.globalCompositeOperation = r } },
    UIClass = { _showDarkBackground: function() { GraphicsContext.canvasCtx.fillStyle = "rgba(0, 0, 0, 0.7)", GraphicsContext.canvasCtx.fillRect(0, 0, GraphicsContext.width(), GraphicsContext.height()) }, _showText: function(r, e, t, i, n, a, o) { GraphicsContext.canvasCtx.font = r, GraphicsContext.canvasCtx.textBaseline = e, GraphicsContext.canvasCtx.textAlign = t, GraphicsContext.canvasCtx.fillStyle = i, GraphicsContext.canvasCtx.fillText(n, a, o) }, showPauseScene: function() { GraphicsContext.save(), this._showDarkBackground(), this._showText("bolder 84px Roboto", "middle", "center", "white", "Click to Start", .5 * GraphicsContext.width(), .5 * GraphicsContext.height()), GraphicsContext.restore() }, showLoadingScene: function() { GraphicsContext.save(), this._showDarkBackground(), this._showText("bolder 84px Roboto", "middle", "center", "white", "Loading...", .5 * GraphicsContext.width(), .5 * GraphicsContext.height()), GraphicsContext.restore() }, showGameRecord: function(r, e) { GraphicsContext.save(), this._showText("bolder 36px Roboto", "top", "end", "white", r, .95 * GraphicsContext.width(), .05 * GraphicsContext.height()), this._showText("bolder 36px Roboto", "top", "start", "white", "Highest: " + e, .05 * GraphicsContext.width(), .05 * GraphicsContext.height()), GraphicsContext.restore() }, showRestartScene: function(r) { GraphicsContext.save(), this._showDarkBackground(), this._showText("bolder 48px Roboto", "bottom", "center", "white", "Highest: " + r, .5 * GraphicsContext.width(), .4 * GraphicsContext.height()), this._showText("bolder 84px Roboto", "top", "center", "white", "Click to Restart", .5 * GraphicsContext.width(), .4 * GraphicsContext.height()), GraphicsContext.restore() } },
    InputClass = { _mouseMove: !1, mouseX: 0, mouseY: 0, _lastMouseX: 0, _lastMouseY: 0, clickCount: 0, lastClick: new Vector, listen: function() {
            var r = $(GraphicsContext.canvas).offset().left,
                e = $(GraphicsContext.canvas).offset().top;
            document.addEventListener("mousemove", function(t) { InputClass._mouseMove ? (InputClass.mouseX = t.pageX - r, InputClass.mouseY = t.pageY - e, InputClass._lastMouseX = InputClass.mouseX, InputClass._lastMouseY = InputClass.mouseY) : (InputClass.mouseX = InputClass._lastMouseX, InputClass.mouseY = InputClass._lastMouseY) }), canvas.addEventListener("mouseenter", function(r) { InputClass._mouseMove = !0 }), canvas.addEventListener("mouseout", function(r) { InputClass._mouseMove = !1 }), canvas.addEventListener("click", function(r) { InputClass.clickCount++, InputClass.lastClick.x = InputClass.mouseX, InputClass.lastClick.y = InputClass.mouseY }) }, resetClicks: function() { this.clickCount = 0, this.lastClick = new Vector } },
    ImageLoading = { _imageNum: 0, _imageLoaded: 0, isDone: function() {
            return this._imageLoaded === this._imageNum }, addNum: function() { this._imageNum++ }, addLoaded: function() { this._imageLoaded++ } },
    ImageObject = function(r, e, t, i, n) { this.imgFrames = [], this.imgIndex = 0, this.thisImgFrame = this.imgFrames[this.imgIndex], this.x = r || 0, this.y = e || 0, this.width = t || 0, this.height = i || 0, this.bounding = n || null, this.ax = 0, this.ay = 0, this.r = 0, this.dr = 0, this.used = !1, this.flags = [] };
ImageObject.prototype.addImageFrame = function(r) { ImageLoading.addNum();
    var e = new Image;
    e.src = r, this.imgFrames.push(e), e.addEventListener("load", function() { ImageLoading.addLoaded() }) }, ImageObject.prototype.update = function(r, e, t) { this.x += e, this.y += t, this.imgIndex = (this.imgIndex + 1) % this.imgFrames.length, this.thisImgFrame = this.imgFrames[this.imgIndex], GraphicsContext.save(), GraphicsContext.translate(this.getCenterX(), this.getCenterY()), GraphicsContext.rotate(r), GraphicsContext.translate(-this.getCenterX(), -this.getCenterY()), null !== this.bounding && void 0 !== this.bounding && (this.bounding.clearRotation(), this.bounding.rotate(-r * (180 / Math.PI)), this.bounding.translate(e, t)) }, ImageObject.prototype.draw = function() { GraphicsContext.drawImage(this.thisImgFrame, this.x, this.y, this.width, this.height), GraphicsContext.restore() }, ImageObject.prototype.getCenterX = function() {
    return this.x + this.width / 2 }, ImageObject.prototype.getCenterY = function() {
    return this.y + this.height / 2 }, ImageObject.prototype.resetFlagAndPos = function(r, e) { this.used = !1, this.setX(r), this.setY(e), this.r = 0, this.ax = 0, this.ay = 0 }, ImageObject.prototype.setX = function(r) { this.x = r, null !== this.bounding && (this.bounding.clearRotation(), this.bounding.translate(-this.bounding.box.points[0].x, 0), this.bounding.translate(r, 0)) }, ImageObject.prototype.setY = function(r) { this.y = r, null !== this.bounding && (this.bounding.clearRotation(), this.bounding.translate(0, -this.bounding.box.points[0].y), this.bounding.translate(0, r)) };
for (var BarrierGenerator = { _record: 0, _level: 0, _lastBarrier: null, _lastBarrierIndex: null, _lastBarrierIssueTime: 0, _gapFromLastBarrier: 0, _setRandSpeedAndRotation: function(r, e, t) { r.ax = e * (1 + Math.random()), r.ay = e * (.5 * Math.random()) * Utility.getPosiOrNega(), r.r = 10 * Math.random(), r.dr = Math.random() * Math.random() * .05;
            for (var i = 0; i < t.length; i++) switch (t[i]) {
                case "No Rotation":
                    r.r = 0, r.dr = 0;
                    break;
                case "No Y Acceleration":
                    r.ay = 0;
                    break;
                case "No X Acceleration":
                    r.ax = 0 } }, _getRandY: function() {
            var r = 528314 * Math.random() * Math.random() % GraphicsContext.height();
            if (null !== this._lastBarrier)
                for (var e = this._lastBarrier.y - this._lastBarrier.height, t = this._lastBarrier.y + this._lastBarrier.heigtt; r >= e && t >= r;) r = 528314 * Math.random() * Math.random() % GraphicsContext.height();
            return r }, _getRandGapFromLast: function() {
            var r = 5e3,
                e = 0;
            if (null !== this._lastBarrier) {
                var t = this._lastBarrier.width,
                    i = this._level;
                e = t + Math.random() * r / i }
            return e }, setLevel: function(r) {
            var e = 1e4;
            this._level = 0 === parseInt(r / e) ? 1 : r / e }, getThisBarrier: function(r, e) {
            if (null !== this._lastBarrier) {
                var t = r - this._lastBarrierIssueTime;
                if (t * Math.abs(e) <= this._gapFromLastBarrier) return null }
            var i = Utility.getRandIndex(barriersList.length);
            if (i === this._lastBarrierIndex || barriersList[i].used) return null;
            var n = barriersList[i];
            return n.used = !0, this._setRandSpeedAndRotation(n, e, n.flags), n.setY(this._getRandY()), this._gapFromLastBarrier = this._getRandGapFromLast(), this._lastBarrier = n, this._lastBarrierIndex = i, this._lastBarrierIssueTime = r, n }, reset: function() { this._record = 0, this._level = 0, this._lastBarrier = null, this._lastBarrierIndex = null, this._lastBarrierIssueTime = 0, this._gapFromLastBarrier = 0 } }, barriersStartingTopLeftPos = new Vector(GraphicsContext.width() + 1, 0), barriersCount = 11, BarrierLoading = { isDone: function() {
            return barriersList.length === barriersCount ? !0 : !1 } }, barriersList = [], barrierWidth = 65, barrierHeight = 85, barrierBoundingPoints = [new Vector(4, 21), new Vector(20, 1), new Vector(28, 0), new Vector(39, 10), new Vector(59, 26), new Vector(64, 45), new Vector(57, 64), new Vector(53, 66), new Vector(52, 74), new Vector(48, 76), new Vector(36, 74), new Vector(25, 83), new Vector(12, 81), new Vector(0, 58), new Vector(2, 42)], i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
var barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight),
    barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox),
    barrierFrames = ["https://farm8.staticflickr.com/7731/26555058860_9e6035e3ca_o.png"],
    barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding);
barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 200, barrierHeight = 200, barrierBoundingPoints = [new Vector(97, 4), new Vector(140, 13), new Vector(179, 43), new Vector(198, 98), new Vector(185, 144), new Vector(151, 183), new Vector(97, 197), new Vector(49, 184), new Vector(22, 162), new Vector(3, 106), new Vector(9, 60), new Vector(40, 25)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7266/26793431536_4a961e12cd_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 100, barrierHeight = 100, barrierBoundingPoints = [new Vector(48, 0), new Vector(71, 6), new Vector(93, 26), new Vector(100, 49), new Vector(93, 75), new Vector(77, 91), new Vector(50, 98), new Vector(25, 91), new Vector(10, 80), new Vector(0, 52), new Vector(8, 25), new Vector(19, 10)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7624/26223204943_6290653216_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 150, barrierHeight = 172, barrierBoundingPoints = [new Vector(69, 1), new Vector(75, 1), new Vector(74, 12), new Vector(78, 44), new Vector(100, 60), new Vector(128, 51), new Vector(136, 47), new Vector(149, 57), new Vector(144, 75), new Vector(103, 120), new Vector(96, 141), new Vector(67, 171), new Vector(12, 126), new Vector(0, 107), new Vector(7, 103), new Vector(29, 98), new Vector(48, 70), new Vector(48, 65), new Vector(45, 55), new Vector(49, 30), new Vector(55, 10)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7630/26555058940_f082f28dd5_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 80, barrierHeight = 153, barrierBoundingPoints = [new Vector(14, 2), new Vector(22, 1), new Vector(28, 4), new Vector(29, 17), new Vector(38, 25), new Vector(40, 31), new Vector(45, 49), new Vector(45, 59), new Vector(44, 65), new Vector(45, 75), new Vector(48, 85), new Vector(51, 90), new Vector(64, 90), new Vector(79, 100), new Vector(77, 106), new Vector(74, 101), new Vector(74, 97), new Vector(66, 97), new Vector(63, 100), new Vector(63, 104), new Vector(48, 113), new Vector(43, 101), new Vector(37, 108), new Vector(39, 146), new Vector(33, 150), new Vector(26, 118), new Vector(27, 135), new Vector(11, 150), new Vector(13, 106), new Vector(3, 102), new Vector(2, 73), new Vector(2, 50), new Vector(4, 33), new Vector(7, 24), new Vector(15, 20)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7475/26223204823_1819b5dd4c_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barrier.flags = ["No Rotation", "No Y Acceleration"], barriersList.push(barrier), barrierWidth = 150, barrierHeight = 57, barrierBoundingPoints = [new Vector(5, 16), new Vector(11, 18), new Vector(17, 8), new Vector(25, 6), new Vector(30, 5), new Vector(62, 0), new Vector(71, 4), new Vector(62, 10), new Vector(36, 15), new Vector(81, 27), new Vector(145, 42), new Vector(144, 49), new Vector(104, 45), new Vector(100, 48), new Vector(84, 41), new Vector(55, 44), new Vector(36, 36), new Vector(31, 38), new Vector(46, 53), new Vector(40, 55), new Vector(20, 45), new Vector(10, 43), new Vector(9, 33), new Vector(2, 25), new Vector(2, 16)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7107/26793431736_89134c3ee6_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barrier.flags = ["No Rotation", "No Y Acceleration"], barriersList.push(barrier), barrierWidth = 70, barrierHeight = 32, barrierBoundingPoints = [new Vector(8, 0), new Vector(25, 6), new Vector(40, 2), new Vector(54, 10), new Vector(58, 18), new Vector(69, 23), new Vector(67, 29), new Vector(45, 29), new Vector(16, 19), new Vector(2, 12), new Vector(1, 3)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7036/26555058920_96923d71b1_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 40, barrierHeight = 149, barrierBoundingPoints = [new Vector(26, 3), new Vector(31, 56), new Vector(37, 64), new Vector(38, 145), new Vector(2, 145), new Vector(2, 67), new Vector(9, 55), new Vector(13, 0)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7100/26793431636_6148f8e47a_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 100, barrierHeight = 100, barrierBoundingPoints = [new Vector(50, 12), new Vector(65, 13), new Vector(83, 29), new Vector(89, 54), new Vector(80, 71), new Vector(65, 83), new Vector(51, 88), new Vector(33, 83), new Vector(18, 72), new Vector(11, 52), new Vector(17, 32), new Vector(31, 18)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7472/26223204563_7d83da38ae_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 135, barrierHeight = 87, barrierBoundingPoints = [new Vector(33, 24), new Vector(59, 9), new Vector(74, 2), new Vector(134, 47), new Vector(128, 65), new Vector(102, 82), new Vector(70, 82), new Vector(56, 87), new Vector(32, 72), new Vector(9, 69), new Vector(1, 60), new Vector(17, 44), new Vector(20, 35), new Vector(27, 35)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7344/26793432086_2ecd2bb3bd_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier), barrierWidth = 135, barrierHeight = 87, barrierBoundingPoints = [new Vector(33, 24), new Vector(59, 9), new Vector(74, 2), new Vector(134, 47), new Vector(128, 65), new Vector(102, 82), new Vector(70, 82), new Vector(56, 87), new Vector(32, 72), new Vector(9, 69), new Vector(1, 60), new Vector(17, 44), new Vector(20, 35), new Vector(27, 35)];
for (var i = 0; i < barrierBoundingPoints.length; i++) barrierBoundingPoints[i].translate(barriersStartingTopLeftPos.x, 0);
barrierBoundingBox = new Box(barriersStartingTopLeftPos, barrierWidth, barrierHeight), barrierBounding = new Polygon(barrierBoundingPoints, barriersStartingTopLeftPos, barrierBoundingBox), barrierFrames = ["https://farm8.staticflickr.com/7344/26793432086_2ecd2bb3bd_o.png"], barrier = new ImageObject(barriersStartingTopLeftPos.x, barriersStartingTopLeftPos.y, barrierWidth, barrierHeight, barrierBounding), barrier.flags = [];
for (var i = 0; i < barrierFrames.length; i++) barrier.addImageFrame(barrierFrames[i]);
barriersList.push(barrier);
var gameRunCount = 0;
InputClass.listen();
var isStop = !0,
    mouseX, mouseY, gameSkyWidth = 1257,
    gameSkyHeight = 400,
    backSkyPosX = gameSkyWidth - 27,
    gameSkys = [new ImageObject(0, 0, gameSkyWidth, gameSkyHeight), new ImageObject(backSkyPosX, 0, gameSkyWidth, gameSkyHeight)],
    frontSky = gameSkys[0],
    backSky = gameSkys[1];
frontSky.addImageFrame("https://farm8.staticflickr.com/7335/26222395434_cc56e0f39d_o.jpg"), backSky.addImageFrame("https://farm8.staticflickr.com/7335/26222395434_cc56e0f39d_o.jpg");
for (var spriteWidth = 220, spriteHeight = 80, spriteTopLeftPos = new Vector(.05 * GraphicsContext.width(), 0), spriteCenterY, spriteCenterX, spriteAngle = 0, spriteAy = 0, spriteAyCoef = 3.3, spriteBoundingPoints = [new Vector(91, 11), new Vector(119, 8), new Vector(133, 21), new Vector(172, 21), new Vector(204, 22), new Vector(221, 27), new Vector(236, 39), new Vector(223, 51), new Vector(207, 58), new Vector(168, 59), new Vector(134, 59), new Vector(120, 71), new Vector(91, 69), new Vector(107, 57), new Vector(105, 24)], spriteBoundingBox = new Box(spriteTopLeftPos, spriteWidth, spriteHeight), spriteBounding = new Polygon(spriteBoundingPoints, spriteTopLeftPos, spriteBoundingBox), gameSprite = new ImageObject(spriteTopLeftPos.x, spriteTopLeftPos.y, spriteWidth, spriteHeight, spriteBounding), spriteFrames = ["https://farm8.staticflickr.com/7283/26793419686_c3a4739e92_o.png", "https://farm8.staticflickr.com/7435/26734072542_6a893f327c_o.png", "https://farm8.staticflickr.com/7672/26734072482_ab7ce58450_o.png", "https://farm8.staticflickr.com/7128/26793419486_e3f075d25d_o.png", "https://farm8.staticflickr.com/7672/26734072482_ab7ce58450_o.png", "https://farm8.staticflickr.com/7435/26734072542_6a893f327c_o.png", "https://farm8.staticflickr.com/7283/26793419686_c3a4739e92_o.png"], i = 0; i < spriteFrames.length; i++) gameSprite.addImageFrame(spriteFrames[i]);
var g_GameObjectAx = -1,
    g_GameObjectAxDelta = 1e-5,
    gameRecord = 0,
    gameRecordCoef = .8,
    highestGameRecord = 0,
    gameTime = 0,
    barriersVisible = [],
    EngineMain = { restart: function() { isStop = !0, InputClass.resetClicks(), g_GameObjectAx = -1, g_GameObjectAxDelta = 1e-5, gameRecord > highestGameRecord && (highestGameRecord = gameRecord), gameRecord = 0, gameRecordCoef = .5, gameTime = 0;
            for (var r = 0; r < barriersVisible.length; r++) barriersVisible[r].resetFlagAndPos(GraphicsContext.width(), 0);
            barriersVisible = [], Timer.stop(), BarrierGenerator.reset() } },
    MainGameLoop = setInterval(function() {
        if (0 != InputClass.clickCount && (isStop = !1), GraphicsContext.clearCanvas(), mouseX = InputClass.mouseX, mouseY = InputClass.mouseY, spriteCenterY = gameSprite.getCenterY(), spriteCenterX = gameSprite.getCenterX(), mouseY != spriteCenterY && (spriteAy = (mouseY - spriteCenterY) * spriteAyCoef / GraphicsContext.height()), spriteAy += g_GameObjectAxDelta, spriteAngle = Math.atan((mouseY - spriteCenterY) / (mouseX - spriteCenterX)) * (180 / Math.PI) * .025, gameSprite.update(spriteAngle, 0, spriteAy), gameSprite.draw(), GraphicsContext.setGlobalComposition("destination-over"), frontSky.update(0, g_GameObjectAx, 0), frontSky.draw(), backSky.update(0, g_GameObjectAx, 0), backSky.draw(), backSky.x <= 0) {
            var r = frontSky;
            frontSky = backSky, backSky = r, backSky.x = backSkyPosX }
        if (GraphicsContext.setGlobalComposition("source-over"), isStop) 0 === gameRunCount ? UIClass.showPauseScene() : UIClass.showRestartScene(highestGameRecord);
        else if (BarrierLoading.isDone() && ImageLoading.isDone()) { Timer.isRunning() || (Timer.start(), gameRunCount++), gameTime = Timer.totalTime(), gameRecord = parseInt(gameTime * gameRecordCoef), g_GameObjectAx -= g_GameObjectAxDelta, BarrierGenerator.setLevel(gameRecord);
            var e = BarrierGenerator.getThisBarrier(gameTime, g_GameObjectAx);
            null !== e && barriersVisible.push(e);
            for (var t = 0; t < barriersVisible.length; t++) barriersVisible[t].x + barriersVisible[t].width < 0 && (barriersVisible[t].resetFlagAndPos(GraphicsContext.width(), 0), barriersVisible.splice(t, 1)), barriersVisible[t].r += barriersVisible[t].dr, barriersVisible[t].update(barriersVisible[t].r, barriersVisible[t].ax, barriersVisible[t].ay), barriersVisible[t].draw(), barriersVisible[t].x <= gameSprite.x + gameSprite.width && colliDetect.detect(gameSprite.bounding, barriersVisible[t].bounding) && EngineMain.restart();
            UIClass.showGameRecord(gameRecord, highestGameRecord) } else UIClass.showLoadingScene() }, 1);

