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

import type { TicketInterface } from 'spinal-models-ticket';
import { SpinalNode } from 'spinal-model-graph';
import { getFirstStepNode } from '../Step/getFirstStepNode';
import { addLogToTicketNode } from '../Logs/addLogToTicketNode';
import { _modifyTicketStepId } from './_modifyTicketStepId';
import {
  ALARM_RELATION_NAME,
  LOGS_EVENTS,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
} from '../Constants';
import { updateTicketAttributes } from './updateTicketAttributes';

export async function addTicket(
  ticketInfo: TicketInterface,
  processNode: SpinalNode,
  contextNodeTicket: SpinalNode,
  targetNode: SpinalNode,
  ticketType: string = 'Ticket'
) {
  const stepNode = await getFirstStepNode(processNode, contextNodeTicket);

  ticketInfo.processId = processNode.info.id.get();
  ticketInfo.stepId = stepNode.info.id.get();
  ticketInfo.contextId = contextNodeTicket.info.id.get();
  Object.assign(ticketInfo, {
    creationDate: Date.now().toString(),
  });
  const ticketNode = await createTicketNode(ticketInfo);
  await stepNode.addChildInContext(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE,
    contextNodeTicket
  );

  await targetNode.addChild(
    ticketNode,
    ticketType == 'Alarm'
      ? ALARM_RELATION_NAME
      : SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE
  );
  const userInfo = ticketInfo.user ? ticketInfo.user : {};
  await addLogToTicketNode(
    ticketNode,
    LOGS_EVENTS.creation,
    userInfo,
    stepNode.info.id.get()
  );
  return ticketNode;
}

async function createTicketNode(
  elementInfo: TicketInterface
): Promise<SpinalNode> {
  if (!elementInfo.declarer_id) elementInfo.declarer_id = 'unknow';
  const ticket = new SpinalNode(
    elementInfo.name,
    SPINAL_TICKET_SERVICE_TICKET_TYPE
  );

  await updateTicketAttributes(ticket, elementInfo);
  return ticket;
}
