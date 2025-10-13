"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlarmsFromNode = void 0;
const Constants_1 = require("../Constants");
function getAlarmsFromNode(node) {
    return node.getChildren([Constants_1.ALARM_RELATION_NAME]);
}
exports.getAlarmsFromNode = getAlarmsFromNode;
//# sourceMappingURL=getAlarmsFromNode.js.map