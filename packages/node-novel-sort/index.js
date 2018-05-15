"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naturalCompare = require("string-natural-compare");
exports.naturalCompare = naturalCompare;
function createSortCallback(options = {}) {
    const r = options.dotNum ? /^(\d+(?:\.\d+)?)/ : /^(\d+)/;
    const failbackSort = options.failbackSort || naturalCompare;
    const trigger = options.trigger || _match;
    const transpile = options.transpile || _trim;
    return function defaultSortCallback(a, b, isSub) {
        if (a === b) {
            return 0;
        }
        let ret = trigger(transpile(a, isSub), transpile(b, isSub), {
            r,
            mainFn: defaultSortCallback,
            isSub,
        });
        return (typeof ret == 'number') ? ret : failbackSort(a, b);
    };
}
exports.createSortCallback = createSortCallback;
exports.defaultSortCallback = createSortCallback({
    dotNum: true,
});
exports.default = exports.defaultSortCallback;
function _match(a, b, { r, mainFn, isSub, }) {
    let ta;
    let tb;
    if ((ta = r.exec(a)) && (tb = r.exec(b))) {
        let r = parseInt(ta[0]) - parseInt(tb[0]);
        if (r !== 0) {
            return r;
        }
        let a1 = ta.input.slice(ta[0].length);
        let b1 = tb.input.slice(tb[0].length);
        if (a1 != b1) {
            let i = 0;
            while (typeof a1[i] != 'undefined' && a1[i] == b1[i] && (!/^\d$/.test(b1[0]))) {
                i++;
            }
            a1 = a1.slice(i);
            b1 = b1.slice(i);
        }
        return mainFn(a1, b1, true);
    }
}
exports._match = _match;
function _trim(input) {
    return input
        .replace(/^[_\s]+(\d+)/, '$1')
        .replace(/^\D(\d+)/, '$1')
        .trim();
}
exports._trim = _trim;
