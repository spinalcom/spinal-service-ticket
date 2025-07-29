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
exports.getNextStepNodeByStepId = exports.getNextStepNode = void 0;
const getStepNodesFromProcess_1 = require("./getStepNodesFromProcess");
function getNextStepNode(processNode, stepNode, contextNodeTicket) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (stepNode && ((_b = (_a = stepNode === null || stepNode === void 0 ? void 0 : stepNode.info) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.get()) >= 0) {
            const steps = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
            const nextOrder = parseInt(stepNode.info.order.get()) + 1;
            return steps.find((el) => el.info.order.get() == nextOrder);
        }
    });
}
exports.getNextStepNode = getNextStepNode;
function getNextStepNodeByStepId(processNode, stepId, contextNodeTicket) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!stepId)
            return undefined;
        const steps = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
        const stepNode = steps.find((el) => el.info.id.get() === stepId);
        if (stepNode && ((_b = (_a = stepNode === null || stepNode === void 0 ? void 0 : stepNode.info) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.get()) >= 0) {
            const nextOrder = stepNode.info.order.get() + 1;
            return steps.find((el) => el.info.order.get() == nextOrder);
        }
    });
}
exports.getNextStepNodeByStepId = getNextStepNodeByStepId;
//# sourceMappingURL=getNextStepNode.js.map