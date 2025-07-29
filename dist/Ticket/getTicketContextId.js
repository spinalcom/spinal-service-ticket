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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketContextId = void 0;
const GraphService_1 = require("../GraphService");
const Constants_1 = require("../Constants");
function getTicketContextId(ticketNode) {
    if (ticketNode) {
        return ticketNode.contextIds._attribute_names.find((id) => {
            const node = (0, GraphService_1.graphServiceGetRealNode)(id);
            if (!node)
                return false;
            return node.getType().get() === Constants_1.SERVICE_TYPE;
        });
    }
}
exports.getTicketContextId = getTicketContextId;
//# sourceMappingURL=getTicketContextId.js.map