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
import { _initializeStepNode } from './_initializeStepNode';
import { getStepNodesFromProcess } from './getStepNodesFromProcess';
import { ARCHIVED_STEP } from '../Constants';

export async function _createArchivedStep(
  processNode: SpinalNode,
  contextNodeTicket: SpinalContext
): Promise<TicketStepNode> {
  const processSteps = await getStepNodesFromProcess(
    processNode,
    contextNodeTicket
  );
  const found = processSteps.find(
    (el) =>
      el.info.name.get() === ARCHIVED_STEP.name &&
      el.info.order.get() === ARCHIVED_STEP.order
  );
  if (found) return found;

  return _initializeStepNode(
    ARCHIVED_STEP.name,
    ARCHIVED_STEP.color,
    ARCHIVED_STEP.order,
    processNode,
    contextNodeTicket
  );
}
