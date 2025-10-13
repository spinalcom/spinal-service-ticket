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

import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
import { getStepNodesFromProcess } from './getStepNodesFromProcess';

export async function getNextStepNode(
  processNode: SpinalNode,
  stepNode: SpinalNode,
  contextNodeTicket: SpinalContext
): Promise<TicketStepNode | undefined> {
  if (stepNode && stepNode?.info?.order?.get() >= 0) {
    const steps = await getStepNodesFromProcess(processNode, contextNodeTicket);
    const nextOrder = parseInt(stepNode.info.order.get()) + 1;
    return steps.find((el) => el.info.order.get() == nextOrder);
  }
}

export async function getNextStepNodeByStepId(
  processNode: SpinalNode,
  stepId: string,
  contextNodeTicket: SpinalContext
): Promise<TicketStepNode | undefined> {
  if (!stepId) return undefined;
  const steps = await getStepNodesFromProcess(processNode, contextNodeTicket);
  const stepNode = steps.find((el) => el.info.id.get() === stepId);
  if (stepNode && stepNode?.info?.order?.get() >= 0) {
    const nextOrder = stepNode.info.order.get() + 1;
    return steps.find((el) => el.info.order.get() == nextOrder);
  }
}
