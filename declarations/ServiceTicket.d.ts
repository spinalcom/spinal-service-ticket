import { SpinalLogTicket, SpinalLogTicketInterface } from "spinal-models-ticket/dist/SpinalLogTicket";
import { TicketInterface } from 'spinal-models-ticket/dist/SpinalTicket';
import { SpinalProcess } from "spinal-models-ticket/dist/SpinalProcess";
export declare class ServiceTicket {
    constructor();
    createContext(contextName: string, steps?: Array<{
        name: string;
        color?: string;
        order: number;
    }>): Promise<any | Error>;
    getContexts(name?: string): any | any[];
    updateContexts(contextId: string, newInfo: {
        name: string;
        steps: Array<{
            name: string;
            color?: string;
            order: number;
        }>;
    }): Promise<any | Error>;
    createProcess(process: SpinalProcess | string, contextId: string): Promise<string>;
    getAllProcess(contextId: string): Promise<import("spinal-env-viewer-graph-service/declarations/GraphManagerService").SpinalNodeRef[]>;
    addStep(processId: string, contextId: string, name: string, color: string, order: number): Promise<any | Error>;
    addStepById(stepId: string, processId: string, contextId: string): Promise<boolean | Error>;
    getStepsFromProcess(processId: string, contextId: string): Promise<any>;
    getFirstStep(processId: string, contextId: string): Promise<string>;
    getNextStep(processId: string, stepId: string, contextId: string): Promise<any>;
    getPreviousStep(processId: string, stepId: string, contextId: string): Promise<any>;
    getSuperiorsSteps(contextId: string, processId: string, stepOrder: number, equals?: Boolean): Promise<any>;
    getInferiorsSteps(contextId: string, processId: string, stepOrder: number, equals?: Boolean): Promise<any>;
    insertStep(contextId: string, processId: string, stepInfo: {
        name: string;
        color?: string;
        order: number;
    }): Promise<any>;
    addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string): Promise<string | Error>;
    getTicketsFromNode(nodeId: string): Promise<any[]>;
    getTicketsFromStep(stepId: string): Promise<any>;
    moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<any>;
    moveTicketToNextStep(contextId: string, processId: string, ticketId: string, userInfo?: Object): Promise<void>;
    moveTicketToPreviousStep(contextId: string, processId: string, ticketId: string, userInfo?: object): Promise<void>;
    ArchiveTickets(contextId: string, processId: string, ticketId: string, userInfo?: Object): Promise<any>;
    unarchiveTicket(contextId: string, processId: string, ticketId: string, userInfo?: Object): Promise<any>;
    addLogToTicket(ticketId: string, event: number, userInfo?: Object, fromId?: string, toId?: string): any;
    createLog(info: SpinalLogTicketInterface): string;
    getLogs(ticketId: string): Promise<SpinalLogTicket[]>;
    addCommonIncident(processId: string, sentence: string): Promise<boolean | string>;
    getCommonIncident(processId: string): Promise<any>;
    private createAttribute;
    private modifyStepProcessId;
    private modifyTicketStepId;
    private createTicket;
    private createStep;
    private getContextSteps;
    private addSentenceSection;
    private getObjData;
    private createArchivedStep;
    private createStepNode;
    private sortStepByOrder;
}
