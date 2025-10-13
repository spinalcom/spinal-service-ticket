"use strict";
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
exports.addCommonIncident = void 0;
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
const spinal_model_graph_1 = require("spinal-model-graph");
const Constants_1 = require("../Constants");
function addCommonIncident(processNode, sentence) {
    return __awaiter(this, void 0, void 0, function* () {
        const children = yield processNode.getChildren(Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME);
        if (children.length > 0) {
            const sectionNode = children[0];
            const sentenceNode = new spinal_model_graph_1.SpinalNode(sentence, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_TYPE);
            yield sectionNode.addChild(sentenceNode, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE);
            return sentenceNode;
        }
        const success = yield addSentenceSection(processNode);
        if (success) {
            return addCommonIncident(processNode, sentence);
        }
    });
}
exports.addCommonIncident = addCommonIncident;
function addSentenceSection(processNode) {
    return __awaiter(this, void 0, void 0, function* () {
        const sentenceNode = new spinal_model_graph_1.SpinalNode(Constants_1.DEFAULT_INCIDENTS_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE);
        try {
            sentenceNode.info.add_attr('processId', processNode.info.id.get());
            yield processNode.addChild(sentenceNode, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
//# sourceMappingURL=addCommonIncident.js.map