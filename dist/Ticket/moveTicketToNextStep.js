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
exports.moveTicketToNextStep = void 0;
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const getNextStepNode_1 = require("../Step/getNextStepNode");
const getStepNodesFromProcess_1 = require("../Step/getStepNodesFromProcess");
const getTicketInfo_1 = require("./getTicketInfo");
const moveTicketNode_1 = require("./moveTicketNode");
const Constants_1 = require("../Constants");
function moveTicketToNextStep(contextNodeTicket, processNode, ticketNode, userInfo = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketInfo = yield (0, getTicketInfo_1.getTicketInfo)(ticketNode, ['stepId']);
        if (ticketInfo.stepId) {
            const steps = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
            const stepNode = steps.find((el) => el.info.id.get() === ticketInfo.stepId);
            const nextStep = yield (0, getNextStepNode_1.getNextStepNode)(processNode, stepNode, contextNodeTicket);
            if (nextStep) {
                yield (0, moveTicketNode_1.moveTicketNode)(ticketNode, stepNode, nextStep, contextNodeTicket);
                yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.moveToNext, userInfo, stepNode.info.id.get(), nextStep.info.id.get());
                return nextStep;
            }
        }
    });
}
exports.moveTicketToNextStep = moveTicketToNextStep;
//# sourceMappingURL=moveTicketToNextStep.js.map