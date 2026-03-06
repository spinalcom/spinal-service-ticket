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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTicket = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const getFirstStepNode_1 = require("../Step/getFirstStepNode");
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const Constants_1 = require("../Constants");
const updateTicketAttributes_1 = require("./updateTicketAttributes");
function addTicket(ticketInfo, processNode, contextNodeTicket, targetNode, ticketType = 'Ticket', existingTicketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const stepNode = yield (0, getFirstStepNode_1.getFirstStepNode)(processNode, contextNodeTicket);
        ticketInfo.processId = processNode.info.id.get();
        ticketInfo.stepId = stepNode.info.id.get();
        ticketInfo.contextId = contextNodeTicket.info.id.get();
        Object.assign(ticketInfo, {
            creationDate: Date.now().toString(),
        });
        const ticketNode = yield createTicketNode(ticketInfo, existingTicketNode);
        yield stepNode.addChildInContext(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE, contextNodeTicket);
        yield targetNode.addChild(ticketNode, ticketType == 'Alarm'
            ? Constants_1.ALARM_RELATION_NAME
            : Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
        const userInfo = ticketInfo.user ? ticketInfo.user : {};
        yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.creation, userInfo, stepNode.info.id.get());
        return ticketNode;
    });
}
exports.addTicket = addTicket;
function createTicketNode(elementInfo, existingTicketNode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!elementInfo.declarer_id)
            elementInfo.declarer_id = 'unknow';
        const ticket = existingTicketNode !== null && existingTicketNode !== void 0 ? existingTicketNode : new spinal_model_graph_1.SpinalNode(elementInfo.name, Constants_1.SPINAL_TICKET_SERVICE_TICKET_TYPE);
        yield (0, updateTicketAttributes_1.updateTicketAttributes)(ticket, elementInfo);
        return ticket;
    });
}
//# sourceMappingURL=addTicket.js.map