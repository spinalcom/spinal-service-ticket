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
function updateTicketAttributes(ticketNode, 
/**
 * The attributes to set on the ticket, usually the value is a string but it will flatten if it's an object
 * @example
 * {
 *   "priority": "high",
 *   "status": "open",
 *   "customField": {
 *     "status": "blabla",
 *     "field2": "value2"
 *   }
 * }
 * This will result in:
 * {
 *   "priority": "high",
 *   "status": "open",
 *   "field2": "value2"
 * }
 * @param attrToSet - The attributes to set on the ticket
 */
attrToSet) {
    const res = sanatizeAttributes(attrToSet);
    if (Object.keys(res).length === 0) {
        return Promise.resolve();
    }
    return spinal_env_viewer_plugin_documentation_service_1.attributeService.createOrUpdateAttrsAndCategories(ticketNode, Constants_1.TICKET_ATTRIBUTE_CATEGORY_NAME, res);
}
exports.updateTicketAttributes = updateTicketAttributes;
/**
 * Sanatize the attributes to ensure all values are strings.
 * This function will flatten the attributes if they are objects.
 * It will convert all non-string values to strings.
 * If the value is an object, it will recursively call itself to flatten the object.
 * @param {Record<string, any>} attributes
 * @param {Record<string, string>} [res={}]
 * @return {*}  {Record<string, string>}
 */
function sanatizeAttributes(attributes, res = {}) {
    for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            const element = attributes[key];
            if (typeof element === 'object') {
                // call recursively if the element is an object
                sanatizeAttributes(element, res);
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
    return res;
}
//# sourceMappingURL=updateTicketAttributes.js.map