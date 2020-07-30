import { TicketInterface } from 'spinal-models-ticket/declarations/SpinalTicket';
import { SpinalProcess } from 'spinal-models-ticket/declarations/SpinalProcess';
import { SpinalLogTicket } from 'spinal-models-ticket/dist/SpinalLogTicket';
export declare class ServiceTicketPersonalized {
    constructor();
    createContext(contextName: string, steps?: Array<any>): Promise<any | Error>;
    getContexts(): any[];
    createProcess(process: SpinalProcess, contextId: string): Promise<string>;
    addStep(name: string, color: string, order: number, processId: string, contextId: string): Promise<boolean | Error>;
    addStepById(stepId: string, processId: string, contextId: string): Promise<boolean | Error>;
    addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string): Promise<boolean | Error>;
    addLocationToTicket(ticketId: string, bimId: string): Promise<boolean>;
    createLog(info: SpinalLogTicket): string;
    getTicketForUser(userId: string): Promise<any>;
    createArchives(contextId: string): Promise<boolean | Error>;
    getAllProcess(contextId: string): Promise<import("spinal-env-viewer-graph-service/declarations/GraphManagerService").SpinalNodeRef[]>;
    getFirstStep(processId: string, contextId: string): Promise<string>;
    getStepsFromProcess(processId: string): Promise<any>;
    getTicketsFromStep(stepId: string): Promise<import("spinal-env-viewer-graph-service/declarations/GraphManagerService").SpinalNodeRef[]>;
    moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<void>;
    addCommonIncident(processId: string, sentence: string): Promise<boolean | string>;
    getCommonIncident(processId: string): Promise<any>;
    private modifyStepProcessId;
    private modifyTicketStepId;
    private createTicket;
    private createStep;
    private getContextSteps;
    private addSentenceSection;
}
