/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
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

import { SpinalNode } from 'spinal-model-graph';
import {
  graphServiceAddNode,
  graphServiceGetInfo,
  graphServiceGetRealNode,
  graphServiceGetRef,
  SpinalNodeRef,
} from './GraphService';
import { ITicketStep } from './interfaces/ITicketStep';
import { createTicketContext } from './Context/createTicketContext';
import { getTicketContexts } from './Context/getTicketContexts';
import { updateTicketContexts } from './Context/updateTicketContexts';
import { ISpinalNodeArchivePart } from './interfaces/ISpinalNodePart';
import { IUserInfo } from './interfaces/IUserInfo';
import type {
  SpinalLogTicketInterface,
  SpinalProcess,
  TicketInterface,
} from 'spinal-models-ticket';
import { createTicketProcess } from './Process/createTicketProcess';
import { getAllTicketProcess } from './Process/getAllTicketProcess';
import { createStepToProcess } from './Step/createStepToProcess';
import { removeStepFromProcess } from './Step/removeStepFromProcess';
import { addStepNodeToProcess } from './Step/addStepNodeToProcess';
import { getStepNodesFromProcess } from './Step/getStepNodesFromProcess';
import { getFirstStepNode } from './Step/getFirstStepNode';
import { getNextStepNode } from './Step/getNextStepNode';
import { getPreviousStepNode } from './Step/getPreviousStepNode';
import { getSuperiorsStepNodes } from './Step/getSuperiorsStepNodes';
import { getInferiorsStepNodes } from './Step/getInferiorsStepNodes';
import { insertStepNode } from './Step/insertStepNode';
import { addTicket } from './Ticket/addTicket';
import { getTicketsFromNode } from './Ticket/getTicketsFromNode';
import { getAlarmsFromNode } from './Ticket/getAlarmsFromNode';
import { getTicketsFromStep } from './Ticket/getTicketsFromStep';
import { getProcessFromTicket } from './Ticket/getProcessFromTicket';
import { moveTicketNode } from './Ticket/moveTicketNode';
import { moveTicketToStep } from './Ticket/moveTicketToStep';
import { moveTicketToNextStep } from './Ticket/moveTicketToNextStep';
import { moveTicketToPreviousStep } from './Ticket/moveTicketToPreviousStep';
import { archiveTickets } from './Ticket/archiveTickets';
import { unarchiveTicket } from './Ticket/unarchiveTicket';
import { getTicketContextId } from './Ticket/getTicketContextId';
import { changeTicketProcess } from './Ticket/changeTicketProcess';
import { changeTicketNodeTarget } from './Ticket/changeTicketNodeTarget';
import { addLogToTicketNode } from './Logs/addLogToTicketNode';
import { createTicketLog } from './Logs/createTicketLog';
import { getTicketLogs } from './Logs/getTicketLogs';
import { addCommonIncident } from './CommonIncident/addCommonIncident';
import { getCommonIncident } from './CommonIncident/getCommonIncident';
import { getTicketsFromArchive } from './Archive/getTicketsFromArchive';
import { deleteTicketFromArchive } from './Archive/deleteTicketFromArchive';
import { updateArchivePartData } from './Archive/updateArchivePartData';
import { archiveTicketFromProcess } from './Archive/archiveTicketFromProcess';
import { archiveTicketFromSpatial } from './Archive/archiveTicketFromSpatial';

export class ServiceTicket {
  constructor() {}

  //////////////////////////////////////////////////////////
  //                      CONTEXTS                        //
  //////////////////////////////////////////////////////////

  public createContext(
    contextName: string,
    steps: ITicketStep[] = new Array(),
    contextSubType: string = 'Ticket'
  ) {
    return createTicketContext(contextName, steps, contextSubType);
  }

  public async getContexts(name?: string) {
    const contexts = await getTicketContexts(name);
    return Array.isArray(contexts)
      ? contexts.map((el) => el.info.get())
      : contexts;
  }

