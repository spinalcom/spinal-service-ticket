"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceTicket_1 = require("./ServiceTicket");
const G_root = typeof window === 'undefined' ? global : window;
if (typeof G_root.spinal === 'undefined')
    G_root.spinal = {};
if (typeof G_root.spinal.SpinalServiceTicket === 'undefined') {
    G_root.spinal.spinalServiceTicket = new ServiceTicket_1.ServiceTicket();
}
exports.SpinalServiceTicket = G_root.spinal.spinalServiceTicket;
//# sourceMappingURL=index.js.map