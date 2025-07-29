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

import type { SpinalContext } from 'spinal-model-graph';
import type { ITicketStep } from '../interfaces/ITicketStep';
import { Lst, Ptr } from 'spinal-core-connectorjs';
import { graphServiceAddContext } from '../GraphService';
import { SERVICE_TYPE, TICKET_CONTEXT_SUBTYPE_LIST } from '../Constants';
import { CANNOT_CREATE_CONTEXT_INTERNAL_ERROR } from '../Errors';

export async function createTicketContext(
  contextName: string,
  steps: ITicketStep[] = new Array(),
  contextSubType: string = 'Ticket'
): Promise<SpinalContext> {
  try {
    const context = await graphServiceAddContext(contextName, SERVICE_TYPE);
    const stepsModel = new Lst(steps);
    context.info.add_attr('steps', new Ptr(stepsModel));
    if (TICKET_CONTEXT_SUBTYPE_LIST.includes(contextSubType)) {
      context.info.add_attr('subType', contextSubType);
    }
    return context;
  } catch (error) {
    throw new Error(CANNOT_CREATE_CONTEXT_INTERNAL_ERROR);
  }
}
