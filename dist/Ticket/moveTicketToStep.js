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
exports.moveTicketToStep = void 0;
const moveTicketNode_1 = require("./moveTicketNode");
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const old_constants_1 = require("../old_constants");
function moveTicketToStep(ticketNode, stepNodeOrigin, stepNodeTarget, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, moveTicketNode_1.moveTicketNode)(ticketNode, stepNodeOrigin, stepNodeTarget, contextNodeTicket);
        yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, old_constants_1.LOGS_EVENTS.move, undefined, stepNodeOrigin.info.id.get(), stepNodeTarget.info.id.get());
    });
}
exports.moveTicketToStep = moveTicketToStep;
//# sourceMappingURL=moveTicketToStep.js.map