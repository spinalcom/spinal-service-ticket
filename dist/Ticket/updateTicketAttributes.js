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
exports.updateTicketAttributes = void 0;
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const Constants_1 = require("../Constants");
function updateTicketAttributes(ticketNode, attrToSet, res = {}) {
    for (const key in attrToSet) {
        if (Object.prototype.hasOwnProperty.call(attrToSet, key)) {
            const element = attrToSet[key];
            if (typeof element === 'object') {
                // call recursively if the element is an object
                updateTicketAttributes(ticketNode, element, res);
            }
            else if (typeof element !== 'string') {
                Object.assign(res, {
                    [key]: element.toString(),
                });
                // convert to string if it's not
            }
            else {
                Object.assign(res, {
                    [key]: element.toString(),
                });
            }
        }
    }
    return spinal_env_viewer_plugin_documentation_service_1.attributeService.createOrUpdateAttrsAndCategories(ticketNode, Constants_1.TICKET_ATTRIBUTE_CATEGORY_NAME, res);
}
exports.updateTicketAttributes = updateTicketAttributes;
//# sourceMappingURL=updateTicketAttributes.js.map