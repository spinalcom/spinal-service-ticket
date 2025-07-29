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
exports.changeTicketNodeTarget = void 0;
const Constants_1 = require("../Constants");
/**
 * Changes the target node of a ticket element.
 * e.g change the room linked to a ticket.
 * @export
 * @param {SpinalNode} ticketNode
 * @param {SpinalNode} targetNode
 * @return {*} the ticket node
 */
function changeTicketNodeTarget(ticketNode, targetNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const parents = yield ticketNode.getParents(Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
        const filteredParents = parents.filter((parent) => parent.info.type.get() !== Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE);
        const promises = filteredParents.map((parent) => {
            return parent.removeChild(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
        });
        yield Promise.all(promises);
        targetNode.addChild(ticketNode, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE);
        return ticketNode;
    });
}
exports.changeTicketNodeTarget = changeTicketNodeTarget;
//# sourceMappingURL=changeTicketNodeTarget.js.map