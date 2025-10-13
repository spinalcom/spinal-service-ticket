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
import type { IUserInfo } from '../interfaces/IUserInfo';
import { addLogToTicketNode } from '../Logs/addLogToTicketNode';
import { getNextStepNode } from '../Step/getNextStepNode';
import { getStepNodesFromProcess } from '../Step/getStepNodesFromProcess';
import { getTicketInfo } from './getTicketInfo';
import { moveTicketNode } from './moveTicketNode';
import { LOGS_EVENTS } from '../Constants';

export async function moveTicketToNextStep(
  contextNodeTicket: SpinalContext,
  processNode: SpinalNode,
  ticketNode: SpinalNode,
  userInfo: IUserInfo = {}
) {
  const ticketInfo = await getTicketInfo(ticketNode, ['stepId'] as const);
  if (ticketInfo.stepId) {
    const steps = await getStepNodesFromProcess(processNode, contextNodeTicket);
    const stepNode = steps.find((el) => el.info.id.get() === ticketInfo.stepId);
    const nextStep = await getNextStepNode(
      processNode,
      stepNode,
      contextNodeTicket
    );
    if (nextStep) {
      await moveTicketNode(ticketNode, stepNode, nextStep, contextNodeTicket);
      await addLogToTicketNode(
        ticketNode,
        LOGS_EVENTS.moveToNext,
        userInfo,
        stepNode.info.id.get(),
        nextStep.info.id.get()
      );
      return nextStep;
    }
  }
}
