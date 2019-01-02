import { TicketInterface } from "spinal-models-ticket/declarations/SpinalTicket";
export declare class ServiceTicket {
    context: any;
    contextId: string;
    processNames: Set<string>;
    processes: Set<string>;
    initialized: boolean;
    steps: Set<string>;
    tickets: Set<string>;
    stepByProcess: Map<string, Array<string>>;
    ticketByStep: Map<string, Array<string>>;
    constructor();
    _init(contextId: any): any;
    _addStepToProcess(stepId: any, processId: any): boolean;
    _addTicketToStep(ticketId: any, stepId: any): boolean;
    addStep(stepId: any, processId: any): any;
    addTicket(ticketId: any, stepId: any): any;
    createContext(): any;
    createProcess(name: string): any;
    createStep(name: string, color: string): any;
    createTicket(info: TicketInterface): any;
    createArchives(): any;
    getContext(): any;
    getAllProcess(): Set<string>;
    getAllTickets(): Set<string>;
    getStepsFromProcess(processId: any): string[];
    getTicketsFromStep(stepId: any): string[];
}
