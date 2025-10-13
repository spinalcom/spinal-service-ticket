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
exports._initializeStepNode = void 0;
const _modifyStepProcessId_1 = require("./_modifyStepProcessId");
const _createStepNode_1 = require("./_createStepNode");
const Constants_1 = require("../Constants");
const Errors_1 = require("../Errors");
function _initializeStepNode(name, color, order, processNode, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stepNode = (0, _createStepNode_1._createStepNode)(name, color, order);
            yield processNode.addChildInContext(stepNode, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE, contextNodeTicket);
            yield (0, _modifyStepProcessId_1._modifyStepProcessId)(stepNode, processNode.info.id.get());
            return stepNode;
        }
        catch (e) {
            throw Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e);
        }
    });
}
exports._initializeStepNode = _initializeStepNode;
//# sourceMappingURL=_initializeStepNode.js.map