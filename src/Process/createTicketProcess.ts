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

import type { Lst } from 'spinal-core-connectorjs';
import type { SpinalProcess } from 'spinal-models-ticket';
import type { ITicketStepModel } from '../interfaces/ITicketStep';
import { type SpinalContext, SpinalNode } from 'spinal-model-graph';
import { _initializeStepNode } from '../Step/_initializeStepNode';
import { _createArchivedStep } from '../Step/_createArchivedStep';
import {
  PROCESS_TYPE,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
} from '../Constants';
import { CANNOT_CREATE_PROCESS_INTERNAL_ERROR } from '../Errors';

export async function createTicketProcess(
  processInfo: SpinalProcess | string,
  contextNodeTicket: SpinalContext
): Promise<SpinalNode> {
  if (typeof processInfo === 'string') processInfo = { name: processInfo };
  try {
    processInfo.type = PROCESS_TYPE;
    const processNode = new SpinalNode();
    for (const key in processInfo) {
      if (Object.prototype.hasOwnProperty.call(processInfo, key)) {
        const element = processInfo[key];
        processNode.info.add_attr(key, element);
      }
    }
    await contextNodeTicket.addChildInContext(
      processNode,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE,
      contextNodeTicket
    );
    const steps = await getContextSteps(contextNodeTicket);

    for (const step of steps) {
      await _initializeStepNode(
        step.name.get(),
        step.color.get(),
        step.order.get(),
        processNode,
        contextNodeTicket
      );
    }
    await _createArchivedStep(processNode, contextNodeTicket);
    return processNode;
  } catch (e) {
    console.error(e);
    throw new Error(CANNOT_CREATE_PROCESS_INTERNAL_ERROR);
  }
}

async function getContextSteps(
  contextNodeTicket: SpinalContext
): Promise<ITicketStepModel[]> {
  if (contextNodeTicket?.info?.steps) {
    const stepsLst: Lst<ITicketStepModel> =
      await contextNodeTicket.info.steps.load();
    return Array.from(stepsLst);
  }
}
