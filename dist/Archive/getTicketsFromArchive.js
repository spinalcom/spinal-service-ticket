"use strict";
/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsFromArchiveGen = exports.getTicketsFromArchive = void 0;
const moment = require("moment");
const _getAchivePartsFromArchive_1 = require("./_getAchivePartsFromArchive");
const _getArchive_1 = require("./_getArchive");
const Constants_1 = require("../Constants");
function getTicketsFromArchive(processOrSpatialNode, begin, end) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const res = [];
        try {
            for (var _d = true, _e = __asyncValues(getTicketsFromArchiveGen(processOrSpatialNode, begin, end)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const ticket = _c;
                    res.push(ticket);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    });
}
exports.getTicketsFromArchive = getTicketsFromArchive;
function getTicketsFromArchiveGen(processOrSpatialNode, begin, end) {
    var _a, _b;
    return __asyncGenerator(this, arguments, function* getTicketsFromArchiveGen_1() {
        const tsBegin = moment(begin).valueOf();
        const tsEnd = moment(end).valueOf();
        const isProcess = processOrSpatialNode.info.type.get() === Constants_1.PROCESS_TYPE;
        const timeStampAttr = isProcess
            ? Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_PROCESS
            : Constants_1.ARCHIVE_TICKET_TIMESTAMP_ATTR_SPATIAL;
        const relationName = isProcess
            ? Constants_1.PROCESS_ARCHIVE_TICKET_RELATION
            : Constants_1.SPATIAL_ARCHIVE_TICKET_RELATION;
        const archiveTicketType = isProcess
            ? Constants_1.PROCESS_ARCHIVE_TICKET_TYPE
            : Constants_1.SPATIAL_ARCHIVE_TICKET_TYPE;
        const archiveTicketNode = yield __await((0, _getArchive_1._getArchive)(processOrSpatialNode, relationName, archiveTicketType));
        const archiveParts = yield __await((0, _getAchivePartsFromArchive_1._getAchivePartsFromArchive)(archiveTicketNode));
        for (const archivePart of archiveParts) {
            if (archivePart.info.end.get() < tsBegin ||
                archivePart.info.start.get() > tsEnd)
                continue;
            const tickets = yield __await(archivePart.getChildren(Constants_1.ARCHIVE_TICKET_PART_TICKET_RELATION));
            for (const ticket of tickets) {
                if (((_a = ticket.info[timeStampAttr]) === null || _a === void 0 ? void 0 : _a.get()) >= tsBegin &&
                    ((_b = ticket.info[timeStampAttr]) === null || _b === void 0 ? void 0 : _b.get()) <= tsEnd) {
                    yield yield __await(ticket);
                }
            }
        }
    });
}
exports.getTicketsFromArchiveGen = getTicketsFromArchiveGen;
//# sourceMappingURL=getTicketsFromArchive.js.map