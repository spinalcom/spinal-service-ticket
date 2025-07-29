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
exports.archiveTickets = void 0;
const addLogToTicketNode_1 = require("../Logs/addLogToTicketNode");
const moveTicketNode_1 = require("./moveTicketNode");
const getStepNodesFromProcess_1 = require("../Step/getStepNodesFromProcess");
const getTicketInfo_1 = require("./getTicketInfo");
const getStepFromProcessByStepId_1 = require("../Step/getStepFromProcessByStepId");
const _initializeStepNode_1 = require("../Step/_initializeStepNode");
const Constants_1 = require("../Constants");
function archiveTickets(contextNodeTicket, processNode, ticketNode, userInfo = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const achiveStep = yield createArchivedStep(processNode, contextNodeTicket);
        const ticketInfo = yield (0, getTicketInfo_1.getTicketInfo)(ticketNode, ['stepId']);
        if (ticketInfo && achiveStep) {
            const currentStep = yield (0, getStepFromProcessByStepId_1.getStepFromProcessByStepId)(contextNodeTicket, processNode, ticketInfo.stepId);
            yield (0, moveTicketNode_1.moveTicketNode)(ticketNode, currentStep, achiveStep, contextNodeTicket);
            yield (0, addLogToTicketNode_1.addLogToTicketNode)(ticketNode, Constants_1.LOGS_EVENTS.archived, userInfo, currentStep.info.id.get(), achiveStep.info.id.get());
            return achiveStep;
        }
    });
}
exports.archiveTickets = archiveTickets;
function createArchivedStep(processNode, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
        const found = result.find((el) => el.info.name.get() === Constants_1.ARCHIVED_STEP.name &&
            el.info.order.get() === Constants_1.ARCHIVED_STEP.order);
        if (found)
            return found;
        return (0, _initializeStepNode_1._initializeStepNode)(Constants_1.ARCHIVED_STEP.name, Constants_1.ARCHIVED_STEP.color, Constants_1.ARCHIVED_STEP.order, processNode, contextNodeTicket);
    });
}
//# sourceMappingURL=archiveTickets.js.map