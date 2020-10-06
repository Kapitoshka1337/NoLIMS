//const { type } = require("jquery");

/**
 * convert.js
 * @copyright 2017, Mirko Ferraro <mirkoferraro@gmail.com>
 * @link https://github.com/mirkoferraro/convert.js
 * @license MIT
 * @version 1.0.6
 */
(function (root, factory) {

    // AMD
    if (typeof define === "function" && define.amd) {
        define(["exports"], function (exports) {
            return factory(exports);
        });
    }

    // CommonJS
    else if (typeof exports !== "undefined") {
        factory(exports);
    }

    // Browser
    else {
        factory(root);
    }

}(this, function (exports) {

    function ConvertTable() {

        var
            conversion_table = {},
            regexps = {}

        regexp = new RegExp('(\\d+)?(.+)?')

        function get(name) {
            if (typeof conversion_table[name] === 'undefined') {
                throw new Error('ConvertTable: invalid name ' + name)
            }

            return conversion_table[name];
        }

        function set(name, conversion) {
            if (typeof conversion !== 'object' || typeof conversion.match !== 'string') {
                throw new Error('ConvertTable: invalid conversion object')
            }

            conversion_table[name] = conversion;
        }

        function match(str) {
            var
                match,
                data = {}

            for (var name in conversion_table) {

                if (typeof regexps[name] === 'undefined') {
                    regexps[name] = new RegExp('(\\d+)?(' + conversion_table[name].match + ')?')
                }

                match = regexps[name].exec(str)

                if (match[1]) {
                    data.value = parseFloat(match[1])
                }

                if (match[2]) {
                    data.measure = name
                    data.conversion = get(name)
                    return data
                }

            }

            return data

        }

        function convert(from_value, param, from_measure, to_measure) {

            var
                conversion = get(from_measure),
                func = conversion[to_measure]

            if (typeof func !== 'function') {
                throw new Error('ConvertTable: invalid conversion function [from ' + from_measure + ' to ' + to_measure + ']')
            }

            return func(from_value, param)
        }

        return {
            get: get,
            set: set,
            match: match,
            convert: convert
        }
    }

    function Convert() {

        var
            _args = Array.prototype.slice.call(arguments),
            _value = 0,
            _measure = null,
            _param = null

        function _construct() {

            if (_args.length) {

                var match = table.match(_args[0])

                _value = _args[0]
                //if (match.value) {
                //    _value = match.value
                //}
                if (match.measure) {
                    _measure = match.measure
                }

            }

        }

        function value(num) {

            if (typeof num === 'undefined') {
                return _value
            }

            if (typeof num !== 'number') {
                throw new Error('Convert: argument passed to function "value" is not a number')
            }

            _value = num
            return this

        }

        function measure(str) {
            if (typeof str === 'undefined') {
                return _measure
            }
            
            if (typeof str !== 'string') {
                throw new TypeError('Convert: argument passed to function "measure" is not a string')
            }

            var match = table.match(str)

            if (!match.measure) {
                throw new Error('Convert: argument passed to function "measure" is not a valid measure string')
            }

            _measure = match.measure
            return this
        }

        function param(str){
            if(typeof str === 'undefined')
                return _param
            
            if(typeof str !== 'number')
                throw new TypeError('Convert: argument passed to function "measure" is not a number')
            
            _param = str
            return this
        }

        function to(str) {

            if (typeof str !== 'string') {
                throw new TypeError('Convert: argument must be a string')
            }

            var match = table.match(str)

            if (!match.measure) {
                throw new Error('Convert: conversion ' + str + ' wasn\' matched in conversion table')
            }

            return table.convert(_value, _param, _measure, match.measure)

        }

        _construct()

        return {
            value: value,
            measure: measure,
            to: to,
            param: param
        }
    }

    var table = new ConvertTable()

    table.set('kg', {
        match: 'kg',
        kub: function(val, par) {
            return parseFloat(((val / par) * 1000).toFixed(4))
        },
        g: function(val){
            return parseFloat((val * 1000).toFixed(4))
        },
        kg: function(val){
            return val
        }
    })

    table.set('kub', {
        match: 'kub',
        kg: function(val, par) {
            return parseFloat(((val * par) / 1000).toFixed(4))
        },
        dm: function(val){
            return val / 1000
        },
        litr: function(val){
            return val / 1000
        },
        kub: function(val){
            return val
        }
    })
    
    table.set('g', {
        match: 'g',
        kg: function(val) {
            return val / 1000
        },
        g: function(val) {
            return val
        },
        flacon: function(val, par) {
            return val / par
        },
        ampule: function(val, par) {
            return val / par
        }
    })

    table.set('dm', {
        match: 'dm',
        kub: function(val) {
            return val * 1000
        }
    })

    table.set('package', {
        match: 'package',
        piece: function(val, par) {
            return val * par
        },
        ampule: function(val, par) {
            return val * par
        },
        package: function(val) {
            return val
        }
    })

    table.set('piece', {
        match: 'piece',
        package: function(val, par) {
            return val / par
        },
        piece: function(val){
            return val
        },
        kit: function(val, par){
            return val / par
        }
    })

    table.set('kit', {
        match: 'kit',
        piece: function(val, par) {
            return Math.round(val * par)
        },
        kit: function(val) {
            return val
        },
        ampule: function(val, par) {
            return val * par
        },
        flacon: function(val, par) {
            return Math.round(val * par)
        }
    })

    table.set('dose', {
        match: 'dose',
        dose: function(val) {
            return val
        },
        litr: function(val) {
            return val / 1000
        }
    })

    table.set('litr', {
        match: 'litr',
        kub: function(val) {
            return val * 1000
        },
        dose: function(val) {
            return val * 1000
        },
        litr: function(val) {
            return val
        }
    })

    table.set('ampule', {
        match: 'ampule',
        kit: function(val, par) {
            return val / par
        },
        package: function(val, par) {
            return val / par
        },
        g: function(val, par) {
            return val * par
        },
        ampule: function(val) {
            return val
        }
    })

    table.set('flacon', {
        match: 'flacon',
        kit: function(val, par) {
            return val / par
        },
        g: function(val, par) {
            return val * par
        },
        flacon: function(val) {
            return val
        }
    })

    table.set('ballon', {
        match: 'ballon',
        ballon: function(val) {
            return val
        }
    })

    function createConvert(arg) {
        if ('table' == arg) {
            return table;
        }
        return new Convert(arg)
    }

    exports.convert = createConvert;
    return createConvert;
}));