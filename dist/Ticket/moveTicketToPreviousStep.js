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
exports.moveTicketToPreviousStep = void 0;
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const getTicketInfo_1 = require("./getTicketInfo");
const moveTicketNode_1 = require("./moveTicketNode");
const Constants_1 = require("../Constants");
const getPreviousStepNode_1 = require("../Step/getPreviousStepNode");
const getStepFromProcessByStepId_1 = require("../Step/getStepFromProcessByStepId");
function moveTicketToPreviousStep(contextNodeTicket, processNode, ticketNode, userInfo = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketInfo = yield (0, getTicketInfo_1.getTicketInfo)(ticketNode, ['stepId']);
        if (ticketInfo.stepId) {
            const stepNode = yield (0, getStepFromProcessByStepId_1.getStepFromProcessByStepId)(contextNodeTicket, processNode, ticketInfo.stepId);
            const previousStep = yield (0, getPreviousStepNode_1.getPreviousStepNode)(processNode, stepNode, contextNodeTicket);
            if (previousStep) {
                yield (0, moveTicketNode_1.moveTicketNode)(ticketNode, stepNode, previousStep, contextNodeTicket);
                yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.moveToPrevious, userInfo, stepNode.info.id.get(), previousStep.info.id.get());
                return previousStep;
            }
        }
    });
}
exports.moveTicketToPreviousStep = moveTicketToPreviousStep;
//# sourceMappingURL=moveTicketToPreviousStep.js.map