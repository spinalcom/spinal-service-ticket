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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessFromTicket = void 0;
const Constants_1 = require("../Constants");
function getProcessFromTicket(ticketNode, contextNodeTicket) {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // try with to find via the context
        if (contextNodeTicket) {
            try {
                for (var _g = true, _h = __asyncValues(ticketNode.visitParentsInContext(contextNodeTicket)), _j; _j = yield _h.next(), _a = _j.done, !_a;) {
                    _c = _j.value;
                    _g = false;
                    try {
                        const item = _c;
                        if (Constants_1.PROCESS_TYPE === item.info.type.get())
                            return item;
                    }
                    finally {
                        _g = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        try {
            // try with to find via the relations
            for (var _k = true, _l = __asyncValues(ticketNode.visitParents([
                Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
                Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
            ])), _m; _m = yield _l.next(), _d = _m.done, !_d;) {
                _f = _m.value;
                _k = false;
                try {
                    const item = _f;
                    if (Constants_1.PROCESS_TYPE === item.info.type.get())
                        return item;
                }
                finally {
                    _k = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
exports.getProcessFromTicket = getProcessFromTicket;
//# sourceMappingURL=getProcessFromTicket.js.map