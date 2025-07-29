"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketLogs = void 0;
const Constants_1 = require("../Constants");
function getTicketLogs(ticketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = yield ticketNode.getChildren(Constants_1.SPINAL_TICKET_SERVICE_LOG_RELATION_NAME);
        const elements = yield Promise.all(logs.map((el) => el.element.load()));
        return elements.map((el) => {
            const res = el.get();
            if (typeof res.action == 'undefined')
                res.action = Constants_1.EVENTS_TO_LOG[res.event];
            return res;
        });
    });
}
exports.getTicketLogs = getTicketLogs;
//# sourceMappingURL=getTicketLogs.js.map