"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStepNodesFromProcess = void 0;
function getStepNodesFromProcess(processNode, contextNodeTicket) {
    return processNode.getChildrenInContext(contextNodeTicket);
}
exports.getStepNodesFromProcess = getStepNodesFromProcess;
//# sourceMappingURL=getStepNodesFromProcess.js.map