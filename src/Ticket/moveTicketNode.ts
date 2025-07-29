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
import { updateTicketAttributes } from './updateTicketAttributes';
import {
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
} from '../Constants';

export async function moveTicketNode(
  ticketNode: SpinalNode,
  fromStepNode: SpinalNode,
  toStepNode: SpinalNode,
  contextNodeTicket: SpinalContext
): Promise<void> {
  if (
    typeof ticketNode === 'undefined' ||
    typeof fromStepNode === 'undefined' ||
    typeof toStepNode === 'undefined' ||
    typeof contextNodeTicket === 'undefined'
  ) {
    return;
  }
  // get process id
  const processes = await toStepNode.getParentsInContext(contextNodeTicket);
  const attrToSet: any = {
    stepId: toStepNode.info.id.get(),
  };
  // should have length === 1
  if (processes.length > 0) attrToSet.processId = processes[0].info.id.get();

  // move the ticket
  await fromStepNode.removeChild(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
  );
  await toStepNode.addChildInContext(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
    contextNodeTicket
  );
  // setAttributes
  await updateTicketAttributes(ticketNode, attrToSet);
}
