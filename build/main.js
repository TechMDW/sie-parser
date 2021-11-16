"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fs_1 = require("fs");
var sieParser = /** @class */ (function () {
    function sieParser(path) {
        var buffer = (0, fs_1.readFileSync)("" + path);
        var parsed = this.string(buffer);
        this.sie = this.sieLines(parsed);
        this.sieObject = this.parse();
    }
    sieParser.prototype.string = function (buffer) {
        // Thanks @piksel for this function ;)
        var mapUTF8 = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
        return Array.from(buffer)
            .map(function (b) {
            return b < 128 ? String.fromCharCode(b) : mapUTF8.substr(b - 128, 1);
        })
            .join('');
    };
    sieParser.prototype.sieLineParser = function (str) {
        var result = [];
        var current = '';
        var inQuotes = false;
        var inBrackets = false;
        for (var i = 0; i < str.length; i++) {
            if (str[i] === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            if (str[i] === ' ' && !inQuotes && !inBrackets) {
                result.push(current);
                current = '';
            }
            else {
                current += str[i];
            }
        }
        result.push(current);
        return result;
    };
    sieParser.prototype.sieLines = function (str) {
        return str.split('\n');
    };
    sieParser.prototype.parse = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var sie = { VER: {} };
        var inBrackets = false;
        var currentBracketName = '';
        for (var i = 0; i < this.sie.length; i++) {
            var e = this.sie[i];
            var values = this.sieLineParser(e.trim());
            var indexProp = values[0].replace('#', '');
            if (e[0] === '{') {
                inBrackets = true;
                continue;
            }
            if (e[0] === '}') {
                inBrackets = false;
                continue;
            }
            if (indexProp === 'VER') {
                var objectName = values[1] + values[2];
                currentBracketName = objectName;
                sie.VER[objectName] = {
                    serie: values[1],
                    vernr: values[2],
                    verdatum: values[3],
                    vertext: values[4],
                    regdatum: values[5],
                    sign: values[6],
                    TRANS: [],
                    RTRANS: [],
                    BTRANS: [],
                };
                continue;
            }
            if (inBrackets && indexProp === 'TRANS') {
                sie.VER[currentBracketName].TRANS.push({
                    kontonr: values[1],
                    object: values[2],
                    belop: values[3],
                    transdat: values[4],
                    kvantitet: values[5],
                    sign: values[6],
                });
                continue;
            }
            if (inBrackets && indexProp === 'RTRANS') {
                sie.VER[currentBracketName].RTRANS.push({
                    kontonr: values[1],
                    object: values[2],
                    belop: values[3],
                    transdat: values[4],
                    kvantitet: values[5],
                    sign: values[6],
                });
                continue;
            }
            switch (indexProp) {
                case 'ADRESS':
                    sie.ADRESS = {
                        kontakt: values[1],
                        postadr: values[2],
                        tel: values[3],
                        utdelningsadr: values[4],
                    };
                    break;
                case 'BKOD':
                    sie.BKOD = values[1];
                    break;
                case 'DIM':
                    if (!sie.DIM)
                        sie.DIM = [];
                    (_a = sie.DIM) === null || _a === void 0 ? void 0 : _a.push({
                        dimensionsnr: values[1],
                        namn: values[2],
                    });
                    break;
                case 'ENHET':
                    sie.ENHET = {
                        kontonr: values[1],
                        enhet: values[2],
                    };
                    break;
                case 'FLAGGA':
                    sie.FLAGGA = values[1];
                    break;
                case 'FNAMN':
                    sie.FNAM = values[1];
                    break;
                case 'FNR':
                    sie.FNR = values[1];
                    break;
                case 'FORMAT':
                    sie.FORMAT = values[1];
                    break;
                case 'FTYP':
                    sie.FTYP = values[1];
                    break;
                case 'GEN':
                    sie.GEN = {
                        datum: values[1],
                        sign: values[2],
                    };
                    break;
                case 'IB':
                    if (!sie.IB)
                        sie.IB = [];
                    (_b = sie.IB) === null || _b === void 0 ? void 0 : _b.push({
                        årsnr: values[1],
                        konto: values[2],
                        saldo: values[3],
                        kvantitet: values[4],
                    });
                    break;
                case 'KONTO':
                    if (!sie.KONTO)
                        sie.KONTO = [];
                    (_c = sie.KONTO) === null || _c === void 0 ? void 0 : _c.push({
                        kontonr: values[1],
                        kontonamn: values[2],
                    });
                    break;
                case 'KPTYP':
                    sie.KPTYP = values[1];
                    break;
                case 'KTYP':
                    sie.KTYP = {
                        kontonr: values[1],
                        kontotyp: values[2],
                    };
                    break;
                case 'OBJECT':
                    (_d = sie.OBJECT) === null || _d === void 0 ? void 0 : _d.push({
                        dimensionsnr: values[1],
                        objektnr: values[2],
                        objektnamn: values[3],
                    });
                    break;
                case 'OIB':
                    {
                        // TODO: Test this function with real SIE files
                        var _h = values[3]
                            .replace('"', ' ')
                            .trim()
                            .split(' '), dimensionsnr = _h[0], objektnr = _h[1];
                        sie.OIB = {
                            årsnr: values[1],
                            konto: values[2],
                            objectspecifikation: { dimensionsnr: dimensionsnr, objektnr: objektnr },
                            saldo: values[4],
                            kvantitet: values[5],
                        };
                    }
                    break;
                case 'OMFATTN':
                    sie.OMFATTN = values[1];
                    break;
                case 'ORGNR':
                    sie.ORGNR = {
                        orgnr: values[1],
                        förvnr: values[2],
                        verknr: values[3],
                    };
                    break;
                case 'OUB':
                    {
                        // TODO: Test this function with real SIE files
                        var _j = values[3]
                            .replace('"', ' ')
                            .trim()
                            .split(' '), dimensionsnr = _j[0], objektnr = _j[1];
                        sie.OUB = {
                            årsnr: values[1],
                            konto: values[2],
                            objectspecifikation: { dimensionsnr: dimensionsnr, objektnr: objektnr },
                            saldo: values[4],
                            kvantitet: values[5],
                        };
                    }
                    break;
                case 'PBUDGET':
                    {
                        // TODO: Test this function wsith real SIE files
                        if (!sie.PBUDGET)
                            sie.PBUDGET = [];
                        var _k = values[4]
                            .replace('"', ' ')
                            .trim()
                            .split(' '), dimensionsnr = _k[0], objektnr = _k[1];
                        sie.PBUDGET.push({
                            årsnr: values[1],
                            period: values[2],
                            konto: values[3],
                            objectspecifikation: { dimensionsnr: dimensionsnr, objektnr: objektnr },
                            saldo: values[5],
                            kvantitet: values[6],
                        });
                    }
                    break;
                case 'PROGRAM':
                    sie.PROGRAM = {
                        programnamn: values[1],
                        verision: values[2],
                    };
                    break;
                case 'PROSA':
                    sie.PROSA = values[1];
                    break;
                case 'PSALDO':
                    {
                        if (!sie.PSALDO)
                            sie.PSALDO = [];
                        var _l = values[4]
                            .replace('"', ' ')
                            .trim()
                            .split(' '), dimensionsnr = _l[0], objektnr = _l[1];
                        sie.PSALDO.push({
                            årsnr: values[1],
                            period: values[2],
                            konto: values[3],
                            objectspecifikation: {
                                dimensionsnr: dimensionsnr !== '{}' ? dimensionsnr : undefined,
                                objektnr: objektnr,
                            },
                            saldo: values[5],
                            kvantitet: values[6],
                        });
                    }
                    break;
                case 'RAR':
                    if (!sie.RAR)
                        sie.RAR = [];
                    (_e = sie.RAR) === null || _e === void 0 ? void 0 : _e.push({
                        årsnr: values[1],
                        start: values[2],
                        slut: values[3],
                    });
                    break;
                case 'RES':
                    if (!sie.RES)
                        sie.RES = [];
                    (_f = sie.RES) === null || _f === void 0 ? void 0 : _f.push({
                        års: values[1],
                        konto: values[2],
                        saldo: values[3],
                        kvantitet: values[4],
                    });
                    break;
                case 'SIETYP':
                    sie.SIETYP = values[1];
                    break;
                case 'SRU':
                    if (!sie.SRU)
                        sie.SRU = [];
                    (_g = sie.SRU) === null || _g === void 0 ? void 0 : _g.push({
                        konto: values[1],
                        'SRU-kod': values[2],
                    });
                    break;
                case 'TAXAR':
                    sie.TAXAR = values[1];
                    break;
                case 'UB':
                    if (!sie.UB)
                        sie.UB = [];
                    sie.UB.push({
                        årsnr: values[1],
                        konto: values[2],
                        saldo: values[3],
                        kvantitet: values[4],
                    });
                    break;
                case 'UNDERDIM':
                    if (!sie.UNDERDIM)
                        sie.UNDERDIM = [];
                    sie.UNDERDIM.push({
                        dimensionsnr: values[1],
                        namn: values[2],
                        superdimension: values[3],
                    });
                    break;
                case 'VALUTA':
                    sie.VALUTA = values[1];
                    break;
                default:
                    break;
            }
        }
        return sie;
    };
    sieParser.prototype.getVerifications = function () {
        var element = this.sieObject.VER;
        return Object.keys(element);
    };
    sieParser.prototype.getVerificationData = function (verification) {
        var element = this.sieObject.VER[verification];
        return element;
    };
    sieParser.prototype.getSeries = function (series) {
        var _this = this;
        var element = Object.keys(this.sieObject.VER).map(function (key) {
            var e = _this.sieObject.VER[key];
            if (e.serie === series.toUpperCase())
                return e;
        });
        var filteredElement = element.filter(function (e) { return e !== undefined; });
        if (filteredElement.length === 0)
            return undefined;
        return filteredElement;
    };
    sieParser.prototype.getSerieDateRange = function (dateStart, dateEnd, opt) {
        var _this = this;
        if (dateStart.toString().length !== 8)
            throw Error('Invalid dateStart length');
        if (dateEnd.toString().length !== 8)
            throw Error('Invalid dateStart length');
        var element = Object.keys(this.sieObject.VER).map(function (key) {
            var e = _this.sieObject.VER[key];
            var time = !(opt === null || opt === void 0 ? void 0 : opt.timeType) || opt.timeType !== 'regdatum'
                ? Number(e.verdatum)
                : Number(e.regdatum);
            if (!time)
                return undefined;
            if (time <= dateEnd && time >= dateStart) {
                if (opt === null || opt === void 0 ? void 0 : opt.serie) {
                    if (e.serie === opt.serie.toUpperCase()) {
                        return e;
                    }
                    return undefined;
                }
                return e;
            }
        });
        var filteredElement = element.filter(function (e) { return e !== undefined; });
        if (filteredElement.length === 0)
            return undefined;
        return filteredElement;
    };
    sieParser.prototype.getAccount = function (kontonr, opts) {
        var _a, _b, _c, _d;
        if (!kontonr) {
            var element = this.sieObject.KONTO;
            return element;
        }
        var returnObj = {};
        kontonr = kontonr.toString();
        var kontoDesc = (_a = this.sieObject.KONTO) === null || _a === void 0 ? void 0 : _a.find(function (e) { return e.kontonr === kontonr; });
        if (!kontoDesc)
            return undefined;
        if ((opts === null || opts === void 0 ? void 0 : opts.konto) !== false) {
            returnObj = __assign({}, kontoDesc);
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.ib) !== false) {
            returnObj.IB = (_b = this.sieObject.IB) === null || _b === void 0 ? void 0 : _b.filter(function (e) { return e.konto === kontonr; });
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.ub) !== false) {
            returnObj.UB = (_c = this.sieObject.UB) === null || _c === void 0 ? void 0 : _c.filter(function (e) { return e.konto === kontonr; });
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.psaldo) !== false) {
            returnObj.PSALDO = (_d = this.sieObject.PSALDO) === null || _d === void 0 ? void 0 : _d.filter(function (e) { return e.konto === kontonr; });
        }
        return returnObj;
    };
    return sieParser;
}());
module.exports = sieParser;
