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
exports.addStepNodeToProcess = void 0;
const _modifyStepProcessId_1 = require("./_modifyStepProcessId");
const Constants_1 = require("../Constants");
const Errors_1 = require("../Errors");
function addStepNodeToProcess(stepNode, processNode, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield processNode.addChildInContext(stepNode, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE, contextNodeTicket);
            (0, _modifyStepProcessId_1._modifyStepProcessId)(stepNode, processNode.info.id.get());
        }
        catch (error) {
            throw Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + error);
        }
    });
}
exports.addStepNodeToProcess = addStepNodeToProcess;
//# sourceMappingURL=addStepNodeToProcess.js.map