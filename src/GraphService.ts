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

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  type SpinalGraph,
  SpinalContext,
  type SpinalNode,
} from 'spinal-model-graph';
import type { Model } from 'spinal-core-connectorjs';
export { SpinalNodeRef } from 'spinal-env-viewer-graph-service';

export function graphServiceGetGraph(): SpinalGraph {
  return SpinalGraphService.getGraph();
}
export async function graphServiceAddContext(
  contextName: string,
  contextType: string,
  elt?: Model
): Promise<SpinalContext> {
  const graph = graphServiceGetGraph();
  const context = new SpinalContext(contextName, contextType, elt);
  await graph.addContext(context);
  graphServiceAddNode(context);
  return context;
}

export async function graphServiceGetContextWithType(
  contextType: string
): Promise<SpinalContext[]> {
  const graph = graphServiceGetGraph();
  const contexts = await graph.getChildren();
  return contexts.filter(
    (context) =>
      context instanceof SpinalContext &&
      context.getType().get() === contextType
  ) as SpinalContext[];
}

export function graphServiceAddNode(node: SpinalNode): void {
  if (node) SpinalGraphService._addNode(node);
}
export function graphServiceGetRef(node: SpinalNode) {
  if (node) {
    SpinalGraphService._addNode(node);
    return SpinalGraphService.getInfo(node.info.id.get());
  }
}
export function graphServiceGetInfo(node: SpinalNode): Record<string, any> {
  if (node) {
    SpinalGraphService._addNode(node);
    return node.info.get();
  }
}

export function graphServiceGetRealNode(id: string): SpinalNode {
  return SpinalGraphService.getRealNode(id);
}