  public async updateContexts(
    contextId: string,
    newInfo: {
      name: string;
    }
  ) {
    const contextNode = graphServiceGetRealNode(contextId);
    return updateTicketContexts(contextNode, newInfo);
  }

  //////////////////////////////////////////////////////////
  //                      PROCESS                         //
  //////////////////////////////////////////////////////////

  public async createProcess(
    process: SpinalProcess | string,
    contextId: string
  ): Promise<string> {
    const res = await createTicketProcess(
      process,
      graphServiceGetRealNode(contextId)
    );
    graphServiceAddNode(res);
    return res.info.id.get();
  }

  public async getAllProcess(contextId: string) {
    const res = await getAllTicketProcess(graphServiceGetRealNode(contextId));
    return res.map((node) => graphServiceGetRef(node));
  }

  //////////////////////////////////////////////////////////
  //                      STEPS                           //
  //////////////////////////////////////////////////////////

  public async addStep(
    processId: string,
    contextId: string,
    name: string,
    color: string,
    order: number
  ): Promise<string> {
    const res = await createStepToProcess(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId),
      name,
      color,
      order
    );
    graphServiceAddNode(res);
    return res.info.id.get();
  }

  public async removeStep(
    processId: string,
    contextId: string,
    stepId: string
  ) {
    const res = await removeStepFromProcess(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(stepId)
    );
    graphServiceAddNode(res);
    return res.info.id.get();
  }

  public async addStepById(
    stepId: string,
    processId: string,
    contextId: string
  ): Promise<void> {
    return addStepNodeToProcess(
      graphServiceGetRealNode(stepId),
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId)
    );
  }

  public async getStepsFromProcess(processId: string, contextId: string) {
    const data = await getStepNodesFromProcess(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId)
    );
    return data.map((step) => {
      return graphServiceGetRef(step);
    });
  }

  public async getFirstStep(
    processId: string,
    contextId: string
  ): Promise<string> {
    const step = await getFirstStepNode(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId)
    );
    graphServiceAddNode(step);
    return step.info.id.get();
  }

  public async getNextStep(
    processId: string,
    stepId: string,
    contextId: string
  ): Promise<SpinalNodeRef> {
    const step = await getNextStepNode(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(stepId),
      graphServiceGetRealNode(contextId)
    );
    if (step) {
      return graphServiceGetRef(step);
    }
  }

  public async getPreviousStep(
    processId: string,
    stepId: string,
    contextId: string
  ): Promise<SpinalNodeRef> {
    const step = await getPreviousStepNode(
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(stepId),
      graphServiceGetRealNode(contextId)
    );
    if (step) {
      return graphServiceGetRef(step);
    }
  }

  public async getSuperiorsSteps(
    contextId: string,
    processId: string,
    stepOrder: number,
    equals: Boolean = false
  ) {
    const steps = await getSuperiorsStepNodes(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      stepOrder,
      equals
    );
    return steps.map((step) => graphServiceGetInfo(step));
  }

  public async getInferiorsSteps(
    contextId: string,
    processId: string,
    stepOrder: number,
    equals: Boolean = false
  ) {
    const steps = await getInferiorsStepNodes(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      stepOrder,
      equals
    );
    return steps.map((step) => graphServiceGetInfo(step));
  }

  public async insertStep(
    contextId: string,
    processId: string,
    stepInfo: ITicketStep
  ): Promise<string> {
    const stepNode = await insertStepNode(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      stepInfo
    );
    graphServiceAddNode(stepNode);
    return stepNode.info.id.get();
  }

  //////////////////////////////////////////////////////////
  //                      TICKETS                         //
  //////////////////////////////////////////////////////////

  public async addTicket(
    ticketInfo: TicketInterface,
    processId: string,
    contextId: string,
    nodeId: string,
    ticketType: string = 'Ticket'
  ): Promise<string> {
    const ticketNode = await addTicket(
      ticketInfo,
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(nodeId),
      ticketType
    );
    graphServiceAddNode(ticketNode);
    return ticketNode.info.id.get();
  }

  public async getTicketsFromNode(nodeId: string) {
    const data = await getTicketsFromNode(graphServiceGetRealNode(nodeId));
    return data.map((ticket) => {
      return graphServiceGetInfo(ticket);
    });
  }

  public async getAlarmsFromNode(nodeId: string) {
    const data = await getAlarmsFromNode(graphServiceGetRealNode(nodeId));
    return data.map((alarm) => graphServiceGetInfo(alarm));
  }

  public async getTicketsFromStep(stepId: string) {
    const data = await getTicketsFromStep(graphServiceGetRealNode(stepId));
    return data.map((ticket) => graphServiceGetRef(ticket));
  }

  public async getTicketProcess(ticketId: string) {
    const data = await getProcessFromTicket(graphServiceGetRealNode(ticketId));
    graphServiceAddNode(data);
    return data;
  }

  public async moveTicket(
    ticketId: string,
    stepFromId: string,
    stepToId: string,
    contextId: string
  ) {
    return moveTicketNode(
      graphServiceGetRealNode(ticketId),
      graphServiceGetRealNode(stepFromId),
      graphServiceGetRealNode(stepToId),
      graphServiceGetRealNode(contextId)
    );
  }

  public async moveTicketToStep(
    ticketId: string,
    stepFromId: string,
    stepToId: string,
    contextId: string
  ) {
    return moveTicketToStep(
      graphServiceGetRealNode(ticketId),
      graphServiceGetRealNode(stepFromId),
      graphServiceGetRealNode(stepToId),
      graphServiceGetRealNode(contextId)
    );
  }

  public async moveTicketToNextStep(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ) {
    const data = await moveTicketToNextStep(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(ticketId),
      userInfo
    );
    return graphServiceGetInfo(data);
  }

  public async moveTicketToPreviousStep(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ) {
    const data = await moveTicketToPreviousStep(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(ticketId),
      userInfo
    );
    return graphServiceGetInfo(data);
  }

  public async ArchiveTickets(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ) {
    const data = await archiveTickets(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(ticketId),
      userInfo
    );
    return graphServiceGetInfo(data);
  }

  public async unarchiveTicket(
    contextId: string,
    processId: string,
    ticketId: string,
    userInfo: IUserInfo = {}
  ) {
    const data = await unarchiveTicket(
      graphServiceGetRealNode(contextId),
      graphServiceGetRealNode(processId),
      graphServiceGetRealNode(ticketId),
      userInfo
    );
    return graphServiceGetInfo(data);
  }

  public unlinkTicketToProcess(ticketId: string) {}

  public getTicketContextId(ticketId: string): string {
    return getTicketContextId(graphServiceGetRealNode(ticketId));
  }

  public async changeTicketProcess(
    ticketId: string,
    newProcessId: string,
    newContextId?: string
  ) {
    const data = await changeTicketProcess(
      graphServiceGetRealNode(ticketId),
      graphServiceGetRealNode(newProcessId),
      graphServiceGetRealNode(newContextId)
    );
    graphServiceAddNode(data);
    return data.info.id.get();
  }

  /**
   * Changes the target node of a ticket element.
   * e.g change the room linked to a ticket.
   * @param {string} ticketId
   * @param {string} newElementId
   * @return {*}
   * @memberof ServiceTicket
   */
  public async changeTicketElementNode(ticketId: string, newElementId: string) {
    const data = await changeTicketNodeTarget(
      graphServiceGetRealNode(ticketId),
      graphServiceGetRealNode(newElementId)
    );
    graphServiceAddNode(data);
    return data.info.id.get();
  }

  //////////////////////////////////////////////////////////
  //                      LOGS                            //
  //////////////////////////////////////////////////////////

  public async addLogToTicket(
    ticketId: string,
    event: number,
    userInfo: IUserInfo = {},
    fromId?: string,
    toId?: string
  ) {
    try {
      const data = await addLogToTicketNode(
        graphServiceGetRealNode(ticketId),
        event,
        userInfo,
        fromId,
        toId
      );
      graphServiceAddNode(data);
      return true;
    } catch (error) {
      return false;
    }
  }

  public createLog(info: SpinalLogTicketInterface): string {
    const data = createTicketLog(info);
    graphServiceAddNode(data);
    return data.info.id.get();
  }

  public async getLogs(ticketId: string) {
    return getTicketLogs(graphServiceGetRealNode(ticketId));
  }

  //////////////////////////////////////////////////////////
  //                      COMMON INCIDENT                 //
  //////////////////////////////////////////////////////////

  public async addCommonIncident(
    processId: string,
    sentence: string
  ): Promise<string> {
    const data = await addCommonIncident(
      graphServiceGetRealNode(processId),
      sentence
    );
    graphServiceAddNode(data);
    return data.info.id.get();
  }

  public async getCommonIncident(processId: string) {
    const data = await getCommonIncident(graphServiceGetRealNode(processId));
    return data.map((incident) => {
      return graphServiceGetInfo(incident);
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //                                              ARCHIVE                                         //
  //////////////////////////////////////////////////////////////////////////////////////////////////

  async getTicketsFromArchive(
    processOrSpatialNode: string | SpinalNode,
    begin: moment.MomentInput,
    end: moment.MomentInput
  ) {
    processOrSpatialNode =
      typeof processOrSpatialNode === 'string'
        ? graphServiceGetRealNode(processOrSpatialNode)
        : processOrSpatialNode;
    return getTicketsFromArchive(processOrSpatialNode, begin, end);
  }
  async deleteTicketFromArchive(
    processOrSpatialNode: string | SpinalNode,
    begin: number,
    end: number
  ) {
    processOrSpatialNode =
      typeof processOrSpatialNode === 'string'
        ? graphServiceGetRealNode(processOrSpatialNode)
        : processOrSpatialNode;

    if (!processOrSpatialNode)
      throw new Error(
        "deleteTicketFromArchive process or spatial node ID given don't exist in graph service."
      );

    return deleteTicketFromArchive(processOrSpatialNode, begin, end);
  }
  async updateArchivePartData(
    archivePart: ISpinalNodeArchivePart,
    archiveTicketNode: SpinalNode,
    timeStampAttr: string
  ) {
    return updateArchivePartData(archivePart, archiveTicketNode, timeStampAttr);
  }
  archiveTicketFromProcess(
    ticketNode: string | SpinalNode,
    processNode: string | SpinalNode,
    date: moment.MomentInput,
    maxArchiveSize = 200
  ) {
    ticketNode =
      typeof ticketNode === 'string'
        ? graphServiceGetRealNode(ticketNode)
        : ticketNode;
    processNode =
      typeof processNode === 'string'
        ? graphServiceGetRealNode(processNode)
        : processNode;
    if (!processNode) {
      throw new Error(
        "archiveTicket process node ID given don't exist in graph service."
      );
    }
    return archiveTicketFromProcess(
      ticketNode,
      processNode,
      date,
      maxArchiveSize
    );
  }

  archiveTicketFromSpatial(
    ticketNode: string | SpinalNode,
    spatialNode: string | SpinalNode,
    date: moment.MomentInput,
    maxArchiveSize = 200
  ) {
    ticketNode =
      typeof ticketNode === 'string'
        ? graphServiceGetRealNode(ticketNode)
        : ticketNode;
    spatialNode =
      typeof spatialNode === 'string'
        ? graphServiceGetRealNode(spatialNode)
        : spatialNode;
    if (!spatialNode) {
      throw new Error(
        "archiveTicket spatial node ID given don't exist in graph service."
      );
    }
    return archiveTicketFromSpatial(
      ticketNode,
      spatialNode,
      date,
      maxArchiveSize
    );
  }
}
