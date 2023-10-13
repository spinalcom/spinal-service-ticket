import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { SpinalLogTicket, SpinalLogTicketInterface } from 'spinal-models-ticket/dist/SpinalLogTicket';
import { TicketInterface } from 'spinal-models-ticket/dist/SpinalTicket';
import { SpinalProcess } from 'spinal-models-ticket/dist/SpinalProcess';
import { IUserInfo } from './interfaces/IUserInfo';
import * as moment from 'moment';
import { ISpinalNodeArchivePart } from './interfaces/ISpinalNodePart';
export declare class ServiceTicket {
    constructor();
    createContext(contextName: string, steps?: Array<{
        name: string;
        color?: string;
        order: number;
    }>, contextSubType?: string): Promise<any | Error>;
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
    getAllProcess(contextId: string): Promise<import("spinal-env-viewer-graph-service").SpinalNodeRef[]>;
    addStep(processId: string, contextId: string, name: string, color: string, order: number): Promise<any | Error>;
    removeStep(processId: string, contextId: string, stepId: string): Promise<string>;
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
    addTicket(ticketInfo: TicketInterface, processId: string, contextId: string, nodeId: string, ticketType?: string): Promise<string | Error>;
    getTicketsFromNode(nodeId: string): Promise<any[]>;
    getAlarmsFromNode(nodeId: string): Promise<any[]>;
    getTicketsFromStep(stepId: string): Promise<any>;
    moveTicket(ticketId: string, stepFromId: string, stepToId: string, contextId: string): Promise<any>;
    moveTicketToNextStep(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<void>;
    moveTicketToPreviousStep(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<void>;
    ArchiveTickets(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<any>;
    unarchiveTicket(contextId: string, processId: string, ticketId: string, userInfo?: IUserInfo): Promise<any>;
    unlinkTicketToProcess(ticketId: string): void;
    getTicketContextId(ticketId: string): string;
    changeTicketProcess(ticketId: string, newProcessId: string, newContextId?: string): Promise<string>;
    changeTicketElementNode(ticketId: string, newElementId: string): Promise<string>;
    addLogToTicket(ticketId: string, event: number, userInfo?: IUserInfo, fromId?: string, toId?: string): any;
    createLog(info: SpinalLogTicketInterface): string;
    getLogs(ticketId: string): Promise<SpinalLogTicket[]>;
    addCommonIncident(processId: string, sentence: string): Promise<boolean | string>;
    getCommonIncident(processId: string): Promise<any>;
    private modifyStepProcessId;
    private modifyTicketStepId;
    private createTicket;
    private createAttribute;
    private createStep;
    private getContextSteps;
    private addSentenceSection;
    private getObjData;
    private createArchivedStep;
    private createStepNode;
    private sortStepByOrder;
    private removeFromContextId;
    private getOldStepId;
    getTicketsFromArchive(processOrSpatialNode: string | SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): Promise<SpinalNode<any>[]>;
    getTicketsFromArchiveGen(processOrSpatialNode: string | SpinalNode, begin: moment.MomentInput, end: moment.MomentInput): AsyncGenerator<SpinalNode<any>, void, unknown>;
    deleteTicketFromArchive(processOrSpatialNode: string | SpinalNode, begin: number, end: number): Promise<void>;
    updateArchivePartData(archivePart: ISpinalNodeArchivePart, archiveTicketNode: SpinalNode, timeStampAttr: string): Promise<void>;
    archiveTicketFromProcess(ticketNode: string | SpinalNode, processNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
    archiveTicketFromSpatial(ticketNode: string | SpinalNode, spatialNode: string | SpinalNode, date: moment.MomentInput, maxArchiveSize?: number): Promise<void>;
    private archiveTicket;
    private removeTicketFromParent;
    private getAchivePartsFromArchive;
    private getArchivePartFromArchive;
    private getArchive;
    private getOrCreateArchive;
    private getArchivePartNameDate;
}
