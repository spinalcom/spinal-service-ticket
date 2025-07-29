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
exports.unarchiveTicket = void 0;
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const moveTicketNode_1 = require("./moveTicketNode");
const Constants_1 = require("../Constants");
const getTicketInfo_1 = require("./getTicketInfo");
const getStepFromProcessByStepId_1 = require("../Step/getStepFromProcessByStepId");
const getFirstStepNode_1 = require("../Step/getFirstStepNode");
function unarchiveTicket(contextNodeTicket, processNode, ticketNode, userInfo = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketInfo = yield (0, getTicketInfo_1.getTicketInfo)(ticketNode, ['stepId']);
        const firstStep = yield (0, getFirstStepNode_1.getFirstStepNode)(processNode, contextNodeTicket);
        if (ticketInfo && firstStep) {
            const currentStep = yield (0, getStepFromProcessByStepId_1.getStepFromProcessByStepId)(contextNodeTicket, processNode, ticketInfo.stepId);
            yield (0, moveTicketNode_1.moveTicketNode)(ticketNode, currentStep, firstStep, contextNodeTicket);
            yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.unarchive, userInfo, currentStep.info.id.get(), firstStep.info.id.get());
            return firstStep;
        }
    });
}
exports.unarchiveTicket = unarchiveTicket;
//# sourceMappingURL=unarchiveTicket.js.map