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
exports.changeTicketProcess = void 0;
const getTicketContextId_1 = require("./getTicketContextId");
const getFirstStepNode_1 = require("../Step/getFirstStepNode");
const GraphService_1 = require("../GraphService");
const getTicketInfo_1 = require("./getTicketInfo");
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const _modifyTicketStepId_1 = require("./_modifyTicketStepId");
const Constants_1 = require("../Constants");
function changeTicketProcess(ticketNode, newProcessNode, newContextTicketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketInfo = yield (0, getTicketInfo_1.getTicketInfo)(ticketNode, ['stepId']);
        const oldContextId = (0, getTicketContextId_1.getTicketContextId)(ticketNode);
        const oldContextTicketNode = (0, GraphService_1.graphServiceGetRealNode)(oldContextId);
        const contextNodeTicket = newContextTicketNode || oldContextTicketNode;
        const toStepNode = yield (0, getFirstStepNode_1.getFirstStepNode)(newProcessNode, contextNodeTicket);
        const fromStepNode = yield getOldStep(ticketNode, oldContextTicketNode);
        if (contextNodeTicket === oldContextTicketNode) {
            yield fromStepNode.removeChild(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
        }
        else {
            yield removeFromContext(ticketNode, fromStepNode, oldContextTicketNode);
        }
        yield toStepNode.addChildInContext(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE, contextNodeTicket);
        yield (0, _modifyTicketStepId_1._modifyTicketStepId)(ticketNode, toStepNode.info.id.get());
        yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.creation, {}, toStepNode === null || toStepNode === void 0 ? void 0 : toStepNode.info.id.get(), fromStepNode === null || fromStepNode === void 0 ? void 0 : fromStepNode.info.id.get());
        return ticketNode;
    });
}
exports.changeTicketProcess = changeTicketProcess;
function getOldStep(ticketNode, oldContextTicketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const parents = yield ticketNode.getParentsInContext(oldContextTicketNode);
        for (const parent of parents) {
            if (parent.info.type.get() === Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE) {
                return parent;
            }
        }
    });
}
function removeFromContext(ticketNode, fromStepNode, oldContextTicketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fromStepNode.removeChild(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
            ticketNode.removeContextId(oldContextTicketNode.info.id.get());
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
//# sourceMappingURL=changeTicketProcess.js.map