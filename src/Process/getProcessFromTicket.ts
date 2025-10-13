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
import {
  PROCESS_TYPE,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
} from '../Constants';

export async function getProcessFromTicket(
  ticketNode: SpinalNode,
  contextNodeTicket?: SpinalContext
): Promise<SpinalNode> {
  // try with to find via the context
  if (contextNodeTicket) {
    for await (const item of ticketNode.visitParentsInContext(
      contextNodeTicket
    )) {
      if (PROCESS_TYPE === item.info.type.get()) return item;
    }
  }

  // try with to find via the relations
  for await (const item of ticketNode.visitParents([
    SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  ])) {
    if (PROCESS_TYPE === item.info.type.get()) return item;
  }
}
