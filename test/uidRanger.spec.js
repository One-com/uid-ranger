/*global describe, it, beforeEach*/
var uidRanger = require('..');
var expect = require('unexpected');

describe('uidRanger', function () {
    describe('parseRange', function () {
        describe('on an invalid UID range', function () {
            [{
                input: '-1,5696,5704,5712',
                error: 'Invalid UID range segment: -1. ' +
                    'A range segment must be an UID or a UID ' +
                    'range separated by a colon.'
            }, {
                input: '5712,5719:5717',
                error: 'UID range segment 5719:5717 is invalid. ' +
                    'from:to has to fulfill from < to.'
            }, {
                input: '5712,5719;5717',
                error: 'Invalid UID range segment: 5719;5717. ' +
                    'A range segment must be an UID or a UID ' +
                    'range separated by a colon.'
            }, {
                input: 'foo,5719:5717',
                error: 'Invalid UID range segment: foo. ' +
                    'A range segment must be an UID or a UID ' +
                    'range separated by a colon.'
            }, {
                input: '5717,5717',
                error: 'Invalid UID range segment: 5717. ' +
                    'The UID segments must be sorted in increasing order: 5717 >= 5717.'
            }, {
                input: '5719,5717',
                error: 'Invalid UID range segment: 5717. ' +
                    'The UID segments must be sorted in increasing order: 5719 >= 5717.'
            }, {
                input: '5719,5717:5729',
                error: 'Invalid UID range segment: 5717:5729. ' +
                    'The UID segments must be sorted in increasing order: 5719 >= 5717.'
            }].forEach(function (example) {
                it('parsing "' + example.input + '" throws: ' + example.error, function () {
                    expect(function () {
                        uidRanger.parse(example.input);
                    }, 'to throw', example.error);
                });
            });
        });

        [{
            input: '5694,5696,5704,5712',
            output: [5694, 5696, 5704, 5712]
        }, {
            input: '5694,5696,5704,5712,5715:5717',
            output: [5694, 5696, 5704, 5712, 5715, 5716, 5717]
        }, {
            input: '5694:5696,5704,5712,5715:5717',
            output: [5694, 5695, 5696, 5704, 5712, 5715, 5716, 5717]
        }].forEach(function (example) {
            describe('with uid range: ' + example.input, function () {
                var uidRange;
                beforeEach(function () {
                    uidRange = uidRanger.parse(example.input);
                });

                it('parse returns ' + example.output, function () {
                    expect(uidRange.toArray(), 'to equal', example.output);
                });

                it('length returns ' + example.output.length, function () {
                    expect(uidRange.length(), 'to equal', example.output.length);
                });

                it('get(-1) returns null', function () {
                    expect(uidRange.get(-1), 'to equal', null);
                });

                example.output.forEach(function (uid, index) {
                    it('get(' + index + ') returns ' + uid, function () {
                        expect(uidRange.get(index), 'to equal', uid);
                    });
                });

                it('get(' + example.output.length + ') returns null', function () {
                    expect(uidRange.get(example.output.length), 'to equal', null);
                });
            });
        });

    });
});
