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
import type { TicketStepNode } from '../interfaces/ITicketStepNode';
import { SpinalNode } from 'spinal-model-graph';
import { SPINAL_TICKET_SERVICE_STEP_TYPE } from '../Constants';

export function _createStepNode(
  name: string,
  color: string,
  order: number
): TicketStepNode {
  const node = new SpinalNode(name, SPINAL_TICKET_SERVICE_STEP_TYPE);
  node.info.add_attr('color', color);
  node.info.add_attr('order', order);
  return node as TicketStepNode;
}
