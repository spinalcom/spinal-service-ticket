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
exports.createTicketProcess = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const _initializeStepNode_1 = require("../Step/_initializeStepNode");
const _createArchivedStep_1 = require("../Step/_createArchivedStep");
const Constants_1 = require("../Constants");
const Errors_1 = require("../Errors");
function createTicketProcess(processInfo, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof processInfo === 'string')
            processInfo = { name: processInfo };
        try {
            processInfo.type = Constants_1.PROCESS_TYPE;
            const processNode = new spinal_model_graph_1.SpinalNode();
            for (const key in processInfo) {
                if (Object.prototype.hasOwnProperty.call(processInfo, key)) {
                    const element = processInfo[key];
                    processNode.info.add_attr(key, element);
                }
            }
            yield contextNodeTicket.addChildInContext(processNode, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE, contextNodeTicket);
            const steps = yield getContextSteps(contextNodeTicket);
            for (const step of steps) {
                yield (0, _initializeStepNode_1._initializeStepNode)(step.name.get(), step.color.get(), step.order.get(), processNode, contextNodeTicket);
            }
            yield (0, _createArchivedStep_1._createArchivedStep)(processNode, contextNodeTicket);
            return processNode;
        }
        catch (e) {
            console.error(e);
            throw new Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR);
        }
    });
}
exports.createTicketProcess = createTicketProcess;
function getContextSteps(contextNodeTicket) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = contextNodeTicket === null || contextNodeTicket === void 0 ? void 0 : contextNodeTicket.info) === null || _a === void 0 ? void 0 : _a.steps) {
            const stepsLst = yield contextNodeTicket.info.steps.load();
            return Array.from(stepsLst);
        }
    });
}
//# sourceMappingURL=createTicketProcess.js.map