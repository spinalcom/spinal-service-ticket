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

export declare class ServiceTicket {
    context: any;
    contextId: string;
    processNames: Set<string>;
    processes: Set<string>;
    initialized: boolean;
    steps: Set<string>;
    tickets: Set<string>;
  stepByProcess: Map<string, string[]>;
  ticketByStep: Map<string, string[]>;
    constructor();

  private initVar;
  private addStepToProcess;
  private addTicketToStep;
  private createContext;

  init(): void;
    createTicket(info: TicketInterface): any;

  addStep(stepId: string, processId: string): Promise<boolean | Error>;

  addTicket(ticketId: string, stepId: string): Promise<boolean | Error>;
    getAllProcess(): Set<string>;
    getAllTickets(): Set<string>;

  createProcess(name: string): Promise<string | Error>;

  createStep(name: string, color: string): string;

  createArchives(): Promise<boolean | Error>;

  getContext(): Promise<string>;

  getStepsFromProcess(processId: string): string[];

  getTicketsFromStep(stepId: string): string[];
}
