import {ServiceTicket} from "./ServiceTicket";

const G_root = typeof window == "undefined" ? global : window;

if (typeof G_root.spinal === "undefined") G_root.spinal = {};
if (typeof G_root.spinal.SpinalServiceTicket === "undefined") {
    G_root.spinal.spinalServiceTicket = new ServiceTicket();
}


export const SpinalServiceTicket = G_root.spinal.spinalServiceTicket;
