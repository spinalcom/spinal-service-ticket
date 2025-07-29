"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._createStepNode = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const Constants_1 = require("../Constants");
function _createStepNode(name, color, order) {
    const node = new spinal_model_graph_1.SpinalNode(name, Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE);
    node.info.add_attr('color', color);
    node.info.add_attr('order', order);
    return node;
}
exports._createStepNode = _createStepNode;
//# sourceMappingURL=_createStepNode.js.map