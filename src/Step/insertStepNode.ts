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

import type { SpinalNode, SpinalContext } from 'spinal-model-graph';
import type { ITicketStep } from '../interfaces/ITicketStep';
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
import { _initializeStepNode } from './_initializeStepNode';
import { getSuperiorsStepNodes } from './getSuperiorsStepNodes';

export async function insertStepNode(
  contextNodeTicket: SpinalContext,
  processNode: SpinalNode,
  stepInfo: ITicketStep
): Promise<TicketStepNode> {
  const steps = await getSuperiorsStepNodes(
    contextNodeTicket,
    processNode,
    stepInfo.order,
    true
  );
  const stepNode = await _initializeStepNode(
    stepInfo.name,
    stepInfo.color,
    stepInfo.order,
    processNode,
    contextNodeTicket
  );

  for (const step of steps) {
    step.info.order.set(step.info.order.get() + 1);
  }
  return stepNode;
}
