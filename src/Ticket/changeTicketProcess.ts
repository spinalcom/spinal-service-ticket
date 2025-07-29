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
import { getTicketContextId } from './getTicketContextId';
import { getFirstStepNode } from '../Step/getFirstStepNode';
import { graphServiceGetRealNode } from '../GraphService';
import { getTicketInfo } from './getTicketInfo';
import { addLogToTicketNode } from '../Logs/addLogToTicketNode';
import { _modifyTicketStepId } from './_modifyTicketStepId';
import {
  LOGS_EVENTS,
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
} from '../Constants';

export async function changeTicketProcess(
  ticketNode: SpinalNode,
  newProcessNode: SpinalNode,
  newContextTicketNode?: SpinalContext
) {
  const ticketInfo = await getTicketInfo(ticketNode, ['stepId'] as const);
  const oldContextId = getTicketContextId(ticketNode);
  const oldContextTicketNode: SpinalContext =
    graphServiceGetRealNode(oldContextId);
  const contextNodeTicket = newContextTicketNode || oldContextTicketNode;

  const toStepNode = await getFirstStepNode(newProcessNode, contextNodeTicket);
  const fromStepNode = await getOldStep(ticketNode, oldContextTicketNode);

  if (contextNodeTicket === oldContextTicketNode) {
    await fromStepNode.removeChild(
      ticketNode,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
    );
  } else {
    await removeFromContext(ticketNode, fromStepNode, oldContextTicketNode);
  }
  await toStepNode.addChildInContext(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
    contextNodeTicket
  );

  await _modifyTicketStepId(ticketNode, toStepNode.info.id.get());
  await addLogToTicketNode(
    ticketNode,
    LOGS_EVENTS.creation,
    {},
    toStepNode?.info.id.get(),
    fromStepNode?.info.id.get()
  );
  return ticketNode;
}

async function getOldStep(
  ticketNode: SpinalNode,
  oldContextTicketNode: SpinalContext
) {
  const parents = await ticketNode.getParentsInContext(oldContextTicketNode);
  for (const parent of parents) {
    if (parent.info.type.get() === SPINAL_TICKET_SERVICE_STEP_TYPE) {
      return parent;
    }
  }
}

async function removeFromContext(
  ticketNode: SpinalNode,
  fromStepNode: SpinalNode,
  oldContextTicketNode: SpinalContext
): Promise<boolean> {
  try {
    await fromStepNode.removeChild(
      ticketNode,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
    );
    ticketNode.removeContextId(oldContextTicketNode.info.id.get());
    return true;
  } catch (error) {
    return false;
  }
}
