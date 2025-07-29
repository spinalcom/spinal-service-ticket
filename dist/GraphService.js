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
exports.graphServiceGetRealNode = exports.graphServiceGetInfo = exports.graphServiceGetRef = exports.graphServiceAddNode = exports.graphServiceGetContextWithType = exports.graphServiceAddContext = exports.graphServiceGetGraph = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_model_graph_1 = require("spinal-model-graph");
function graphServiceGetGraph() {
    return spinal_env_viewer_graph_service_1.SpinalGraphService.getGraph();
}
exports.graphServiceGetGraph = graphServiceGetGraph;
function graphServiceAddContext(contextName, contextType, elt) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = graphServiceGetGraph();
        const context = new spinal_model_graph_1.SpinalContext(contextName, contextType, elt);
        yield graph.addContext(context);
        graphServiceAddNode(context);
        return context;
    });
}
exports.graphServiceAddContext = graphServiceAddContext;
function graphServiceGetContextWithType(contextType) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = graphServiceGetGraph();
        const contexts = yield graph.getChildren(contextType);
        return contexts.filter((context) => context instanceof spinal_model_graph_1.SpinalContext &&
            context.getType().get() === contextType);
    });
}
exports.graphServiceGetContextWithType = graphServiceGetContextWithType;
function graphServiceAddNode(node) {
    if (node)
        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
}
exports.graphServiceAddNode = graphServiceAddNode;
function graphServiceGetRef(node) {
    if (node) {
        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(node.info.id.get());
    }
}
exports.graphServiceGetRef = graphServiceGetRef;
function graphServiceGetInfo(node) {
    if (node) {
        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
        return node.info.get();
    }
}
exports.graphServiceGetInfo = graphServiceGetInfo;
function graphServiceGetRealNode(id) {
    return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
}
exports.graphServiceGetRealNode = graphServiceGetRealNode;
//# sourceMappingURL=GraphService.js.map