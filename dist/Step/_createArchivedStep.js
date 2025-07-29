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
exports._createArchivedStep = void 0;
const _initializeStepNode_1 = require("./_initializeStepNode");
const getStepNodesFromProcess_1 = require("./getStepNodesFromProcess");
const Constants_1 = require("../Constants");
function _createArchivedStep(processNode, contextNodeTicket) {
    return __awaiter(this, void 0, void 0, function* () {
        const processSteps = yield (0, getStepNodesFromProcess_1.getStepNodesFromProcess)(processNode, contextNodeTicket);
        const found = processSteps.find((el) => el.info.name.get() === Constants_1.ARCHIVED_STEP.name &&
            el.info.order.get() === Constants_1.ARCHIVED_STEP.order);
        if (found)
            return found;
        return (0, _initializeStepNode_1._initializeStepNode)(Constants_1.ARCHIVED_STEP.name, Constants_1.ARCHIVED_STEP.color, Constants_1.ARCHIVED_STEP.order, processNode, contextNodeTicket);
    });
}
exports._createArchivedStep = _createArchivedStep;
//# sourceMappingURL=_createArchivedStep.js.map