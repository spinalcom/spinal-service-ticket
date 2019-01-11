/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

import { TicketInterface } from 'spinal-models-ticket/declarations/SpinalTicket';
import { SpinalProcess } from '../../spinal-models-ticket/declarations/SpinalProcess';

export declare class ServiceTicket {
    contextId: string;
    private context;
    private processNames;
    private processes;
    private initialized;
    private steps;
    private tickets;
    private processByStep;
    private stepByProcess;
    private ticketByStep;
    constructor();
    init(): void;
    addDefaultSentence(processId: string, sentence: string): Promise<boolean | string>;
    addStep(stepId: string, processId: string): Promise<boolean | Error>;

  private retrieveStep;
    addTicket(ticketId: string, stepId: string): Promise<boolean | Error>;

  private addTicketToProcessTicketSection;
    createStep(name: string, color: string): string;
    createTicket(info: TicketInterface): any;
    createArchives(): Promise<boolean | Error>;
    getContext(): Promise<string>;
    getAllProcess(): Set<string>;
    getAllTickets(): Set<string>;
    getStepsFromProcess(processId: string): string[];
    getTicketsFromStep(stepId: string): string[];

  private addTicketSection;
  private initProcess;
    private initVar;
  private createDefaultSteps;
    private addStepToProcess;
    private addTicketToStep;

  addTicketToProcess(ticketId: string, processId: string): Promise<boolean | Error>;
    private createContext;
    private addSentenceSection;

  createProcess(process: SpinalProcess): Promise<string | Error>;

  getDefaultSentenceFromProcess(processId: string): Promise<string[]>;

  moveTicket(ticketId: string, stepFromId: string, stepToId: string): void;
}
