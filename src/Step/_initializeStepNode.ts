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
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
import { _modifyStepProcessId } from './_modifyStepProcessId';
import { _createStepNode } from './_createStepNode';
import {
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE,
} from '../Constants';
import { CANNOT_ADD_STEP_TO_PROCESS } from '../Errors';

export async function _initializeStepNode(
  name: string,
  color: string,
  order: number,
  processNode: SpinalNode,
  contextNodeTicket: SpinalContext
): Promise<TicketStepNode> {
  try {
    const stepNode = _createStepNode(name, color, order);
    await processNode.addChildInContext(
      stepNode,
      SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
      SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE,
      contextNodeTicket
    );
    await _modifyStepProcessId(stepNode, processNode.info.id.get());
    return stepNode;
  } catch (e) {
    throw Error(CANNOT_ADD_STEP_TO_PROCESS + e);
  }
}
