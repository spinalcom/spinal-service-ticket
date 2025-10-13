import { SpinalNode } from 'spinal-model-graph';
import { SpinalNodeRef } from './GraphService';
import { ITicketStep } from './interfaces/ITicketStep';
import { ISpinalNodeArchivePart } from './interfaces/ISpinalNodePart';
import { IUserInfo } from './interfaces/IUserInfo';
import type { SpinalLogTicketInterface, SpinalProcess, TicketInterface } from 'spinal-models-ticket';
export declare class ServiceTicket {
    constructor();
    createContext(contextName: string, steps?: ITicketStep[], contextSubType?: string): Promise<import("spinal-model-graph/declarations/Nodes/SpinalContext").default<any>>;
    getContexts(name?: string): Promise<any[] | import("spinal-model-graph/declarations/Nodes/SpinalContext").default<any>>;
    updateContexts(contextId: string, newInfo: {
        name: string;
    }): Promise<void>;
    createProcess(process: SpinalProcess | string, contextId: string): Promise<string>;
    getAllProcess(contextId: string): Promise<SpinalNodeRef[]>;
    addStep(processId: string, contextId: string, name: string, color: string, order: number): Promise<string>;
    removeStep(processId: string, contextId: string, stepId: string): Promise<string>;
    addStepById(stepId: string, processId: string, contextId: string): Promise<void>;
    getStepsFromProcess(processId: string, contextId: string): Promise<SpinalNodeRef[]>;
    getFirstStep(processId: string, contextId: string): Promise<string>;
    getNextStep(processId: string, stepId: string, contextId: string): Promise<SpinalNodeRef>;
    getPreviousStep(processId: string, stepId: string, contextId: string): Promise<SpinalNodeRef>;
    getSuperiorsSteps(contextId: string, processId: string, stepOrder: number, equals?: Boolean): Promise<Record<string, any>[]>;
    getInferiorsSteps(contextId: string, processId: string, stepOrder: number, equals?: Boolean): Promise<Record<string, any>[]>;
    insertStep(contextId: string, processId: string, stepInfo: ITicketStep): Promise<string>;
    addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string, ticketType?: string): Promise<string>;
    getTicketsFromNode(nodeId: string): Promise<Record<string, any>[]>;
    getAlarmsFromNode(nodeId: string): Promise<Record<string, any>[]>;
    getTicketsFromStep(stepId: string): Promise<SpinalNodeRef[]>;
    getTicketProcess(ticketId: string): Promise<SpinalNode<any>>;
    moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<void>;
    moveTicketToStep(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<void>;
    moveTicketToNextStep(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<Record<string, any>>;
    moveTicketToPreviousStep(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<Record<string, any>>;
    ArchiveTickets(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<Record<string, any>>;
    unarchiveTicket(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<Record<string, any>>;
    unlinkTicketToProcess(ticketId: string): void;
    getTicketContextId(ticketId: string): string;
    changeTicketProcess(ticketId: string, newProcessId: string, newContextId?: string): Promise<string>;
    /**
     * Changes the target node of a ticket element.
     * e.g change the room linked to a ticket.
     * @param {string} ticketId
     * @param {string} newElementId
     * @return {*}
     * @memberof ServiceTicket
     */
    changeTicketElementNode(ticketId: string, newElementId: string): Promise<string>;
    addLogToTicket(ticketId: string, event: number, userInfo?: IUserInfo, fromId?: string, toId?: string): Promise<boolean>;
    createLog(info: SpinalLogTicketInterface): string;
    getLogs(ticketId: string): Promise<SpinalLogTicketInterface[]>;
    addCommonIncident(processId: string, sentence: string): Promise<string>;
    getCommonIncident(processId: string): Promise<Record<string, any>[]>;
    getTicketsFromArchive(processOrSpatialNode: string | SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): Promise<SpinalNode<any>[]>;
    deleteTicketFromArchive(processOrSpatialNode: string | SpinalNode, begin: number, end: number): Promise<void>;
    updateArchivePartData(archivePart: ISpinalNodeArchivePart, archiveTicketNode: SpinalNode, timeStampAttr: string): Promise<void>;
    archiveTicketFromProcess(ticketNode: string | SpinalNode, processNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
    archiveTicketFromSpatial(ticketNode: string | SpinalNode, spatialNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
}
