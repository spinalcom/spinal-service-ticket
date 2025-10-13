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
exports.getTicketInfo = void 0;
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
function getTicketInfo(ticketNode, attributesToGet) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(attributesToGet) && attributesToGet.length > 0) {
            const data = yield spinal_env_viewer_plugin_documentation_service_1.attributeService.getAttrBySchema(ticketNode, {
                default: attributesToGet,
            });
            return data.default;
        }
        const category = yield spinal_env_viewer_plugin_documentation_service_1.attributeService.getCategoryByName(ticketNode, 'default');
        if (!category)
            return;
        const attributes = yield spinal_env_viewer_plugin_documentation_service_1.attributeService.getAttributesByCategory(ticketNode, category);
        const data = {};
        for (const attr of attributes) {
            const label = attr.label.get();
            const value = attr.value.get();
            if (label && value)
                data[label] = value;
        }
        return data;
    });
}
exports.getTicketInfo = getTicketInfo;
//# sourceMappingURL=getTicketInfo.js.map