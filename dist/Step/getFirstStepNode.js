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
exports.getFirstStepNode = void 0;
const getStepNodesFromProcess_1 = require("./getStepNodesFromProcess");
const addStepNodeToProcess_1 = require("./addStepNodeToProcess");
const _createStepNode_1 = require("./_createStepNode");
const Constants_1 = require("../Constants");
function getFirstStepNode(processNode, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        const steps = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
        let first = steps.find((el) => el.info.order.get() == 0);
        if (first)
            return first;
        const defaultStep = Constants_1.DEFAULT_STEPS.find((it) => it.order === 0);
        if (!defaultStep)
            throw Error('Default step not found from constants config');
        let stepNode = (0, _createStepNode_1._createStepNode)(defaultStep.name, defaultStep.color, defaultStep.order);
        yield (0, addStepNodeToProcess_1.addStepNodeToProcess)(stepNode, processNode, contextNodeTicket);
        return stepNode;
    });
}
exports.getFirstStepNode = getFirstStepNode;
//# sourceMappingURL=getFirstStepNode.js.map