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

import type { SpinalNode } from 'spinal-model-graph';
import type { IUserInfo } from '../interfaces/IUserInfo';
import {
  EVENTS_TO_LOG,
  LOGS_EVENTS,
  SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
  SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE,
} from '../Constants';
import { createTicketLog } from './createTicketLog';

export async function addLogToTicketNode(
  ticketNode: SpinalNode,
  event: LOGS_EVENTS,
  userInfo: IUserInfo = {},
  fromId?: string,
  toId?: string
) {
  let info = {
    ticketId: ticketNode.info.id.get(),
    event: event,
    action: EVENTS_TO_LOG[event],
    user: userInfo,
    steps: [],
  };

  if (fromId) info.steps.push(fromId);
  if (toId) info.steps.push(toId);

  const logId = createTicketLog(info);

  return ticketNode.addChild(
    logId,
    SPINAL_TICKET_SERVICE_LOG_RELATION_NAME,
    SPINAL_TICKET_SERVICE_LOG_RELATION_TYPE
  );
}
