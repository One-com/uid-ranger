(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.one = root.one || {};
        root.one.uidRanger = factory();
    }
}(this, function () {
    function IntegerRange(from, to) {
        this.from = from;
        this.to = to;
    }

    IntegerRange.prototype.length = function () {
        return this.to - this.from + 1;
    };

    IntegerRange.prototype.toString = function () {
        return this.from + ':' + this.to;
    };

    IntegerRange.prototype.validate = function () {
        if (this.to <= this.from) {
            throw new Error('UID range segment ' + this.toString() + ' is invalid. ' +
                           'from:to has to fulfill from < to.');
        }
    };

    function UidRange() {
        this.segments = [];
    }

    UidRange.prototype.add = function (segment) {
        var nextSegmentStart;
        if (typeof segment === 'number') {
            nextSegmentStart = segment;
        }

        if (segment instanceof IntegerRange) {
            segment.validate();
            nextSegmentStart = segment.from;
        }

        var lastSegment = this.segments[this.segments.length - 1];
        if (lastSegment) {
            var lastSegmentEnd = lastSegment instanceof IntegerRange ?
                lastSegment.to : lastSegment;

            if (nextSegmentStart <= lastSegmentEnd) {
                throw new Error('Invalid UID range segment: ' + String(segment) + '. ' +
                    'The UID segments must be sorted in increasing order: ' + lastSegment + ' >= ' + nextSegmentStart + '.');
            }

        }

        this.segments.push(segment);
    };

    UidRange.prototype.toArray = function () {
        var result = [];
        this.segments.forEach(function (segment) {
            if (segment instanceof IntegerRange) {
                for (var i = segment.from; i <= segment.to; i += 1) {
                    result.push(i);
                }
            } else {
                result.push(segment);
            }
        });

        return result;
    };

    UidRange.prototype.get = function (index) {
        if (index < 0) {
            return null;
        }

        var i = 0;
        var uid = null;
        this.segments.some(function (segment) {
            if (segment instanceof IntegerRange) {
                if (index < i + segment.length()) {
                    uid = segment.from + index - i;
                    return true;
                }

                i += segment.length();
            } else {
                if (i === index) {
                    uid = segment;
                    return true;
                }

                i += 1;
            }

            return false;
        });
        return uid;
    };

    UidRange.prototype.toString = function () {
        return this.segments.map(function (segment) {
            return String(segment);
        }).join(',');
    };

    UidRange.prototype.length = function () {
        var length = 0;
        this.segments.forEach(function (segment) {
            if (segment instanceof IntegerRange) {
                length += segment.length();
            } else {
                length += 1;
            }
        });

        return length;
    };

    var delimiterRegexp = /\s*,\s*/;
    var integerRangeRegexp = /^(\d+):(\d+)$/;
    var integerRegexp = /^(\d+)$/;
    var uidRanger = {
        parse: function (rangeString) {
            var uidRange = new UidRange();
            (rangeString || '').split(delimiterRegexp).forEach(function (rangeSegment) {
                var m;
                if ((m = integerRegexp.exec(rangeSegment))) {
                    uidRange.add(parseInt(m[1], 10));
                } else if ((m = integerRangeRegexp.exec(rangeSegment))) {
                    uidRange.add(new IntegerRange(parseInt(m[1], 10), parseInt(m[2], 10)));
                } else {
                    throw new Error('Invalid UID range segment: ' + rangeSegment +
                                    '. A range segment must be an UID or a UID ' +
                                    'range separated by a colon.');
                }
            });

            return uidRange;
        }
    };

    return uidRanger;
}));
