"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrUtil = require("str-util");
const num_normalize_1 = require("num-normalize");
const cjk_conv_1 = require("cjk-conv");
function normalize_strip(str, isDir) {
    if (isDir) {
        if (/^p?\d{4,}[\s_](.+)(_\(\d+\))$/.exec(str)) {
            str = RegExp.$1;
        }
        else if (/^p?\d{4,}[\s_](.+)(_\(\d+\))?$/.exec(str)) {
            str = RegExp.$1;
        }
    }
    else {
        if (/^\d+_(.+)\.\d+$/.exec(str)) {
            str = RegExp.$1;
        }
        else if (/^c?\d{4,}_(.+)$/.exec(str)) {
            str = RegExp.$1;
        }
    }
    str = StrUtil.trim(str, '　');
    return str;
}
exports.normalize_strip = normalize_strip;
function normalize_val(str, padNum = 5, options = {}) {
    padNum = padNum || options.padNum;
    str = cjk_conv_1.novelFilename.filename(str);
    if (/^(?:序|プロローグ|Prologue)/i.test(str)) {
        str = '0_' + str;
    }
    str = str.replace(/^(web)版(\d+)/i, '$1$2');
    str = StrUtil.toHalfWidth(str)
        .toLowerCase();
    str = StrUtil.trim(str, '　');
    str = StrUtil.zh2num(str).toString();
    str = StrUtil.zh2num(str, {
        truncateOne: 2,
        flags: 'ug',
    }).toString();
    str = num_normalize_1.default(str, {
        all: true,
        roman: options.checkRoman,
    });
    str = str.replace(/\d+/g, function ($0) {
        return $0.padStart(padNum, '0');
    });
    str = str
        .replace(/^第+/, '')
        .replace(/[―—－──\-―—─＝=]/g, '_')
        .replace(/[\s　]/g, '_')
        .replace(/[\(\)〔［【《（「『』」》）】〕］]/g, '_')
        .replace(/[·‧・···•]/g, '_')
        .replace(/[：：︰﹕：]/ug, '_')
        .replace(/[・:,]/g, '_')
        .replace(/_+$/g, '')
        .replace(/_+/g, '_');
    str = cjk_conv_1.zh2jp(cjk_conv_1.cn2tw(str), {
        safe: false,
    });
    return str;
}
exports.normalize_val = normalize_val;
const self = require("./index");
exports.default = self;
