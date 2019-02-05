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
import { SpinalProcess } from 'spinal-models-ticket/declarations/SpinalProcess';
import { SpinalLogTicket } from 'spinal-models-ticket/declarations/SpinalLogTicket';

export declare class ServiceTicket {
    contextId: string;
    private context;
    private processNames;
    private processes;
    initialized: boolean;
    private steps;
    private tickets;
    private processByStep;
    private stepByProcess;
    private ticketByStep;
    constructor();
    isInitialized(): boolean;
    init(): void;

  getProcessByName(name: string): string;
    addCategory(processId: string, sentence: string): Promise<boolean | string>;
    addSubCategory(categoryId: string, sentence: string): Promise<boolean | string>;
    addStep(stepId: string, processId: string): Promise<boolean | Error>;
    addLocationToTicket(ticketId: string, bimId: string): Promise<boolean>;
    addTicketToProcessWithUser(ticketId: string, processId: string, userId: string): Promise<boolean | Error>;
    addTicketToProcess(ticketId: string, processId: string): Promise<boolean | Error>;
    addTicket(ticketId: string, stepId: string): Promise<boolean | Error>;
    createProcess(process: SpinalProcess): Promise<string | Error>;
    createStep(name: string, color: string): string;
    createTicket(info: TicketInterface): string;
    createLog(info: SpinalLogTicket): string;
    getTicketForUser(userId: string): Promise<any>;
    createArchives(): Promise<boolean | Error>;
    getContext(): Promise<string>;
    getAllProcess(): Set<string>;
    getAllTickets(): Set<string>;
    getStepsFromProcess(processId: string): string[];
    getTicketsFromStep(stepId: string): string[];
    getCategoriesFromProcess(processId: string): Promise<{
        id: string;
        children: string[];
    }[]>;
    moveTicket(ticketId: string, stepFromId: string, stepToId: string): void;
    private getCategories;
    private initVar;
    private retrieveStep;
    private addStepToProcess;
    private addTicketToStep;
    private addTicketToProcessTicketSection;
    private createContext;
    private addSentenceSection;
    private addTicketSection;
    private initProcess;
    private createDefaultSteps;
}
